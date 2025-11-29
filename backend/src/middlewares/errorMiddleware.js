/**
 * Middleware de gestion centralisée des erreurs
 */

import logger from '../utils/logger.js';

/**
 * Classe d'erreur personnalisée
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware de gestion des erreurs
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  logger.error(err);

  // Erreur Mongoose - ID invalide
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = new AppError(message, 404);
  }

  // Erreur Mongoose - Duplication
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Ce ${field} existe déjà`;
    error = new AppError(message, 400);
  }

  // Erreur Mongoose - Validation
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const message = messages.join('. ');
    error = new AppError(message, 400);
  }

  // Erreur JWT - Token invalide
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token invalide';
    error = new AppError(message, 401);
  }

  // Erreur JWT - Token expiré
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expiré';
    error = new AppError(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Middleware pour les routes non trouvées
 */
export const notFound = (req, res, next) => {
  const error = new AppError(`Route non trouvée - ${req.originalUrl}`, 404);
  next(error);
};
