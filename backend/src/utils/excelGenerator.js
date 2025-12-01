/**
 * Générateur de fichiers Excel
 * Export de données en format Excel (.xlsx)
 */

import ExcelJS from 'exceljs';
import { formatCurrency, formatPercentage } from './numberFormatter.js';
import { formatDate } from './dateFormatter.js';

/**
 * Créer un workbook Excel de base
 * @returns {ExcelJS.Workbook}
 */
export const createWorkbook = () => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ERP SYSCOHADA';
  workbook.created = new Date();
  return workbook;
};

/**
 * Exporter des factures en Excel
 * @param {Array} invoices - Liste des factures
 * @returns {ExcelJS.Workbook}
 */
export const exportInvoicesToExcel = (invoices) => {
  const workbook = createWorkbook();
  const worksheet = workbook.addWorksheet('Factures');

  // En-têtes de colonnes
  worksheet.columns = [
    { header: 'Numéro', key: 'number', width: 20 },
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Client', key: 'customer', width: 30 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Montant HT', key: 'subtotal', width: 15 },
    { header: 'TVA', key: 'vatAmount', width: 15 },
    { header: 'Total TTC', key: 'total', width: 15 },
    { header: 'Statut', key: 'status', width: 12 },
    { header: 'Échéance', key: 'dueDate', width: 12 },
  ];

  // Style de l'en-tête
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Ajouter les données
  invoices.forEach((invoice) => {
    worksheet.addRow({
      number: invoice.number,
      date: formatDate(invoice.date),
      customer: invoice.customer?.name || '',
      type: getInvoiceTypeLabel(invoice.type),
      subtotal: invoice.subtotal,
      vatAmount: invoice.vatAmount,
      total: invoice.total,
      status: getStatusLabel(invoice.status),
      dueDate: invoice.dueDate ? formatDate(invoice.dueDate) : '',
    });
  });

  // Formater les colonnes de montants
  ['subtotal', 'vatAmount', 'total'].forEach((col) => {
    const column = worksheet.getColumn(col);
    column.numFmt = '#,##0 "FCFA"';
    column.alignment = { horizontal: 'right' };
  });

  // Ajouter les totaux
  const lastRow = worksheet.lastRow.number + 2;
  worksheet.getCell(`D${lastRow}`).value = 'TOTAL';
  worksheet.getCell(`D${lastRow}`).font = { bold: true };

  const totalSubtotal = invoices.reduce((sum, inv) => sum + inv.subtotal, 0);
  const totalVAT = invoices.reduce((sum, inv) => sum + inv.vatAmount, 0);
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);

  worksheet.getCell(`E${lastRow}`).value = totalSubtotal;
  worksheet.getCell(`F${lastRow}`).value = totalVAT;
  worksheet.getCell(`G${lastRow}`).value = totalAmount;
  worksheet.getRow(lastRow).font = { bold: true };

  return workbook;
};

/**
 * Exporter des produits en Excel
 * @param {Array} products - Liste des produits
 * @returns {ExcelJS.Workbook}
 */
export const exportProductsToExcel = (products) => {
  const workbook = createWorkbook();
  const worksheet = workbook.addWorksheet('Produits');

  // En-têtes de colonnes
  worksheet.columns = [
    { header: 'Code', key: 'code', width: 15 },
    { header: 'Nom', key: 'name', width: 30 },
    { header: 'Catégorie', key: 'category', width: 20 },
    { header: 'Type', key: 'type', width: 12 },
    { header: 'Prix d\'achat', key: 'purchasePrice', width: 15 },
    { header: 'Prix de vente', key: 'sellingPrice', width: 15 },
    { header: 'Stock', key: 'stock', width: 10 },
    { header: 'Unité', key: 'unit', width: 10 },
    { header: 'Taux TVA', key: 'vatRate', width: 10 },
    { header: 'Actif', key: 'isActive', width: 10 },
  ];

  // Style de l'en-tête
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Ajouter les données
  products.forEach((product) => {
    worksheet.addRow({
      code: product.code,
      name: product.name,
      category: product.category,
      type: product.type === 'product' ? 'Produit' : 'Service',
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      stock: product.currentStock || 0,
      unit: product.unit,
      vatRate: product.vatRate,
      isActive: product.isActive ? 'Oui' : 'Non',
    });
  });

  // Formater les colonnes de prix
  ['purchasePrice', 'sellingPrice'].forEach((col) => {
    const column = worksheet.getColumn(col);
    column.numFmt = '#,##0 "FCFA"';
    column.alignment = { horizontal: 'right' };
  });

  // Formater la colonne TVA
  const vatColumn = worksheet.getColumn('vatRate');
  vatColumn.numFmt = '0"%"';
  vatColumn.alignment = { horizontal: 'right' };

  return workbook;
};

