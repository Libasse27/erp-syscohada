/**
 * Service comptable
 * Logique métier pour la comptabilité SYSCOHADA
 */

import Account from '../models/Account.js';
import AccountingEntry from '../models/AccountingEntry.js';
import Journal from '../models/Journal.js';
import FiscalYear from '../models/FiscalYear.js';
import {
  generatePurchaseEntry,
  generateSaleEntry,
  generatePaymentEntry,
  isEntryBalanced,
  calculateEntryTotals,
} from '../utils/syscohadaHelper.js';
import logger from '../utils/logger.js';

/**
 * Créer une écriture comptable
 * @param {object} entryData - Données de l'écriture
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} Écriture créée
 */
export const createAccountingEntry = async (entryData, userId) => {
  const { journalId, date, label, lines, reference, referenceType, referenceId } = entryData;

  // Vérifier que l'écriture est équilibrée
  if (!isEntryBalanced(lines)) {
    throw new Error('L\'écriture n\'est pas équilibrée (débit ≠ crédit)');
  }

  // Récupérer le journal pour générer le numéro
  const journal = await Journal.findById(journalId);
  if (!journal) {
    throw new Error('Journal non trouvé');
  }

  const entryNumber = await journal.getNextEntryNumber();

  // Récupérer la période fiscale
  const fiscalYearData = await FiscalYear.findCurrent(journal.company);
  const period = fiscalYearData
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    : null;

  // Créer l'écriture
  const entry = await AccountingEntry.create({
    number: entryNumber,
    journal: journalId,
    date,
    label,
    lines,
    reference,
    referenceType,
    referenceId,
    fiscalYear: fiscalYearData?._id,
    period,
    company: journal.company,
    createdBy: userId,
    status: 'draft',
  });

  logger.info(`Écriture comptable créée: ${entry.number}`);

  return entry;
};

/**
 * Générer une écriture d'achat automatiquement
 * @param {object} invoice - Facture d'achat
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} Écriture créée
 */
export const createPurchaseEntry = async (invoice, userId) => {
  const lines = generatePurchaseEntry({
    amountHT: invoice.subtotal,
    vatRate: invoice.vatRate,
    supplier: invoice.supplier?.name || 'Fournisseur',
    reference: invoice.number,
  });

  // Trouver le journal d'achats
  const journal = await Journal.findOne({
    company: invoice.company,
    type: 'purchases',
    isActive: true,
  });

  if (!journal) {
    throw new Error('Journal d\'achats non trouvé');
  }

  return createAccountingEntry(
    {
      journalId: journal._id,
      date: invoice.date,
      label: `Achat ${invoice.number}`,
      lines,
      reference: invoice.number,
      referenceType: 'invoice',
      referenceId: invoice._id,
    },
    userId
  );
};

/**
 * Générer une écriture de vente automatiquement
 * @param {object} invoice - Facture de vente
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} Écriture créée
 */
export const createSaleEntry = async (invoice, userId) => {
  const lines = generateSaleEntry({
    amountHT: invoice.subtotal,
    vatRate: invoice.vatRate,
    customer: invoice.customer?.name || 'Client',
    reference: invoice.number,
  });

  // Trouver le journal de ventes
  const journal = await Journal.findOne({
    company: invoice.company,
    type: 'sales',
    isActive: true,
  });

  if (!journal) {
    throw new Error('Journal de ventes non trouvé');
  }

  return createAccountingEntry(
    {
      journalId: journal._id,
      date: invoice.date,
      label: `Vente ${invoice.number}`,
      lines,
      reference: invoice.number,
      referenceType: 'invoice',
      referenceId: invoice._id,
    },
    userId
  );
};

/**
 * Générer une écriture de paiement automatiquement
 * @param {object} payment - Paiement
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} Écriture créée
 */
export const createPaymentEntry = async (payment, userId) => {
  const lines = generatePaymentEntry({
    amount: payment.amount,
    paymentMethod: payment.method,
    party: payment.customer?.name || payment.supplier?.name || '',
    reference: payment.number,
    type: payment.type,
  });

  // Choisir le journal selon la méthode
  const journalType = ['cash', 'mobile_money'].includes(payment.method) ? 'cash' : 'bank';

  const journal = await Journal.findOne({
    company: payment.company,
    type: journalType,
    isActive: true,
  });

  if (!journal) {
    throw new Error(`Journal de ${journalType} non trouvé`);
  }

  return createAccountingEntry(
    {
      journalId: journal._id,
      date: payment.date,
      label: `Paiement ${payment.number}`,
      lines,
      reference: payment.number,
      referenceType: 'payment',
      referenceId: payment._id,
    },
    userId
  );
};

