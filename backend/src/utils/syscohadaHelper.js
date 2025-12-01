/**
 * Helper SYSCOHADA
 * Utilitaires pour la comptabilité selon le plan comptable SYSCOHADA
 * (Système Comptable Ouest Africain)
 */

/**
 * Classes de comptes SYSCOHADA
 */
export const SYSCOHADA_CLASSES = {
  1: {
    name: 'COMPTES DE RESSOURCES DURABLES',
    description: 'Capital, emprunts et dettes assimilées',
    type: 'liability',
  },
  2: {
    name: 'COMPTES D\'ACTIF IMMOBILISE',
    description: 'Immobilisations incorporelles, corporelles et financières',
    type: 'asset',
  },
  3: {
    name: 'COMPTES DE STOCKS',
    description: 'Marchandises, matières premières, produits',
    type: 'asset',
  },
  4: {
    name: 'COMPTES DE TIERS',
    description: 'Fournisseurs, clients, personnel, organismes sociaux',
    type: 'mixed',
  },
  5: {
    name: 'COMPTES DE TRESORERIE',
    description: 'Banques, établissements financiers, caisse',
    type: 'asset',
  },
  6: {
    name: 'COMPTES DE CHARGES',
    description: 'Charges d\'exploitation, financières, exceptionnelles',
    type: 'expense',
  },
  7: {
    name: 'COMPTES DE PRODUITS',
    description: 'Ventes, production, produits financiers',
    type: 'revenue',
  },
  8: {
    name: 'COMPTES DES AUTRES CHARGES ET DES AUTRES PRODUITS',
    description: 'Dotations, reprises, autres charges et produits',
    type: 'mixed',
  },
};

/**
 * Comptes principaux SYSCOHADA
 */
export const SYSCOHADA_MAIN_ACCOUNTS = {
  // Classe 1 - Capitaux
  10: 'Capital',
  11: 'Réserves',
  12: 'Report à nouveau',
  13: 'Résultat net de l\'exercice',
  16: 'Emprunts et dettes assimilées',
  18: 'Dettes liées à des participations',

  // Classe 2 - Immobilisations
  20: 'Charges immobilisées',
  21: 'Immobilisations incorporelles',
  22: 'Terrains',
  23: 'Bâtiments, installations techniques et agencements',
  24: 'Matériel',
  26: 'Titres de participation',
  27: 'Autres immobilisations financières',
  28: 'Amortissements',
  29: 'Provisions pour dépréciation des immobilisations',

  // Classe 3 - Stocks
  31: 'Marchandises',
  32: 'Matières premières et fournitures liées',
  33: 'Autres approvisionnements',
  35: 'Produits finis',
  36: 'Produits intermédiaires et résiduels',
  37: 'Stocks de marchandises et de matières consommables',
  38: 'Achats stockés',
  39: 'Dépréciations des stocks',

  // Classe 4 - Tiers
  40: 'Fournisseurs et comptes rattachés',
  41: 'Clients et comptes rattachés',
  42: 'Personnel',
  43: 'Organismes sociaux',
  44: 'État et collectivités publiques',
  46: 'Débiteurs et créditeurs divers',
  47: 'Comptes transitoires ou d\'attente',
  48: 'Créances et dettes hors activités ordinaires',
  49: 'Dépréciations et provisions pour dépréciation',

  // Classe 5 - Trésorerie
  50: 'Titres de placement',
  51: 'Banques, établissements financiers et assimilés',
  52: 'Instruments de trésorerie',
  53: 'Caisse',
  54: 'Régies d\'avances et accréditifs',
  59: 'Dépréciations et provisions pour dépréciation',

  // Classe 6 - Charges
  60: 'Achats et variations de stocks',
  61: 'Transports',
  62: 'Services extérieurs A',
  63: 'Services extérieurs B',
  64: 'Impôts et taxes',
  65: 'Autres charges',
  66: 'Charges de personnel',
  67: 'Frais financiers et charges assimilées',
  68: 'Dotations aux amortissements',
  69: 'Dotations aux provisions',

  // Classe 7 - Produits
  70: 'Ventes',
  71: 'Subventions d\'exploitation',
  72: 'Production immobilisée',
  73: 'Variations des stocks de biens et de services produits',
  75: 'Autres produits',
  77: 'Revenus financiers et produits assimilés',
  78: 'Reprises d\'amortissements',
  79: 'Reprises de provisions',

  // Classe 8 - Autres charges et produits
  81: 'Valeurs comptables des cessions d\'immobilisations',
  82: 'Produits des cessions d\'immobilisations',
  83: 'Charges hors activités ordinaires',
  84: 'Produits hors activités ordinaires',
  85: 'Dotations hors activités ordinaires',
  86: 'Reprises hors activités ordinaires',
  87: 'Participation des travailleurs',
  88: 'Subventions d\'équilibre',
  89: 'Impôts sur le résultat',
};

