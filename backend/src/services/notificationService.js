/**
 * Service de notifications
 * Gestion des notifications internes et alertes
 */

import { sendLowStockAlert, sendOverdueInvoiceEmail } from './emailService.js';
import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Envoyer une notification de facture en retard
 * @param {string} invoiceId - ID de la facture
 * @returns {Promise<boolean>} Succès
 */
export const notifyOverdueInvoice = async (invoiceId) => {
  try {
    const invoice = await Invoice.findById(invoiceId)
      .populate('customer', 'name email')
      .populate('company', 'name');

    if (!invoice || !invoice.customer?.email) {
      logger.warn(`Impossible d'envoyer notification facture ${invoiceId}: pas d'email`);
      return false;
    }

    await sendOverdueInvoiceEmail(invoice.customer.email, invoice);

    logger.info(`Notification envoyée pour facture en retard: ${invoice.number}`);
    return true;
  } catch (error) {
    logger.error(`Erreur notification facture en retard: ${error.message}`);
    return false;
  }
};

/**
 * Vérifier et notifier les factures en retard
 * @param {string} companyId - ID de l'entreprise
 * @returns {Promise<number>} Nombre de notifications envoyées
 */
export const checkAndNotifyOverdueInvoices = async (companyId) => {
  try {
    const overdueInvoices = await Invoice.findOverdue(companyId);

    let notificationCount = 0;

    for (const invoice of overdueInvoices) {
      // Vérifier si une notification n'a pas déjà été envoyée aujourd'hui
      // (implémentation simplifiée, à améliorer avec un système de tracking)
      const success = await notifyOverdueInvoice(invoice._id);
      if (success) notificationCount++;
    }

    logger.info(`${notificationCount} notifications de factures en retard envoyées`);
    return notificationCount;
  } catch (error) {
    logger.error(`Erreur vérification factures en retard: ${error.message}`);
    return 0;
  }
};

/**
 * Envoyer une alerte de stock bas
 * @param {string} companyId - ID de l'entreprise
 * @returns {Promise<boolean>} Succès
 */
export const notifyLowStock = async (companyId) => {
  try {
    // Trouver les produits en stock bas
    const lowStockProducts = await Product.find({
      company: companyId,
      trackStock: true,
      isActive: true,
      $expr: { $lte: ['$currentStock', '$reorderLevel'] },
    });

    if (lowStockProducts.length === 0) {
      return false;
    }

    // Trouver les utilisateurs avec permission de gestion stock
    const users = await User.find({
      company: companyId,
      isActive: true,
      $or: [
        { role: 'admin' },
        { permissions: { $in: ['stock:manage', 'stock:view'] } },
      ],
    });

    // Envoyer l'alerte à tous les utilisateurs concernés
    for (const user of users) {
      if (user.email) {
        await sendLowStockAlert(user.email, lowStockProducts);
      }
    }

    logger.info(`Alerte stock bas envoyée: ${lowStockProducts.length} produits`);
    return true;
  } catch (error) {
    logger.error(`Erreur alerte stock bas: ${error.message}`);
    return false;
  }
};

/**
 * Créer une notification système
 * @param {object} notificationData - Données de la notification
 * @returns {Promise<object>} Notification créée
 */
export const createNotification = async (notificationData) => {
  const { userId, type, title, message, data, priority } = notificationData;

  // Note: Dans une implémentation complète, créer un modèle Notification
  // Pour l'instant, on log simplement

  const notification = {
    userId,
    type,
    title,
    message,
    data,
    priority: priority || 'normal',
    read: false,
    createdAt: new Date(),
  };

  logger.info(`Notification créée: ${title} pour utilisateur ${userId}`);

  // Dans une vraie implémentation:
  // - Sauvegarder en base de données
  // - Envoyer via WebSocket en temps réel
  // - Envoyer notification push si configuré

  return notification;
};

/**
 * Notifier une nouvelle vente
 * @param {string} invoiceId - ID de la facture
 * @param {string} userId - ID de l'utilisateur à notifier
 * @returns {Promise<object>} Notification
 */
export const notifyNewSale = async (invoiceId, userId) => {
  const invoice = await Invoice.findById(invoiceId).populate('customer', 'name');

  return createNotification({
    userId,
    type: 'sale',
    title: 'Nouvelle vente',
    message: `Facture ${invoice.number} créée pour ${invoice.customer?.name || 'Client'}`,
    data: { invoiceId: invoice._id },
    priority: 'normal',
  });
};

/**
 * Notifier un nouveau paiement
 * @param {string} paymentId - ID du paiement
 * @param {string} userId - ID de l'utilisateur à notifier
 * @returns {Promise<object>} Notification
 */
export const notifyNewPayment = async (paymentId, userId) => {
  return createNotification({
    userId,
    type: 'payment',
    title: 'Paiement reçu',
    message: 'Un nouveau paiement a été enregistré',
    data: { paymentId },
    priority: 'normal',
  });
};

/**
 * Notifier un stock critique
 * @param {string} productId - ID du produit
 * @param {string} userId - ID de l'utilisateur à notifier
 * @returns {Promise<object>} Notification
 */
export const notifyCriticalStock = async (productId, userId) => {
  const product = await Product.findById(productId);

  return createNotification({
    userId,
    type: 'stock',
    title: 'Stock critique',
    message: `${product.name} en rupture de stock`,
    data: { productId },
    priority: 'high',
  });
};

/**
 * Tâche planifiée: Vérifier les alertes quotidiennes
 * @param {string} companyId - ID de l'entreprise
 */
export const runDailyAlerts = async (companyId) => {
  try {
    logger.info('Exécution des alertes quotidiennes...');

    // Vérifier les factures en retard
    await checkAndNotifyOverdueInvoices(companyId);

    // Vérifier le stock bas
    await notifyLowStock(companyId);

    logger.info('Alertes quotidiennes terminées');
  } catch (error) {
    logger.error(`Erreur alertes quotidiennes: ${error.message}`);
  }
};

export default {
  notifyOverdueInvoice,
  checkAndNotifyOverdueInvoices,
  notifyLowStock,
  createNotification,
  notifyNewSale,
  notifyNewPayment,
  notifyCriticalStock,
  runDailyAlerts,
};
