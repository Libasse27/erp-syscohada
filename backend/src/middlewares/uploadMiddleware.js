/**
 * Middleware d'upload de fichiers
 * Gestion des uploads avec Multer et Cloudinary
 */

import multer from 'multer';
import path from 'path';
import { AppError } from './errorMiddleware.js';
import logger from '../utils/logger.js';

/**
 * Configuration Multer - Stockage en mémoire
 * Les fichiers sont stockés en mémoire pour être envoyés directement à Cloudinary
 */
const storage = multer.memoryStorage();

/**
 * Filtrer les fichiers par type MIME
 * @param {object} req - Requête Express
 * @param {object} file - Fichier uploadé
 * @param {function} cb - Callback
 */
const fileFilter = (req, file, cb) => {
  // Types de fichiers autorisés
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx|xls|xlsx/;

  const extname = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimetype = file.mimetype;

  // Vérifier si c'est une image
  if (mimetype.startsWith('image/')) {
    if (allowedImageTypes.test(extname)) {
      return cb(null, true);
    }
    return cb(
      new AppError(
        'Format d\'image non supporté. Formats acceptés: JPEG, PNG, GIF, WebP',
        400
      )
    );
  }

  // Vérifier si c'est un document
  if (allowedDocTypes.test(extname)) {
    return cb(null, true);
  }

  cb(new AppError('Type de fichier non supporté', 400));
};

/**
 * Configuration Multer de base
 */
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB par défaut
  },
  fileFilter,
});

/**
 * Middleware pour upload d'une seule image
 * @param {string} fieldName - Nom du champ dans le formulaire
 */
export const uploadSingleImage = (fieldName = 'image') => {
  return (req, res, next) => {
    const uploadHandler = upload.single(fieldName);

    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Erreurs Multer
        if (err.code === 'LIMIT_FILE_SIZE') {
          const maxSize = (parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024) / (1024 * 1024);
          return next(
            new AppError(`Fichier trop volumineux. Taille maximale: ${maxSize}MB`, 400)
          );
        }
        return next(new AppError(`Erreur d'upload: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }

      // Vérifier qu'un fichier a été uploadé
      if (!req.file) {
        return next(new AppError('Aucun fichier n\'a été uploadé', 400));
      }

      logger.info(`Fichier uploadé: ${req.file.originalname} (${req.file.size} bytes)`);
      next();
    });
  };
};

/**
 * Middleware pour upload de plusieurs images
 * @param {string} fieldName - Nom du champ dans le formulaire
 * @param {number} maxCount - Nombre maximum de fichiers
 */
export const uploadMultipleImages = (fieldName = 'images', maxCount = 10) => {
  return (req, res, next) => {
    const uploadHandler = upload.array(fieldName, maxCount);

    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const maxSize = (parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024) / (1024 * 1024);
          return next(
            new AppError(`Fichier trop volumineux. Taille maximale: ${maxSize}MB`, 400)
          );
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(
            new AppError(`Trop de fichiers. Maximum autorisé: ${maxCount}`, 400)
          );
        }
        return next(new AppError(`Erreur d'upload: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }

      if (!req.files || req.files.length === 0) {
        return next(new AppError('Aucun fichier n\'a été uploadé', 400));
      }

      logger.info(`${req.files.length} fichier(s) uploadé(s)`);
      next();
    });
  };
};

/**
 * Middleware pour upload d'un avatar
 * Limite la taille à 2MB pour les avatars
 */
export const uploadAvatar = () => {
  const avatarUpload = multer({
    storage,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const extname = path.extname(file.originalname).toLowerCase().replace('.', '');

      if (file.mimetype.startsWith('image/') && allowedTypes.test(extname)) {
        return cb(null, true);
      }

      cb(
        new AppError(
          'Format d\'avatar non supporté. Formats acceptés: JPEG, PNG, WebP',
          400
        )
      );
    },
  });

  return (req, res, next) => {
    const uploadHandler = avatarUpload.single('avatar');

    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('Avatar trop volumineux. Taille maximale: 2MB', 400));
        }
        return next(new AppError(`Erreur d'upload: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }

      next();
    });
  };
};

/**
 * Middleware pour upload de documents (PDF, Excel, Word)
 */
export const uploadDocument = (fieldName = 'document') => {
  const documentUpload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB pour les documents
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /pdf|doc|docx|xls|xlsx/;
      const extname = path.extname(file.originalname).toLowerCase().replace('.', '');

      if (allowedTypes.test(extname)) {
        return cb(null, true);
      }

      cb(
        new AppError(
          'Format de document non supporté. Formats acceptés: PDF, DOC, DOCX, XLS, XLSX',
          400
        )
      );
    },
  });

  return (req, res, next) => {
    const uploadHandler = documentUpload.single(fieldName);

    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            new AppError('Document trop volumineux. Taille maximale: 10MB', 400)
          );
        }
        return next(new AppError(`Erreur d'upload: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }

      if (!req.file) {
        return next(new AppError('Aucun document n\'a été uploadé', 400));
      }

      next();
    });
  };
};

/**
 * Middleware pour upload de plusieurs types de fichiers
 * Utilisé pour les formulaires avec plusieurs champs de fichiers
 */
export const uploadFields = (fields) => {
  return (req, res, next) => {
    const uploadHandler = upload.fields(fields);

    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const maxSize = (parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024) / (1024 * 1024);
          return next(
            new AppError(`Fichier trop volumineux. Taille maximale: ${maxSize}MB`, 400)
          );
        }
        return next(new AppError(`Erreur d'upload: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }

      next();
    });
  };
};

/**
 * Valider la taille d'une image
 * @param {number} minWidth - Largeur minimale en pixels
 * @param {number} minHeight - Hauteur minimale en pixels
 */
export const validateImageDimensions = (minWidth = 0, minHeight = 0) => {
  return async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    try {
      // Cette validation nécessiterait une bibliothèque comme 'sharp' pour lire les dimensions
      // Pour l'instant, on passe directement
      next();
    } catch (error) {
      next(new AppError('Erreur lors de la validation de l\'image', 400));
    }
  };
};

export default {
  uploadSingleImage,
  uploadMultipleImages,
  uploadAvatar,
  uploadDocument,
  uploadFields,
  validateImageDimensions,
};
