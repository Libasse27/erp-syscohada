/**
 * Service de génération Excel
 * Export de données en format Excel
 */

import {
  exportInvoicesToExcel,
  exportProductsToExcel,
  exportPaymentsToExcel,
  exportLedgerToExcel,
  exportBalanceSheetToExcel,
  exportGenericToExcel,
} from '../utils/excelGenerator.js';
import logger from '../utils/logger.js';

/**
 * Exporter des factures en Excel
 * @param {array} invoices - Liste des factures
 * @returns {Promise<Buffer>} Buffer du fichier Excel
 */
export const exportInvoices = async (invoices) => {
  try {
    const workbook = exportInvoicesToExcel(invoices);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    logger.error(`Erreur export Excel factures: ${error.message}`);
    throw new Error(`Échec de l'export Excel: ${error.message}`);
  }
};

/**
 * Exporter des produits en Excel
 * @param {array} products - Liste des produits
 * @returns {Promise<Buffer>} Buffer du fichier Excel
 */
export const exportProducts = async (products) => {
  try {
    const workbook = exportProductsToExcel(products);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    logger.error(`Erreur export Excel produits: ${error.message}`);
    throw new Error(`Échec de l'export Excel: ${error.message}`);
  }
};

/**
 * Exporter des paiements en Excel
 * @param {array} payments - Liste des paiements
 * @returns {Promise<Buffer>} Buffer du fichier Excel
 */
export const exportPayments = async (payments) => {
  try {
    const workbook = exportPaymentsToExcel(payments);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    logger.error(`Erreur export Excel paiements: ${error.message}`);
    throw new Error(`Échec de l'export Excel: ${error.message}`);
  }
};

/**
 * Exporter le grand livre en Excel
 * @param {array} entries - Écritures comptables
 * @returns {Promise<Buffer>} Buffer du fichier Excel
 */
export const exportLedger = async (entries) => {
  try {
    const workbook = exportLedgerToExcel(entries);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    logger.error(`Erreur export Excel grand livre: ${error.message}`);
    throw new Error(`Échec de l'export Excel: ${error.message}`);
  }
};

/**
 * Exporter le bilan comptable en Excel
 * @param {object} balanceSheet - Données du bilan
 * @returns {Promise<Buffer>} Buffer du fichier Excel
 */
export const exportBalanceSheet = async (balanceSheet) => {
  try {
    const workbook = exportBalanceSheetToExcel(balanceSheet);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    logger.error(`Erreur export Excel bilan: ${error.message}`);
    throw new Error(`Échec de l'export Excel: ${error.message}`);
  }
};

/**
 * Exporter des données génériques en Excel
 * @param {array} data - Données à exporter
 * @param {string} sheetName - Nom de la feuille
 * @param {array} columns - Configuration des colonnes
 * @returns {Promise<Buffer>} Buffer du fichier Excel
 */
export const exportGeneric = async (data, sheetName, columns) => {
  try {
    const workbook = exportGenericToExcel(data, sheetName, columns);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    logger.error(`Erreur export Excel générique: ${error.message}`);
    throw new Error(`Échec de l'export Excel: ${error.message}`);
  }
};

/**
 * Exporter les clients en Excel
 * @param {array} customers - Liste des clients
 * @returns {Promise<Buffer>} Buffer du fichier Excel
 */
export const exportCustomers = async (customers) => {
  const columns = [
    { header: 'Numéro', key: 'customerNumber', width: 15 },
    { header: 'Nom', key: 'name', width: 30 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Téléphone', key: 'phone', width: 15 },
    { header: 'Ville', key: 'city', width: 20 },
    { header: 'Total achats', key: 'totalPurchases', width: 15 },
    { header: 'Solde', key: 'balance', width: 15 },
  ];

  const data = customers.map((c) => ({
    customerNumber: c.customerNumber,
    name: c.name,
    email: c.email,
    phone: c.phone,
    city: c.billingAddress?.city || '',
    totalPurchases: c.totalPurchases,
    balance: c.balance,
  }));

  return exportGeneric(data, 'Clients', columns);
};

/**
 * Exporter les fournisseurs en Excel
 * @param {array} suppliers - Liste des fournisseurs
 * @returns {Promise<Buffer>} Buffer du fichier Excel
 */
export const exportSuppliers = async (suppliers) => {
  const columns = [
    { header: 'Numéro', key: 'supplierNumber', width: 15 },
    { header: 'Nom', key: 'name', width: 30 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Téléphone', key: 'phone', width: 15 },
    { header: 'Ville', key: 'city', width: 20 },
    { header: 'Total achats', key: 'totalPurchases', width: 15 },
    { header: 'Solde', key: 'balance', width: 15 },
  ];

  const data = suppliers.map((s) => ({
    supplierNumber: s.supplierNumber,
    name: s.name,
    email: s.email,
    phone: s.phone,
    city: s.address?.city || '',
    totalPurchases: s.totalPurchases,
    balance: s.balance,
  }));

  return exportGeneric(data, 'Fournisseurs', columns);
};

export default {
  exportInvoices,
  exportProducts,
  exportPayments,
  exportLedger,
  exportBalanceSheet,
  exportGeneric,
  exportCustomers,
  exportSuppliers,
};
