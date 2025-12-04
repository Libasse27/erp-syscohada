/**
 * Controller d'authentification
 * Gestion de l'inscription, connexion, refresh token, etc.
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { jwtConfig, cookieOptions } from '../config/jwt.js';
import logger from '../utils/logger.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../validators/authValidator.js';

/**
 * Générer un Access Token JWT
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
  });
};

/**
 * Générer un Refresh Token JWT
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

/**
 * @desc    Inscrire un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    // Validation des données
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { firstName, lastName, email, password, phone, role } = value;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new AppError('Un utilisateur avec cet email existe déjà', 400));
    }

    // Vérifier si c'est le premier utilisateur (il devient automatiquement admin)
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;
    const userRole = isFirstUser ? 'admin' : (role || 'user');

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: userRole,
    });

    // Générer les tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Sauvegarder le refresh token dans la base de données
    user.refreshToken = refreshToken;
    await user.save();

    // Envoyer le refresh token dans un cookie httpOnly
    res.cookie('refreshToken', refreshToken, cookieOptions);

    if (isFirstUser) {
      logger.info(`Premier utilisateur inscrit en tant qu'ADMINISTRATEUR: ${user.email}`);
    } else {
      logger.info(`Nouvel utilisateur inscrit: ${user.email} (rôle: ${userRole})`);
    }

    res.status(201).json({
      success: true,
      message: isFirstUser
        ? 'Inscription réussie ! Vous êtes le premier utilisateur et avez été nommé Administrateur.'
        : 'Inscription réussie',
      data: {
        user: user.toPublicJSON(),
        accessToken,
      },
    });
  } catch (error) {
    logger.error(`Erreur lors de l'inscription: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Connecter un utilisateur
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    // Validation des données
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { email, password } = value;

    // Trouver l'utilisateur (avec le mot de passe)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return next(new AppError('Email ou mot de passe incorrect', 401));
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return next(new AppError('Votre compte a été désactivé. Contactez l\'administrateur', 403));
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError('Email ou mot de passe incorrect', 401));
    }

    // Générer les tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Mettre à jour le refresh token et la dernière connexion
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    // Envoyer le refresh token dans un cookie httpOnly
    res.cookie('refreshToken', refreshToken, cookieOptions);

    logger.info(`Utilisateur connecté: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: user.toPublicJSON(),
        accessToken,
      },
    });
  } catch (error) {
    logger.error(`Erreur lors de la connexion: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Rafraîchir l'Access Token
 * @route   POST /api/auth/refresh
 * @access  Public (avec refresh token)
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new AppError('Refresh token manquant', 401));
    }

    // Vérifier le refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return next(new AppError('Refresh token invalide ou expiré', 401));
    }

    // Trouver l'utilisateur
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError('Refresh token invalide', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Votre compte a été désactivé', 403));
    }

    // Générer un nouveau access token
    const newAccessToken = generateAccessToken(user._id);

    logger.info(`Access token rafraîchi pour: ${user.email}`);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    logger.error(`Erreur lors du refresh token: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Déconnecter un utilisateur
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    // Supprimer le refresh token de la base de données
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    // Supprimer le cookie
    res.clearCookie('refreshToken');

    logger.info(`Utilisateur déconnecté: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    });
  } catch (error) {
    logger.error(`Erreur lors de la déconnexion: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('company', 'name logo');

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    logger.error(`Erreur lors de la récupération du profil: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Mettre à jour le profil de l'utilisateur
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    // Validation des données
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    // Mettre à jour les champs autorisés
    const allowedFields = ['firstName', 'lastName', 'phone', 'avatar'];
    allowedFields.forEach((field) => {
      if (value[field] !== undefined) {
        user[field] = value[field];
      }
    });

    await user.save();

    logger.info(`Profil mis à jour pour: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Changer le mot de passe
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    // Validation des données
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { currentPassword, newPassword } = value;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return next(new AppError('Le mot de passe actuel est incorrect', 401));
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    logger.info(`Mot de passe changé pour: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Mot de passe changé avec succès',
    });
  } catch (error) {
    logger.error(`Erreur lors du changement de mot de passe: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Demander la réinitialisation du mot de passe
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    // Validation des données
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { email } = value;

    const user = await User.findByEmail(email);

    if (!user) {
      // Ne pas révéler si l'email existe ou non (sécurité)
      return res.status(200).json({
        success: true,
        message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé',
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 heure
    await user.save();

    // TODO: Envoyer l'email avec le token
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    // await sendEmail({ ... });

    logger.info(`Token de réinitialisation généré pour: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Un email de réinitialisation a été envoyé',
      // En développement, retourner le token (À SUPPRIMER EN PRODUCTION)
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    logger.error(`Erreur lors de la demande de réinitialisation: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Réinitialiser le mot de passe
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    // Validation des données
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { token, password } = value;

    // Hasher le token reçu
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Trouver l'utilisateur avec ce token valide
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return next(new AppError('Token invalide ou expiré', 400));
    }

    // Mettre à jour le mot de passe
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    logger.info(`Mot de passe réinitialisé pour: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
    });
  } catch (error) {
    logger.error(`Erreur lors de la réinitialisation du mot de passe: ${error.message}`);
    next(error);
  }
};
