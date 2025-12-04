/**
 * Middleware d'authentification JWT
 * Protège les routes et vérifie les permissions
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from './errorMiddleware.js';
import { jwtConfig } from '../config/jwt.js';
import logger from '../utils/logger.js';

/**
 * Middleware : Protéger les routes (vérifier le token JWT)
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token depuis l'en-tête Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Non autorisé. Veuillez vous connecter.', 401));
    }

    try {
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // Récupérer l'utilisateur (sans le mot de passe)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new AppError('Utilisateur non trouvé', 404));
      }

      if (!user.isActive) {
        return next(new AppError('Votre compte a été désactivé', 403));
      }

      // Ajouter l'utilisateur à la requête
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        logger.info(`Token expiré pour une requête vers ${req.originalUrl}`);
        return next(new AppError('Token expiré', 401));
      }
      if (error.name === 'JsonWebTokenError') {
        logger.warn(`Token invalide reçu: ${token?.substring(0, 20)}...`);
        return next(new AppError('Token invalide', 401));
      }
      throw error;
    }
  } catch (error) {
    logger.error(`Erreur d'authentification: ${error.message}`);
    next(error);
  }
};

/**
 * Middleware : Restreindre l'accès à certains rôles
 * @param  {...string} roles - Rôles autorisés
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Vous n'avez pas la permission d'effectuer cette action", 403)
      );
    }
    next();
  };
};

/**
 * Middleware : Vérifier une permission spécifique
 * @param {string} permission - Permission requise
 */
export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return next(
        new AppError("Vous n'avez pas la permission d'effectuer cette action", 403)
      );
    }
    next();
  };
};

/**
 * Middleware : Vérifier si l'utilisateur est admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Accès réservé aux administrateurs', 403));
  }
  next();
};

/**
 * Middleware : Vérifier si l'utilisateur est le propriétaire de la ressource
 * @param {string} resourceUserField - Nom du champ contenant l'ID utilisateur dans la ressource
 */
export const isOwner = (resourceUserField = 'user') => {
  return (req, res, next) => {
    // Récupérer l'ID de l'utilisateur depuis les paramètres ou le body
    const resourceUserId = req.params.userId || req.body[resourceUserField];

    if (!resourceUserId) {
      return next(new AppError('ID utilisateur manquant dans la ressource', 400));
    }

    // Vérifier si l'utilisateur actuel est le propriétaire ou un admin
    if (
      req.user._id.toString() !== resourceUserId.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError("Vous n'avez pas accès à cette ressource", 403));
    }

    next();
  };
};
