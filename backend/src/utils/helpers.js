/**
 * Fonctions utilitaires générales
 * Helpers réutilisables dans toute l'application
 */

/**
 * Générer une chaîne aléatoire
 * @param {number} length - Longueur de la chaîne
 * @returns {string}
 */
export const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Générer un code numérique aléatoire
 * @param {number} length - Longueur du code
 * @returns {string}
 */
export const generateRandomCode = (length = 6) => {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

/**
 * Capitaliser la première lettre d'une chaîne
 * @param {string} str - Chaîne à capitaliser
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitaliser chaque mot d'une chaîne
 * @param {string} str - Chaîne à capitaliser
 * @returns {string}
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Tronquer une chaîne avec ellipsis
 * @param {string} str - Chaîne à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string}
 */
export const truncate = (str, maxLength = 50) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
};

/**
 * Nettoyer un objet en supprimant les valeurs null/undefined
 * @param {object} obj - Objet à nettoyer
 * @returns {object}
 */
export const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null && value !== '')
  );
};

/**
 * Extraire les initiales d'un nom
 * @param {string} firstName - Prénom
 * @param {string} lastName - Nom
 * @returns {string}
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
};

/**
 * Calculer un pourcentage
 * @param {number} value - Valeur
 * @param {number} total - Total
 * @param {number} decimals - Nombre de décimales
 * @returns {number}
 */
export const calculatePercentage = (value, total, decimals = 2) => {
  if (!total || total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
};

/**
 * Calculer une remise
 * @param {number} amount - Montant
 * @param {number} discount - Remise
 * @param {string} type - Type de remise (percentage ou fixed)
 * @returns {number}
 */
export const calculateDiscount = (amount, discount, type = 'percentage') => {
  if (!discount || discount === 0) return 0;

  if (type === 'percentage') {
    return (amount * discount) / 100;
  }

  return discount;
};

/**
 * Calculer la TVA
 * @param {number} amount - Montant HT
 * @param {number} vatRate - Taux de TVA
 * @returns {number}
 */
export const calculateVAT = (amount, vatRate) => {
  return (amount * vatRate) / 100;
};

/**
 * Calculer le montant TTC
 * @param {number} amountHT - Montant HT
 * @param {number} vatRate - Taux de TVA
 * @returns {number}
 */
export const calculateTTC = (amountHT, vatRate) => {
  return amountHT + calculateVAT(amountHT, vatRate);
};

/**
 * Calculer le montant HT depuis un montant TTC
 * @param {number} amountTTC - Montant TTC
 * @param {number} vatRate - Taux de TVA
 * @returns {number}
 */
export const calculateHT = (amountTTC, vatRate) => {
  return amountTTC / (1 + vatRate / 100);
};

/**
 * Arrondir un nombre à n décimales
 * @param {number} value - Valeur à arrondir
 * @param {number} decimals - Nombre de décimales
 * @returns {number}
 */
export const roundTo = (value, decimals = 2) => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Grouper un tableau par une clé
 * @param {Array} array - Tableau à grouper
 * @param {string} key - Clé de groupement
 * @returns {object}
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Paginer un tableau
 * @param {Array} array - Tableau à paginer
 * @param {number} page - Numéro de page (commence à 1)
 * @param {number} limit - Nombre d'éléments par page
 * @returns {object}
 */
export const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
      hasNext: endIndex < array.length,
      hasPrev: page > 1,
    },
  };
};

/**
 * Retarder l'exécution (sleep)
 * @param {number} ms - Millisecondes
 * @returns {Promise}
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry une fonction asynchrone
 * @param {Function} fn - Fonction à exécuter
 * @param {number} retries - Nombre de tentatives
 * @param {number} delay - Délai entre les tentatives (ms)
 * @returns {Promise}
 */
export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay);
  }
};

/**
 * Générer un slug depuis une chaîne
 * @param {string} str - Chaîne à slugifier
 * @returns {string}
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Vérifier si une valeur est vide
 * @param {*} value - Valeur à vérifier
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Générer un objet de pagination MongoDB
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {object}
 */
export const getPaginationParams = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};

/**
 * Formater une réponse API paginée
 * @param {Array} data - Données
 * @param {number} total - Total d'éléments
 * @param {number} page - Page actuelle
 * @param {number} limit - Limite par page
 * @returns {object}
 */
export const formatPaginatedResponse = (data, total, page, limit) => {
  return {
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

export default {
  generateRandomString,
  generateRandomCode,
  capitalize,
  capitalizeWords,
  truncate,
  cleanObject,
  getInitials,
  calculatePercentage,
  calculateDiscount,
  calculateVAT,
  calculateTTC,
  calculateHT,
  roundTo,
  groupBy,
  paginate,
  sleep,
  retry,
  slugify,
  isEmpty,
  getPaginationParams,
  formatPaginatedResponse,
};