/**
 * Obtenir le grand livre d'un compte
 * @param {string} accountId - ID du compte
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 * @returns {Promise<array>} Écritures du compte
 */
export const getLedger = async (accountId, startDate, endDate) => {
  const entries = await AccountingEntry.getLedger(accountId, startDate, endDate);

  let balance = 0;
  const ledgerEntries = [];

  for (const entry of entries) {
    for (const line of entry.lines) {
      if (line.account.toString() === accountId) {
        balance += line.debit - line.credit;

        ledgerEntries.push({
          date: entry.date,
          entryNumber: entry.number,
          journal: entry.journal.name,
          label: line.label,
          reference: entry.reference,
          debit: line.debit,
          credit: line.credit,
          balance,
        });
      }
    }
  }

  return ledgerEntries;
};

/**
 * Générer le bilan comptable
 * @param {string} companyId - ID de l'entreprise
 * @param {Date} date - Date du bilan
 * @returns {Promise<object>} Bilan
 */
export const generateBalanceSheet = async (companyId, date) => {
  // Récupérer tous les comptes de bilan (classes 1-5)
  const accounts = await Account.find({
    company: companyId,
    class: { $in: [1, 2, 3, 4, 5] },
    isActive: true,
  }).sort({ code: 1 });

  const assets = [];
  const liabilities = [];

  for (const account of accounts) {
    // Calculer le solde du compte à la date donnée
    const entries = await AccountingEntry.getLedger(account._id, new Date(0), date);

    let balance = 0;
    for (const entry of entries) {
      for (const line of entry.lines) {
        if (line.account.toString() === account._id.toString()) {
          balance += line.debit - line.credit;
        }
      }
    }

    if (balance !== 0) {
      const accountData = {
        account: account.code,
        label: account.label,
        amount: Math.abs(balance),
      };

      // Classer selon le type
      if ([2, 3, 5].includes(account.class) || (account.class === 4 && balance > 0)) {
        assets.push(accountData);
      } else {
        liabilities.push(accountData);
      }
    }
  }

  const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);

  return {
    date,
    assets,
    liabilities,
    totalAssets,
    totalLiabilities,
    difference: totalAssets - totalLiabilities,
  };
};

/**
 * Générer le compte de résultat
 * @param {string} companyId - ID de l'entreprise
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 * @returns {Promise<object>} Compte de résultat
 */
export const generateIncomeStatement = async (companyId, startDate, endDate) => {
  // Récupérer tous les comptes de gestion (classes 6, 7, 8)
  const accounts = await Account.find({
    company: companyId,
    class: { $in: [6, 7, 8] },
    isActive: true,
  }).sort({ code: 1 });

  const expenses = [];
  const revenues = [];

  for (const account of accounts) {
    const entries = await AccountingEntry.getLedger(account._id, startDate, endDate);

    let balance = 0;
    for (const entry of entries) {
      for (const line of entry.lines) {
        if (line.account.toString() === account._id.toString()) {
          balance += line.debit - line.credit;
        }
      }
    }

    if (balance !== 0) {
      const accountData = {
        account: account.code,
        label: account.label,
        amount: Math.abs(balance),
      };

      // Classe 6 = charges, Classe 7 = produits
      if (account.class === 6 || (account.class === 8 && balance > 0)) {
        expenses.push(accountData);
      } else {
        revenues.push(accountData);
      }
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenues = revenues.reduce((sum, r) => sum + r.amount, 0);
  const netIncome = totalRevenues - totalExpenses;

  return {
    startDate,
    endDate,
    revenues,
    expenses,
    totalRevenues,
    totalExpenses,
    netIncome,
    profitMargin: totalRevenues > 0 ? (netIncome / totalRevenues) * 100 : 0,
  };
};

/**
 * Clôturer une période comptable
 * @param {string} companyId - ID de l'entreprise
 * @param {number} month - Mois à clôturer (1-12)
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} Exercice mis à jour
 */
export const closePeriod = async (companyId, month, userId) => {
  const fiscalYear = await FiscalYear.findCurrent(companyId);

  if (!fiscalYear) {
    throw new Error('Aucun exercice fiscal ouvert');
  }

  await fiscalYear.closePeriod(month, userId);

  logger.info(`Période ${month} clôturée pour l'exercice ${fiscalYear.year}`);

  return fiscalYear;
};

export default {
  createAccountingEntry,
  createPurchaseEntry,
  createSaleEntry,
  createPaymentEntry,
  getLedger,
  generateBalanceSheet,
  generateIncomeStatement,
  closePeriod,
};
