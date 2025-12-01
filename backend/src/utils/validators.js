/**
 * Fonctions de validation personnalisées
 * Validators réutilisables pour diverses validations
 */

/**
 * Valider un email
 * @param {string} email - Email à valider
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Valider un numéro de téléphone sénégalais
 * @param {string} phone - Numéro à valider
 * @returns {boolean}
 */
export const isValidSenegalPhone = (phone) => {
  const phoneRegex = /^(\+221|00221)?[0-9]{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Valider un numéro de téléphone international
 * @param {string} phone - Numéro à valider
 * @returns {boolean}
 */
export const isValidInternationalPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

/**
 * Valider un MongoDB ObjectId
 * @param {string} id - ID à valider
 * @returns {boolean}
 */
export const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Valider un code SYSCOHADA
 * @param {string} code - Code comptable à valider
 * @returns {boolean}
 */
export const isValidSyscohadaCode = (code) => {
  // Classe 1-8, jusqu'à 7 chiffres
  const syscohadaRegex = /^[1-8][0-9]{0,6}$/;
  return syscohadaRegex.test(code);
};

/**
 * Valider la classe SYSCOHADA d'un code
 * @param {string} code - Code comptable
 * @returns {number|null} - Classe (1-8) ou null
 */
export const getSyscohadaClass = (code) => {
  if (!isValidSyscohadaCode(code)) return null;
  return parseInt(code.charAt(0));
};

/**
 * Valider un numéro NINEA (Sénégal)
 * @param {string} ninea - Numéro NINEA
 * @returns {boolean}
 */
export const isValidNINEA = (ninea) => {
  // Format: 7 chiffres
  const nineaRegex = /^[0-9]{7}$/;
  return nineaRegex.test(ninea);
};

/**
 * Valider un numéro RC (Registre du Commerce)
 * @param {string} rc - Numéro RC
 * @returns {boolean}
 */
export const isValidRC = (rc) => {
  // Format: SN-DKR-YYYY-X-XXXXX
  const rcRegex = /^SN-[A-Z]{3}-\d{4}-[A-Z]-\d{5}$/;
  return rcRegex.test(rc);
};

/**
 * Valider un code barres EAN-13
 * @param {string} barcode - Code barres
 * @returns {boolean}
 */
export const isValidEAN13 = (barcode) => {
  if (!/^\d{13}$/.test(barcode)) return false;

  // Algorithme de vérification EAN-13
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode.charAt(i));
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(barcode.charAt(12));
};

/**
 * Valider un IBAN
 * @param {string} iban - IBAN à valider
 * @returns {boolean}
 */
export const isValidIBAN = (iban) => {
  // Supprimer les espaces
  const ibanCleaned = iban.replace(/\s/g, '').toUpperCase();

  // Vérifier le format de base
  const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]+$/;
  if (!ibanRegex.test(ibanCleaned)) return false;

  // Longueur minimale/maximale
  if (ibanCleaned.length < 15 || ibanCleaned.length > 34) return false;

  // Algorithme de validation modulo 97
  const rearranged = ibanCleaned.substring(4) + ibanCleaned.substring(0, 4);
  const numericIBAN = rearranged.replace(/[A-Z]/g, (char) => {
    return (char.charCodeAt(0) - 55).toString();
  });

  // BigInt pour gérer les grands nombres
  const remainder = BigInt(numericIBAN) % 97n;
  return remainder === 1n;
};

/**
 * Valider un numéro de chèque
 * @param {string} checkNumber - Numéro de chèque
 * @returns {boolean}
 */
export const isValidCheckNumber = (checkNumber) => {
  // Format: 7 chiffres minimum
  const checkRegex = /^\d{7,}$/;
  return checkRegex.test(checkNumber);
};

/**
 * Valider une URL
 * @param {string} url - URL à valider
 * @returns {boolean}
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valider un mot de passe fort
 * @param {string} password - Mot de passe
 * @returns {object} - { isValid, errors }
 */
export const isStrongPassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valider une devise
 * @param {string} currency - Code devise (ISO 4217)
 * @returns {boolean}
 */
export const isValidCurrency = (currency) => {
  const validCurrencies = ['XOF', 'EUR', 'USD', 'GBP', 'XAF', 'MAD'];
  return validCurrencies.includes(currency.toUpperCase());
};

/**
 * Valider une date
 * @param {string|Date} date - Date à valider
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Valider si une date est dans le futur
 * @param {string|Date} date - Date à valider
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  const dateObj = new Date(date);
  return dateObj > new Date();
};

/**
 * Valider si une date est dans le passé
 * @param {string|Date} date - Date à valider
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  const dateObj = new Date(date);
  return dateObj < new Date();
};

/**
 * Valider une période comptable (format YYYY-MM)
 * @param {string} period - Période à valider
 * @returns {boolean}
 */
export const isValidAccountingPeriod = (period) => {
  const periodRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return periodRegex.test(period);
};

/**
 * Valider un exercice comptable (format YYYY)
 * @param {string} fiscalYear - Exercice à valider
 * @returns {boolean}
 */
export const isValidFiscalYear = (fiscalYear) => {
  const yearRegex = /^\d{4}$/;
  if (!yearRegex.test(fiscalYear)) return false;

  const year = parseInt(fiscalYear);
  return year >= 2000 && year <= 2100;
};

/**
 * Valider un taux de TVA
 * @param {number} vatRate - Taux de TVA
 * @returns {boolean}
 */
export const isValidVATRate = (vatRate) => {
  const validRates = [0, 5, 10, 18, 20]; // Taux courants en Afrique de l'Ouest
  return validRates.includes(vatRate);
};

/**
 * Valider un montant
 * @param {number} amount - Montant
 * @param {object} options - Options de validation
 * @returns {boolean}
 */
export const isValidAmount = (amount, options = {}) => {
  const { min = 0, max = Infinity, allowNegative = false } = options;

  if (typeof amount !== 'number' || isNaN(amount)) return false;
  if (!allowNegative && amount < 0) return false;
  if (amount < min || amount > max) return false;

  return true;
};

/**
 * Valider une quantité
 * @param {number} quantity - Quantité
 * @returns {boolean}
 */
export const isValidQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity > 0;
};

/**
 * Valider un code postal français/sénégalais
 * @param {string} postalCode - Code postal
 * @param {string} country - Pays (FR, SN)
 * @returns {boolean}
 */
export const isValidPostalCode = (postalCode, country = 'SN') => {
  if (country === 'FR') {
    return /^\d{5}$/.test(postalCode);
  }
  if (country === 'SN') {
    return /^\d{5}$/.test(postalCode);
  }
  return false;
};

/**
 * Sanitize une chaîne (prévention XSS)
 * @param {string} str - Chaîne à nettoyer
 * @returns {string}
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '')
    .trim();
};

/**
 * Valider un JSON
 * @param {string} jsonString - JSON à valider
 * @returns {boolean}
 */
export const isValidJSON = (jsonString) => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};

export default {
  isValidEmail,
  isValidSenegalPhone,
  isValidInternationalPhone,
  isValidObjectId,
  isValidSyscohadaCode,
  getSyscohadaClass,
  isValidNINEA,
  isValidRC,
  isValidEAN13,
  isValidIBAN,
  isValidCheckNumber,
  isValidURL,
  isStrongPassword,
  isValidCurrency,
  isValidDate,
  isFutureDate,
  isPastDate,
  isValidAccountingPeriod,
  isValidFiscalYear,
  isValidVATRate,
  isValidAmount,
  isValidQuantity,
  isValidPostalCode,
  sanitizeString,
  isValidJSON,
};