/**
 * Obtenir la classe d'un compte SYSCOHADA
 * @param {string} accountCode - Code du compte
 * @returns {object|null}
 */
export const getAccountClass = (accountCode) => {
  const classNumber = parseInt(accountCode.charAt(0));
  return SYSCOHADA_CLASSES[classNumber] || null;
};

/**
 * Obtenir le type de compte (débit naturel ou crédit naturel)
 * @param {string} accountCode - Code du compte
 * @returns {string} - 'debit' ou 'credit'
 */
export const getNaturalBalance = (accountCode) => {
  const classNumber = parseInt(accountCode.charAt(0));

  // Classes à solde créditeur naturel : 1, 4 (certains), 7
  if (classNumber === 1 || classNumber === 7) {
    return 'credit';
  }

  // Classes à solde débiteur naturel : 2, 3, 5, 6
  if ([2, 3, 5, 6].includes(classNumber)) {
    return 'debit';
  }

  // Classe 4 : dépend du sous-compte
  if (classNumber === 4) {
    const subClass = parseInt(accountCode.substring(0, 2));
    // 40 (fournisseurs), 43 (organismes sociaux), 44 (État) = crédit
    // 41 (clients), 42 (personnel), 46 (divers) = débit
    if ([40, 43, 44, 48].includes(subClass)) return 'credit';
    return 'debit';
  }

  // Classe 8 : mixte, dépend du sous-compte
  if (classNumber === 8) {
    const subClass = parseInt(accountCode.substring(0, 2));
    // 81, 83, 85, 87, 89 = débit (charges)
    // 82, 84, 86, 88 = crédit (produits)
    if ([81, 83, 85, 87, 89].includes(subClass)) return 'debit';
    return 'credit';
  }

  return 'debit';
};

/**
 * Valider si un code compte est valide selon SYSCOHADA
 * @param {string} accountCode - Code du compte
 * @returns {boolean}
 */
export const isValidSyscohadaCode = (accountCode) => {
  // Format: 1 à 7 chiffres, commence par 1-8
  const regex = /^[1-8][0-9]{0,6}$/;
  return regex.test(accountCode);
};

/**
 * Obtenir le libellé d'un compte principal
 * @param {string} accountCode - Code du compte
 * @returns {string|null}
 */
export const getMainAccountLabel = (accountCode) => {
  const mainCode = parseInt(accountCode.substring(0, 2));
  return SYSCOHADA_MAIN_ACCOUNTS[mainCode] || null;
};

/**
 * Déterminer si un compte est un compte de bilan
 * @param {string} accountCode - Code du compte
 * @returns {boolean}
 */
export const isBalanceSheetAccount = (accountCode) => {
  const classNumber = parseInt(accountCode.charAt(0));
  return [1, 2, 3, 4, 5].includes(classNumber);
};

/**
 * Déterminer si un compte est un compte de gestion (charges/produits)
 * @param {string} accountCode - Code du compte
 * @returns {boolean}
 */
export const isIncomeStatementAccount = (accountCode) => {
  const classNumber = parseInt(accountCode.charAt(0));
  return [6, 7, 8].includes(classNumber);
};

/**
 * Obtenir la catégorie d'un compte pour le bilan
 * @param {string} accountCode - Code du compte
 * @returns {string|null}
 */
export const getBalanceSheetCategory = (accountCode) => {
  const classNumber = parseInt(accountCode.charAt(0));

  const categories = {
    1: 'Capitaux propres et passif',
    2: 'Actif immobilisé',
    3: 'Actif circulant - Stocks',
    4: 'Actif circulant - Créances / Passif - Dettes',
    5: 'Trésorerie',
  };

  return categories[classNumber] || null;
};

/**
 * Obtenir la catégorie d'un compte pour le compte de résultat
 * @param {string} accountCode - Code du compte
 * @returns {string|null}
 */
export const getIncomeStatementCategory = (accountCode) => {
  const classNumber = parseInt(accountCode.charAt(0));

  if (classNumber === 6) return 'Charges';
  if (classNumber === 7) return 'Produits';
  if (classNumber === 8) {
    const subClass = parseInt(accountCode.substring(0, 2));
    if ([81, 83, 85, 87, 89].includes(subClass)) return 'Charges';
    return 'Produits';
  }

  return null;
};

/**
 * Vérifier si une écriture est équilibrée (débit = crédit)
 * @param {Array} lines - Lignes d'écriture
 * @returns {boolean}
 */
export const isEntryBalanced = (lines) => {
  const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);

  // Tolérance de 0.01 pour les erreurs d'arrondi
  return Math.abs(totalDebit - totalCredit) < 0.01;
};

/**
 * Calculer les totaux d'une écriture
 * @param {Array} lines - Lignes d'écriture
 * @returns {object}
 */
