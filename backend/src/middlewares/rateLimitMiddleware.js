/**
 * Middleware de rate limiting
 * Protection contre les abus et attaques par force brute
 */

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import logger from '../utils/logger.js';

/**
 * Configuration générale du rate limiter
 */
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 minutes
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

/**
 * Handler personnalisé pour les dépassements de limite
 */
const handler = (req, res) => {
  logger.warn(`Rate limit dépassé pour IP: ${req.ip}`);

  res.status(429).json({
    success: false,
    error: 'Trop de requêtes. Veuillez réessayer plus tard.',
    retryAfter: Math.ceil(windowMs / 1000), // en secondes
  });
};

/**
 * Rate limiter général pour toutes les routes API
 */
export const generalLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  handler,
  standardHeaders: true, // Retourner les infos dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactiver les headers `X-RateLimit-*`
  // store: new RedisStore({ ... }), // Utiliser Redis en production
});

/**
 * Rate limiter strict pour les routes d'authentification
 * Protection contre les attaques par force brute
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 tentatives de connexion
  skipSuccessfulRequests: true, // Ne compte que les requêtes échouées
  message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
  handler: (req, res) => {
    logger.warn(`Tentatives de connexion excessives pour IP: ${req.ip}, Email: ${req.body.email}`);

    res.status(429).json({
      success: false,
      error: 'Trop de tentatives de connexion. Compte temporairement bloqué.',
      retryAfter: 900, // 15 minutes en secondes
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour les inscriptions
 * Éviter la création de faux comptes en masse
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Maximum 3 inscriptions par heure par IP
  message: 'Trop d\'inscriptions depuis cette IP. Veuillez réessayer plus tard.',
  handler: (req, res) => {
    logger.warn(`Inscriptions excessives depuis IP: ${req.ip}`);

    res.status(429).json({
      success: false,
      error: 'Limite d\'inscriptions atteinte. Veuillez réessayer dans 1 heure.',
      retryAfter: 3600,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour la réinitialisation de mot de passe
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Maximum 3 demandes de réinitialisation par heure
  message: 'Trop de demandes de réinitialisation de mot de passe.',
  handler: (req, res) => {
    logger.warn(`Demandes excessives de reset password pour IP: ${req.ip}, Email: ${req.body.email}`);

    res.status(429).json({
      success: false,
      error: 'Trop de demandes de réinitialisation. Veuillez réessayer plus tard.',
      retryAfter: 3600,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour les opérations de création
 * Éviter le spam de création de ressources
 */
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Maximum 10 créations par minute
  message: 'Trop d\'opérations de création. Ralentissez.',
  handler,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour les uploads de fichiers
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Maximum 20 uploads par 15 minutes
  message: 'Trop d\'uploads de fichiers. Veuillez réessayer plus tard.',
  handler: (req, res) => {
    logger.warn(`Uploads excessifs depuis IP: ${req.ip}`);

    res.status(429).json({
      success: false,
      error: 'Limite d\'uploads atteinte. Veuillez réessayer plus tard.',
      retryAfter: 900,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour les requêtes de recherche
 */
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Maximum 30 recherches par minute
  message: 'Trop de recherches. Veuillez ralentir.',
  handler,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour les exports de données
 */
export const exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5, // Maximum 5 exports par heure
  message: 'Trop d\'exports de données. Veuillez réessayer plus tard.',
  handler: (req, res) => {
    logger.warn(`Exports excessifs depuis IP: ${req.ip}, User: ${req.user?.email}`);

    res.status(429).json({
      success: false,
      error: 'Limite d\'exports atteinte. Veuillez réessayer plus tard.',
      retryAfter: 3600,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour les opérations de suppression
 * Éviter les suppressions massives accidentelles ou malveillantes
 */
export const deleteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Maximum 5 suppressions par minute
  message: 'Trop d\'opérations de suppression. Ralentissez.',
  handler: (req, res) => {
    logger.warn(`Suppressions excessives depuis IP: ${req.ip}, User: ${req.user?.email}`);

    res.status(429).json({
      success: false,
      error: 'Trop de suppressions. Veuillez ralentir.',
      retryAfter: 60,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour les API externes (Mobile Money, etc.)
 * Protection contre l'épuisement des quotas d'API
 */
export const externalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Maximum 10 appels par minute
  message: 'Trop d\'appels aux services externes. Veuillez ralentir.',
  handler,
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Créer un rate limiter personnalisé
 * @param {object} options - Options du rate limiter
 * @returns {function} Middleware rate limiter
 */
export const createCustomLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes. Veuillez réessayer plus tard.',
    handler,
    standardHeaders: true,
    legacyHeaders: false,
  };

  return rateLimit({ ...defaultOptions, ...options });
};

/**
 * Rate limiter par utilisateur (basé sur l'ID utilisateur)
 * Nécessite que l'utilisateur soit authentifié
 */
export const userBasedLimiter = (max = 100, windowMs = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => {
      // Utiliser l'ID utilisateur si disponible, sinon l'IP
      return req.user?.id || req.ip;
    },
    handler,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export default {
  generalLimiter,
  authLimiter,
  registerLimiter,
  passwordResetLimiter,
  createLimiter,
  uploadLimiter,
  searchLimiter,
  exportLimiter,
  deleteLimiter,
  externalApiLimiter,
  createCustomLimiter,
  userBasedLimiter,
};
