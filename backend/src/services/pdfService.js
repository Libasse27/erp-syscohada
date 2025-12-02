/**
 * Service de génération PDF
 * Génération de PDF pour factures, reçus et rapports
 */

import { generateInvoicePDF, generateReceiptPDF, generateReportPDF } from '../utils/pdfGenerator.js';
import { formatCurrency, formatDate } from '../utils/numberFormatter.js';
import logger from '../utils/logger.js';

/**
 * Générer le PDF d'une facture
 * @param {object} invoice - Facture avec données complètes
 * @param {object} company - Informations de l'entreprise
 * @returns {Promise<Buffer>} Buffer du PDF
 */
export const generateInvoice = async (invoice, company) => {
  try {
    const doc = generateInvoicePDF(invoice, company);

    // Convertir le stream en buffer
    return new Promise((resolve, reject) => {
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
    });
  } catch (error) {
    logger.error(`Erreur génération PDF facture: ${error.message}`);
    throw new Error(`Échec de la génération du PDF: ${error.message}`);
  }
};

/**
 * Générer le PDF d'un reçu de paiement
 * @param {object} payment - Paiement
 * @param {object} company - Informations de l'entreprise
 * @returns {Promise<Buffer>} Buffer du PDF
 */
export const generateReceipt = async (payment, company) => {
  try {
    const doc = generateReceiptPDF(payment, company);

    return new Promise((resolve, reject) => {
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
    });
  } catch (error) {
    logger.error(`Erreur génération PDF reçu: ${error.message}`);
    throw new Error(`Échec de la génération du PDF: ${error.message}`);
  }
};

/**
 * Générer un PDF de rapport
 * @param {object} reportData - Données du rapport
 * @returns {Promise<Buffer>} Buffer du PDF
 */
export const generateReport = async (reportData) => {
  try {
    const doc = generateReportPDF(reportData);

    return new Promise((resolve, reject) => {
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
    });
  } catch (error) {
    logger.error(`Erreur génération PDF rapport: ${error.message}`);
    throw new Error(`Échec de la génération du PDF: ${error.message}`);
  }
};

/**
 * Générer un PDF de bon de commande
 * @param {object} order - Bon de commande
 * @param {object} company - Informations de l'entreprise
 * @returns {Promise<Buffer>} Buffer du PDF
 */
export const generatePurchaseOrder = async (order, company) => {
  try {
    // Convertir le bon de commande au format facture pour réutiliser le générateur
    const invoiceFormat = {
      ...order,
      type: 'purchase',
      customer: order.supplier,
      items: order.items,
    };

    const doc = generateInvoicePDF(invoiceFormat, company);

    return new Promise((resolve, reject) => {
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
    });
  } catch (error) {
    logger.error(`Erreur génération PDF bon de commande: ${error.message}`);
    throw new Error(`Échec de la génération du PDF: ${error.message}`);
  }
};

export default {
  generateInvoice,
  generateReceipt,
  generateReport,
  generatePurchaseOrder,
};