/**
 * Exporter des paiements en Excel
 * @param {Array} payments - Liste des paiements
 * @returns {ExcelJS.Workbook}
 */
export const exportPaymentsToExcel = (payments) => {
  const workbook = createWorkbook();
  const worksheet = workbook.addWorksheet('Paiements');

  // En-têtes de colonnes
  worksheet.columns = [
    { header: 'Référence', key: 'reference', width: 20 },
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Type', key: 'type', width: 20 },
    { header: 'Méthode', key: 'method', width: 20 },
    { header: 'Montant', key: 'amount', width: 15 },
    { header: 'Devise', key: 'currency', width: 10 },
    { header: 'Client/Fournisseur', key: 'party', width: 30 },
    { header: 'Facture', key: 'invoice', width: 20 },
    { header: 'Statut', key: 'status', width: 12 },
  ];

  // Style de l'en-tête
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Ajouter les données
  payments.forEach((payment) => {
    worksheet.addRow({
      reference: payment.reference,
      date: formatDate(payment.date),
      type: getPaymentTypeLabel(payment.type),
      method: getPaymentMethodLabel(payment.method),
      amount: payment.amount,
      currency: payment.currency,
      party: payment.customer?.name || payment.supplier?.name || '',
      invoice: payment.invoice?.number || '',
      status: getStatusLabel(payment.status),
    });
  });

  // Formater la colonne montant
  const amountColumn = worksheet.getColumn('amount');
  amountColumn.numFmt = '#,##0';
  amountColumn.alignment = { horizontal: 'right' };

  return workbook;
};

/**
 * Exporter le grand livre comptable en Excel
 * @param {Array} entries - Écritures comptables
 * @returns {ExcelJS.Workbook}
 */
export const exportLedgerToExcel = (entries) => {
  const workbook = createWorkbook();
  const worksheet = workbook.addWorksheet('Grand Livre');

  // En-têtes de colonnes
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 12 },
    { header: 'N° Écriture', key: 'number', width: 15 },
    { header: 'Journal', key: 'journal', width: 15 },
    { header: 'Compte', key: 'account', width: 12 },
    { header: 'Libellé compte', key: 'accountLabel', width: 30 },
    { header: 'Libellé écriture', key: 'label', width: 35 },
    { header: 'Débit', key: 'debit', width: 15 },
    { header: 'Crédit', key: 'credit', width: 15 },
    { header: 'Référence', key: 'reference', width: 20 },
  ];

  // Style de l'en-tête
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Ajouter les données (écritures avec leurs lignes)
  entries.forEach((entry) => {
    entry.lines.forEach((line) => {
      worksheet.addRow({
        date: formatDate(entry.date),
        number: entry.number,
        journal: getJournalLabel(entry.journal),
        account: line.account?.code || '',
        accountLabel: line.account?.label || '',
        label: line.label,
        debit: line.debit || 0,
        credit: line.credit || 0,
        reference: entry.reference || '',
      });
    });
  });

  // Formater les colonnes de montants
  ['debit', 'credit'].forEach((col) => {
    const column = worksheet.getColumn(col);
    column.numFmt = '#,##0.00 "FCFA"';
    column.alignment = { horizontal: 'right' };
  });

  // Ajouter les totaux
  const lastRow = worksheet.lastRow.number + 2;
  worksheet.getCell(`F${lastRow}`).value = 'TOTAL';
  worksheet.getCell(`F${lastRow}`).font = { bold: true };

  // Calculer les totaux
  let totalDebit = 0;
  let totalCredit = 0;

  entries.forEach((entry) => {
    entry.lines.forEach((line) => {
      totalDebit += line.debit || 0;
      totalCredit += line.credit || 0;
    });
  });

  worksheet.getCell(`G${lastRow}`).value = totalDebit;
  worksheet.getCell(`H${lastRow}`).value = totalCredit;
  worksheet.getRow(lastRow).font = { bold: true };

  return workbook;
};

/**
 * Exporter le bilan comptable en Excel
 * @param {object} balanceSheet - Données du bilan
 * @returns {ExcelJS.Workbook}
 */
