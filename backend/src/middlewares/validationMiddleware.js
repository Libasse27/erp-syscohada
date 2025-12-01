/**
 * Middleware de validation
 * Validation générique avec Joi pour les requêtes
 */

import { AppError } from './errorMiddleware.js';
import logger from '../utils/logger.js';

/**
 * Middleware de validation Joi générique
 * @param {object} schema - Schéma Joi de validation
 * @param {string} source - Source des données ('body', 'query', 'params')
 * @returns {function} Middleware Express
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Retourner toutes les erreurs
      stripUnknown: true, // Supprimer les champs non définis
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation échouée:', { errors, source });

      return next(
        new AppError(
          `Validation échouée: ${errors.map((e) => e.message).join(', ')}`,
          400
        )
      );
    }

    // Remplacer les données validées
    req[source] = value;
    next();
  };
};

/**
 * Middleware de validation pour le body
 * @param {object} schema - Schéma Joi de validation
 * @returns {function} Middleware Express
 */
export const validateBody = (schema) => validate(schema, 'body');

/**
 * Middleware de validation pour les query params
 * @param {object} schema - Schéma Joi de validation
 * @returns {function} Middleware Express
 */
export const validateQuery = (schema) => validate(schema, 'query');

/**
 * Middleware de validation pour les params d'URL
 * @param {object} schema - Schéma Joi de validation
 * @returns {function} Middleware Express
 */
export const validateParams = (schema) => validate(schema, 'params');

/**
 * Validation d'un ObjectId MongoDB
 * @param {string} paramName - Nom du paramètre à valider
 * @returns {function} Middleware Express
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(id)) {
      return next(new AppError(`ID invalide: ${paramName}`, 400));
    }

    next();
  };
};

/**
 * Validation d'une date
 * @param {string} fieldName - Nom du champ date
 * @param {string} source - Source ('body', 'query', 'params')
 * @returns {function} Middleware Express
 */
export const validateDate = (fieldName, source = 'body') => {
  return (req, res, next) => {
    const dateValue = req[source][fieldName];

    if (!dateValue) {
      return next();
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return next(new AppError(`Date invalide: ${fieldName}`, 400));
    }

    req[source][fieldName] = date;
    next();
  };
};

/**
 * Validation d'un montant (nombre positif)
 * @param {string} fieldName - Nom du champ montant
 * @returns {function} Middleware Express
 */
export const validateAmount = (fieldName) => {
  return (req, res, next) => {
    const amount = req.body[fieldName];

    if (amount === undefined || amount === null) {
      return next();
    }

    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < 0) {
      return next(
        new AppError(`Montant invalide pour ${fieldName}: doit être un nombre positif`, 400)
      );
    }

    req.body[fieldName] = numAmount;
    next();
  };
};

/**
 * Sanitize HTML dans les champs texte pour prévenir XSS
 * @param {string[]} fields - Champs à sanitizer
 * @returns {function} Middleware Express
 */
export const sanitizeHtml = (fields = []) => {
  return (req, res, next) => {
    fields.forEach((field) => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        // Supprimer les balises HTML
        req.body[field] = req.body[field]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]+>/g, '')
          .trim();
      }
    });
    next();
  };
};

/**
 * Validation d'un email
 * @param {string} fieldName - Nom du champ email
 * @returns {function} Middleware Express
 */
export const validateEmail = (fieldName = 'email') => {
  return (req, res, next) => {
    const email = req.body[fieldName];

    if (!email) {
      return next(new AppError(`${fieldName} est requis`, 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return next(new AppError(`${fieldName} invalide`, 400));
    }

    // Normaliser l'email en minuscules
    req.body[fieldName] = email.toLowerCase().trim();
    next();
  };
};

/**
 * Validation de la pagination
 * @returns {function} Middleware Express
 */
export const validatePagination = () => {
  return (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const maxLimit = parseInt(process.env.MAX_PAGE_SIZE) || 100;

    if (page < 1) {
      return next(new AppError('Le numéro de page doit être supérieur à 0', 400));
    }

    if (limit < 1 || limit > maxLimit) {
      return next(
        new AppError(`La limite doit être entre 1 et ${maxLimit}`, 400)
      );
    }

    req.pagination = {
      page,
      limit,
      skip: (page - 1) * limit,
    };

    next();
  };
};

export default {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  validateObjectId,
  validateDate,
  validateAmount,
  sanitizeHtml,
  validateEmail,
  validatePagination,
};
