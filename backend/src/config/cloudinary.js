/**
 * Configuration Cloudinary
 * Gestion des uploads d'images (avatars, logos, factures, etc.)
 */

import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

/**
 * Configuration de Cloudinary
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Vérifier la configuration Cloudinary
 */
export const verifyCloudinaryConfig = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET) {
    logger.warn('⚠️  Configuration Cloudinary incomplète. Les uploads d\'images seront désactivés.');
    return false;
  }
  logger.info('✅ Cloudinary configuré avec succès');
  return true;
};

/**
 * Upload d'une image vers Cloudinary
 * @param {string} file - Chemin du fichier ou buffer
 * @param {object} options - Options d'upload
 * @returns {Promise<object>} Résultat de l'upload
 */
export const uploadImage = async (file, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'erp-syscohada',
      resource_type: 'image',
      format: 'jpg',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:good' },
      ],
      ...options,
    };

    const result = await cloudinary.uploader.upload(file, defaultOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    logger.error('Erreur lors de l\'upload vers Cloudinary:', error);
    throw new Error('Échec de l\'upload de l\'image');
  }
};

/**
 * Upload d'un avatar utilisateur
 * @param {string} file - Fichier avatar
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} Résultat de l'upload
 */
export const uploadAvatar = async (file, userId) => {
  return uploadImage(file, {
    folder: 'erp-syscohada/avatars',
    public_id: `avatar_${userId}`,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  });
};

/**
 * Upload d'un logo d'entreprise
 * @param {string} file - Fichier logo
 * @param {string} companyId - ID de l'entreprise
 * @returns {Promise<object>} Résultat de l'upload
 */
export const uploadCompanyLogo = async (file, companyId) => {
  return uploadImage(file, {
    folder: 'erp-syscohada/logos',
    public_id: `logo_${companyId}`,
    transformation: [
      { width: 500, height: 500, crop: 'limit' },
      { quality: 'auto:best' },
      { background: 'white' },
    ],
  });
};

/**
 * Upload d'une image de produit
 * @param {string} file - Fichier image produit
 * @param {string} productId - ID du produit
 * @returns {Promise<object>} Résultat de l'upload
 */
export const uploadProductImage = async (file, productId) => {
  return uploadImage(file, {
    folder: 'erp-syscohada/products',
    public_id: `product_${productId}_${Date.now()}`,
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' },
      { quality: 'auto:good' },
    ],
  });
};

/**
 * Upload d'un document (facture PDF, etc.)
 * @param {string} file - Fichier document
 * @param {string} type - Type de document (invoice, receipt, etc.)
 * @param {string} documentId - ID du document
 * @returns {Promise<object>} Résultat de l'upload
 */
export const uploadDocument = async (file, type, documentId) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `erp-syscohada/documents/${type}`,
      public_id: `${type}_${documentId}_${Date.now()}`,
      resource_type: 'auto',
      format: 'pdf',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      pages: result.pages || 1,
    };
  } catch (error) {
    logger.error('Erreur lors de l\'upload du document:', error);
    throw new Error('Échec de l\'upload du document');
  }
};

/**
 * Supprimer une image de Cloudinary
 * @param {string} publicId - Public ID de l'image
 * @returns {Promise<object>} Résultat de la suppression
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      logger.info(`Image supprimée: ${publicId}`);
      return { success: true };
    }

    throw new Error('Échec de la suppression');
  } catch (error) {
    logger.error('Erreur lors de la suppression de l\'image:', error);
    throw new Error('Échec de la suppression de l\'image');
  }
};

/**
 * Supprimer plusieurs images
 * @param {string[]} publicIds - Array de public IDs
 * @returns {Promise<object>} Résultat de la suppression
 */
export const deleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    logger.info(`${publicIds.length} images supprimées`);
    return result;
  } catch (error) {
    logger.error('Erreur lors de la suppression multiple:', error);
    throw new Error('Échec de la suppression des images');
  }
};

/**
 * Obtenir les détails d'une image
 * @param {string} publicId - Public ID de l'image
 * @returns {Promise<object>} Détails de l'image
 */
export const getImageDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      createdAt: result.created_at,
    };
  } catch (error) {
    logger.error('Erreur lors de la récupération des détails:', error);
    throw new Error('Impossible de récupérer les détails de l\'image');
  }
};

/**
 * Générer une URL signée (temporaire) pour une image privée
 * @param {string} publicId - Public ID de l'image
 * @param {number} expiresIn - Durée de validité en secondes (défaut: 1 heure)
 * @returns {string} URL signée
 */
export const getSignedUrl = (publicId, expiresIn = 3600) => {
  const timestamp = Math.round(Date.now() / 1000) + expiresIn;

  return cloudinary.url(publicId, {
    type: 'authenticated',
    sign_url: true,
    expires_at: timestamp,
  });
};

/**
 * Transformer une image (redimensionner, recadrer, etc.)
 * @param {string} publicId - Public ID de l'image
 * @param {object} transformations - Transformations à appliquer
 * @returns {string} URL de l'image transformée
 */
export const transformImage = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true,
  });
};

/**
 * Générer une miniature
 * @param {string} publicId - Public ID de l'image
 * @param {number} width - Largeur de la miniature
 * @param {number} height - Hauteur de la miniature
 * @returns {string} URL de la miniature
 */
export const generateThumbnail = (publicId, width = 150, height = 150) => {
  return transformImage(publicId, {
    width,
    height,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:low',
  });
};

export default cloudinary;