export const exportBalanceSheetToExcel = (balanceSheet) => {
  const workbook = createWorkbook();

  // Feuille Actif
  const assetSheet = workbook.addWorksheet('Actif');
  assetSheet.columns = [
    { header: 'Compte', key: 'account', width: 15 },
    { header: 'Libellé', key: 'label', width: 40 },
    { header: 'Montant', key: 'amount', width: 20 },
  ];

  // Style de l'en-tête
  assetSheet.getRow(1).font = { bold: true };
  assetSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4CAF50' },
  };

  // Ajouter les données d'actif
  balanceSheet.assets.forEach((item) => {
    assetSheet.addRow({
      account: item.account,
      label: item.label,
      amount: item.amount,
    });
  });

  // Feuille Passif
  const liabilitySheet = workbook.addWorksheet('Passif');
  liabilitySheet.columns = [
    { header: 'Compte', key: 'account', width: 15 },
    { header: 'Libellé', key: 'label', width: 40 },
    { header: 'Montant', key: 'amount', width: 20 },
  ];

  // Style de l'en-tête
  liabilitySheet.getRow(1).font = { bold: true };
  liabilitySheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF44336' },
  };

  // Ajouter les données de passif
  balanceSheet.liabilities.forEach((item) => {
    liabilitySheet.addRow({
      account: item.account,
      label: item.label,
      amount: item.amount,
    });
  });

  // Formater les colonnes de montants
  [assetSheet, liabilitySheet].forEach((sheet) => {
    const amountColumn = sheet.getColumn('amount');
    amountColumn.numFmt = '#,##0 "FCFA"';
    amountColumn.alignment = { horizontal: 'right' };
  });

  return workbook;
};

/**
 * Exporter un tableau générique en Excel
 * @param {Array} data - Données à exporter
 * @param {string} sheetName - Nom de la feuille
 * @param {Array} columns - Configuration des colonnes
 * @returns {ExcelJS.Workbook}
 */
export const exportGenericToExcel = (data, sheetName = 'Data', columns) => {
  const workbook = createWorkbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Configuration des colonnes
  if (columns) {
    worksheet.columns = columns;
  } else {
    // Auto-détection des colonnes depuis les données
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      worksheet.columns = keys.map((key) => ({
        header: key,
        key: key,
        width: 15,
      }));
    }
  }

  // Style de l'en-tête
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // Ajouter les données
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  return workbook;
};

/**
 * Helper: Obtenir le libellé d'un type de facture
 */
const getInvoiceTypeLabel = (type) => {
  const types = {
    sale: 'Vente',
    purchase: 'Achat',
    proforma: 'Devis',
    credit_note: 'Avoir',
    debit_note: 'Note de débit',
  };
  return types[type] || type;
};

/**
 * Helper: Obtenir le libellé d'un statut
 */
const getStatusLabel = (status) => {
  const statuses = {
    draft: 'Brouillon',
    sent: 'Envoyée',
    viewed: 'Vue',
    paid: 'Payée',
    partial: 'Partiel',
    overdue: 'En retard',
    cancelled: 'Annulée',
    pending: 'En attente',
    completed: 'Complété',
    failed: 'Échoué',
  };
  return statuses[status] || status;
};

/**
 * Helper: Obtenir le libellé d'un type de paiement
 */
const getPaymentTypeLabel = (type) => {
  const types = {
    customer_payment: 'Paiement client',
    supplier_payment: 'Paiement fournisseur',
    expense: 'Dépense',
    income: 'Revenu',
    transfer: 'Transfert',
  };
  return types[type] || type;
};

/**
 * Helper: Obtenir le libellé d'une méthode de paiement
 */
const getPaymentMethodLabel = (method) => {
  const methods = {
    cash: 'Espèces',
    check: 'Chèque',
    bank_transfer: 'Virement',
    mobile_money: 'Mobile Money',
    card: 'Carte',
    other: 'Autre',
  };
  return methods[method] || method;
};

/**
 * Helper: Obtenir le libellé d'un journal
 */
const getJournalLabel = (journal) => {
  const journals = {
    sales: 'Ventes',
    purchases: 'Achats',
    cash: 'Caisse',
    bank: 'Banque',
    operations: 'Opérations diverses',
    miscellaneous: 'Divers',
  };
  return journals[journal] || journal;
};

export default {
  createWorkbook,
  exportInvoicesToExcel,
  exportProductsToExcel,
  exportPaymentsToExcel,
  exportLedgerToExcel,
  exportBalanceSheetToExcel,
  exportGenericToExcel,
};