export const calculateEntryTotals = (lines) => {
  const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
  const difference = totalDebit - totalCredit;

  return {
    totalDebit,
    totalCredit,
    difference,
    isBalanced: Math.abs(difference) < 0.01,
  };
};

/**
 * Générer une écriture d'achat avec TVA
 * @param {object} data - Données de l'achat
 * @returns {Array}
 */
export const generatePurchaseEntry = (data) => {
  const { amountHT, vatRate, supplier, reference } = data;
  const vatAmount = (amountHT * vatRate) / 100;
  const amountTTC = amountHT + vatAmount;

  return [
    {
      account: '601', // Achats de marchandises
      label: `Achat ${reference}`,
      debit: amountHT,
      credit: 0,
    },
    {
      account: '445', // État - TVA récupérable
      label: `TVA sur achat ${reference}`,
      debit: vatAmount,
      credit: 0,
    },
    {
      account: '401', // Fournisseurs
      label: `Fournisseur ${supplier}`,
      debit: 0,
      credit: amountTTC,
    },
  ];
};

/**
 * Générer une écriture de vente avec TVA
 * @param {object} data - Données de la vente
 * @returns {Array}
 */
export const generateSaleEntry = (data) => {
  const { amountHT, vatRate, customer, reference } = data;
  const vatAmount = (amountHT * vatRate) / 100;
  const amountTTC = amountHT + vatAmount;

  return [
    {
      account: '411', // Clients
      label: `Client ${customer}`,
      debit: amountTTC,
      credit: 0,
    },
    {
      account: '701', // Ventes de marchandises
      label: `Vente ${reference}`,
      debit: 0,
      credit: amountHT,
    },
    {
      account: '443', // État - TVA facturée
      label: `TVA sur vente ${reference}`,
      debit: 0,
      credit: vatAmount,
    },
  ];
};

/**
 * Générer une écriture de paiement
 * @param {object} data - Données du paiement
 * @returns {Array}
 */
export const generatePaymentEntry = (data) => {
  const { amount, paymentMethod, party, reference, type } = data;

  // Déterminer le compte de trésorerie selon le mode de paiement
  const treasuryAccounts = {
    cash: '571', // Caisse
    check: '512', // Banque
    bank_transfer: '521', // Banque
    mobile_money: '531', // Caisse
    card: '512', // Banque
  };

  const treasuryAccount = treasuryAccounts[paymentMethod] || '571';

  if (type === 'customer_payment') {
    // Encaissement client
    return [
      {
        account: treasuryAccount,
        label: `Encaissement ${reference}`,
        debit: amount,
        credit: 0,
      },
      {
        account: '411', // Clients
        label: `Client ${party}`,
        debit: 0,
        credit: amount,
      },
    ];
  } else {
    // Paiement fournisseur
    return [
      {
        account: '401', // Fournisseurs
        label: `Fournisseur ${party}`,
        debit: amount,
        credit: 0,
      },
      {
        account: treasuryAccount,
        label: `Paiement ${reference}`,
        debit: 0,
        credit: amount,
      },
    ];
  }
};

/**
 * Obtenir les comptes de TVA
 * @returns {object}
 */
export const getVATAccounts = () => {
  return {
    tva_collectee: '443', // TVA facturée (ventes)
    tva_deductible: '445', // TVA récupérable (achats)
    tva_a_payer: '444', // TVA à payer
  };
};

/**
 * Formater un code compte SYSCOHADA
 * @param {string} code - Code brut
 * @returns {string}
 */
export const formatAccountCode = (code) => {
  if (!code) return '';

  // Supprimer les espaces
  code = code.trim();

  // S'assurer que c'est un nombre
  if (!/^\d+$/.test(code)) return code;

  // Formater avec des espaces selon SYSCOHADA
  if (code.length === 1) return code;
  if (code.length === 2) return code;
  if (code.length === 3) return `${code.substring(0, 2)} ${code.substring(2)}`;
  if (code.length === 4) return `${code.substring(0, 2)} ${code.substring(2)}`;
  if (code.length >= 5) {
    return `${code.substring(0, 2)} ${code.substring(2, 4)} ${code.substring(4)}`;
  }

  return code;
};

export default {
  SYSCOHADA_CLASSES,
  SYSCOHADA_MAIN_ACCOUNTS,
  getAccountClass,
  getNaturalBalance,
  isValidSyscohadaCode,
  getMainAccountLabel,
  isBalanceSheetAccount,
  isIncomeStatementAccount,
  getBalanceSheetCategory,
  getIncomeStatementCategory,
  isEntryBalanced,
  calculateEntryTotals,
  generatePurchaseEntry,
  generateSaleEntry,
  generatePaymentEntry,
  getVATAccounts,
  formatAccountCode,
};
