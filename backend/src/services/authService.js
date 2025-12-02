/**
 * Service d'authentification
 * Gestion de l'authentification, tokens JWT et sécurité
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { AppError } from '../middlewares/errorMiddleware.js';

/**
 * Générer un token d'accès JWT
 * @param {string} userId - ID de l'utilisateur
 * @returns {string} Token JWT
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
  });
};

/**
 * Générer un refresh token JWT
 * @param {string} userId - ID de l'utilisateur
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

/**
 * Vérifier un token JWT
 * @param {string} token - Token à vérifier
 * @param {string} secret - Secret pour vérifier le token
 * @returns {object} Payload décodé
 */
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expiré', 401);
    }
    throw new AppError('Token invalide', 401);
  }
};

/**
 * Inscrire un nouvel utilisateur
 * @param {object} userData - Données de l'utilisateur
 * @returns {object} Utilisateur créé et tokens
 */
export const register = async (userData) => {
  const { email, password, firstName, lastName, company } = userData;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Un utilisateur avec cet email existe déjà', 400);
  }

  // Créer l'utilisateur
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    firstName,
    lastName,
    company,
    role: userData.role || 'user',
  });

  // Générer les tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Sauvegarder le refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: user.toPublicJSON(),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * Connecter un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {object} Utilisateur et tokens
 */
export const login = async (email, password) => {
  // Trouver l'utilisateur avec le mot de passe
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new AppError('Email ou mot de passe incorrect', 401);
  }

  // Vérifier le mot de passe
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Email ou mot de passe incorrect', 401);
  }

  // Vérifier si l'utilisateur est actif
  if (!user.isActive) {
    throw new AppError('Votre compte a été désactivé', 403);
  }

  // Mettre à jour la dernière connexion
  user.lastLogin = new Date();
  await user.save();

  // Générer les tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Sauvegarder le refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: user.toPublicJSON(),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * Rafraîchir les tokens
 * @param {string} refreshToken - Refresh token
 * @returns {object} Nouveaux tokens
 */
export const refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token requis', 401);
  }

  // Vérifier le refresh token
  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Trouver l'utilisateur
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user) {
    throw new AppError('Utilisateur non trouvé', 404);
  }

  // Vérifier que le refresh token correspond
  if (user.refreshToken !== refreshToken) {
    throw new AppError('Refresh token invalide', 401);
  }

  // Générer de nouveaux tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // Sauvegarder le nouveau refresh token
  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Déconnecter un utilisateur
 * @param {string} userId - ID de l'utilisateur
 */
export const logout = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
};

/**
 * Générer un token de réinitialisation de mot de passe
 * @param {string} email - Email de l'utilisateur
 * @returns {object} Token et utilisateur
 */
export const generatePasswordResetToken = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('Aucun utilisateur trouvé avec cet email', 404);
  }

  // Générer un token aléatoire
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hasher le token et le sauvegarder
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 3600000; // 1 heure

  await user.save();

  return { resetToken, user };
};

/**
 * Réinitialiser le mot de passe
 * @param {string} resetToken - Token de réinitialisation
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {object} Utilisateur et tokens
 */
export const resetPassword = async (resetToken, newPassword) => {
  // Hasher le token pour le comparer
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Trouver l'utilisateur avec le token valide
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    throw new AppError('Token invalide ou expiré', 400);
  }

  // Mettre à jour le mot de passe
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Générer de nouveaux tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: user.toPublicJSON(),
    tokens: {
      accessToken,
      refreshToken,
    },
  };
};

/**
 * Changer le mot de passe
 * @param {string} userId - ID de l'utilisateur
 * @param {string} currentPassword - Mot de passe actuel
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {object} Utilisateur mis à jour
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError('Utilisateur non trouvé', 404);
  }

  // Vérifier le mot de passe actuel
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new AppError('Mot de passe actuel incorrect', 401);
  }

  // Mettre à jour le mot de passe
  user.password = newPassword;
  await user.save();

  return user.toPublicJSON();
};

/**
 * Vérifier les permissions d'un utilisateur
 * @param {object} user - Utilisateur
 * @param {string|array} requiredPermissions - Permission(s) requise(s)
 * @returns {boolean}
 */
export const checkPermissions = (user, requiredPermissions) => {
  if (!user) return false;

  // Admin a toutes les permissions
  if (user.role === 'admin') return true;

  // Convertir en tableau si c'est une chaîne
  const permissions = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  // Vérifier si l'utilisateur a toutes les permissions requises
  return permissions.every((permission) => user.permissions.includes(permission));
};

/**
 * Vérifier si un utilisateur a au moins une permission
 * @param {object} user - Utilisateur
 * @param {array} permissions - Liste de permissions
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  if (!user) return false;
  if (user.role === 'admin') return true;

  return permissions.some((permission) => user.permissions.includes(permission));
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  register,
  login,
  refreshTokens,
  logout,
  generatePasswordResetToken,
  resetPassword,
  changePassword,
  checkPermissions,
  hasAnyPermission,
};
