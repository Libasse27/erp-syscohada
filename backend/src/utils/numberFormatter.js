/**
 * Formattage des nombres
 * Utilitaires pour formater les montants, pourcentages, quantités
 */

/**
 * Formater un montant en FCFA (XOF)
 * @param {number} amount - Montant à formater
 * @param {object} options - Options de formatage
 * @returns {string}
 */
export const formatXOF = (amount, options = {}) => {
  const {
    decimals = 0,
    showCurrency = true,
    locale = 'fr-FR',
  } = options;

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return showCurrency ? `${formatted} FCFA` : formatted;
};

/**
 * Formater un montant en Euro
 * @param {number} amount - Montant à formater
 * @param {object} options - Options de formatage
 * @returns {string}
 */
export const formatEUR = (amount, options = {}) => {
  const {
    decimals = 2,
    showCurrency = true,
    locale = 'fr-FR',
  } = options;

  const formatted = new Intl.NumberFormat(locale, {
    style: showCurrency ? 'currency' : 'decimal',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return formatted;
};

/**
 * Formater un montant en Dollar
 * @param {number} amount - Montant à formater
 * @param {object} options - Options de formatage
 * @returns {string}
 */
export const formatUSD = (amount, options = {}) => {
  const {
    decimals = 2,
    showCurrency = true,
    locale = 'en-US',
  } = options;

  const formatted = new Intl.NumberFormat(locale, {
    style: showCurrency ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return formatted;
};

/**
 * Formater un montant selon la devise
 * @param {number} amount - Montant à formater
 * @param {string} currency - Code devise (XOF, EUR, USD)
 * @param {object} options - Options de formatage
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'XOF', options = {}) => {
  const {
    decimals,
    showCurrency = true,
    locale = 'fr-FR',
  } = options;

  switch (currency.toUpperCase()) {
    case 'XOF':
    case 'FCFA':
      return formatXOF(amount, { decimals: decimals ?? 0, showCurrency, locale });

    case 'EUR':
      return formatEUR(amount, { decimals: decimals ?? 2, showCurrency, locale });

    case 'USD':
      return formatUSD(amount, { decimals: decimals ?? 2, showCurrency, locale: 'en-US' });

    case 'XAF':
      return formatXOF(amount, { decimals: decimals ?? 0, showCurrency, locale });

    default:
      return new Intl.NumberFormat(locale, {
        style: showCurrency ? 'currency' : 'decimal',
        currency: currency,
        minimumFractionDigits: decimals ?? 2,
        maximumFractionDigits: decimals ?? 2,
      }).format(amount);
  }
};

/**
 * Formater un pourcentage
 * @param {number} value - Valeur (0-100)
 * @param {object} options - Options de formatage
 * @returns {string}
 */
export const formatPercentage = (value, options = {}) => {
  const {
    decimals = 2,
    showSymbol = true,
    locale = 'fr-FR',
  } = options;

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return showSymbol ? `${formatted} %` : formatted;
};

/**
 * Formater un nombre entier
 * @param {number} value - Valeur
 * @param {object} options - Options de formatage
 * @returns {string}
 */
export const formatNumber = (value, options = {}) => {
  const { locale = 'fr-FR' } = options;

  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Formater une quantité avec unité
 * @param {number} quantity - Quantité
 * @param {string} unit - Unité
 * @param {object} options - Options
 * @returns {string}
 */
export const formatQuantity = (quantity, unit = 'unit', options = {}) => {
  const { decimals = 0, locale = 'fr-FR' } = options;

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(quantity);

  const unitLabels = {
    unit: 'unité(s)',
    kg: 'kg',
    g: 'g',
    l: 'L',
    ml: 'mL',
    m: 'm',
    cm: 'cm',
    m2: 'm²',
    m3: 'm³',
    pack: 'pack(s)',
    box: 'boîte(s)',
    carton: 'carton(s)',
  };

  const unitLabel = unitLabels[unit] || unit;
  return `${formatted} ${unitLabel}`;
};

/**
 * Formater un nombre avec séparateur de milliers
 * @param {number} value - Valeur
 * @param {string} separator - Séparateur (espace, virgule, point)
 * @returns {string}
 */
export const formatWithSeparator = (value, separator = ' ') => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

/**
 * Formater un nombre en notation compacte (K, M, B)
 * @param {number} value - Valeur
 * @param {object} options - Options
 * @returns {string}
 */
export const formatCompact = (value, options = {}) => {
  const { decimals = 1, locale = 'fr-FR' } = options;

  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }
  return value.toString();
};

/**
 * Formater un montant avec signe (+ ou -)
 * @param {number} amount - Montant
 * @param {string} currency - Devise
 * @param {object} options - Options
 * @returns {string}
 */
export const formatSignedAmount = (amount, currency = 'XOF', options = {}) => {
  const sign = amount >= 0 ? '+' : '';
  const formatted = formatCurrency(Math.abs(amount), currency, options);
  return `${sign}${amount < 0 ? '-' : ''}${formatted}`;
};

/**
 * Parser un montant formaté en nombre
 * @param {string} formattedAmount - Montant formaté
 * @returns {number}
 */
export const parseAmount = (formattedAmount) => {
  if (typeof formattedAmount === 'number') return formattedAmount;

  // Supprimer les espaces, symboles de devise, et texte
  const cleaned = formattedAmount
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.');

  return parseFloat(cleaned) || 0;
};

/**
 * Arrondir un montant selon les règles comptables
 * @param {number} amount - Montant
 * @param {number} decimals - Nombre de décimales
 * @returns {number}
 */
export const roundAmount = (amount, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round((amount + Number.EPSILON) * factor) / factor;
};

/**
 * Arrondir au supérieur (ceiling)
 * @param {number} amount - Montant
 * @param {number} decimals - Nombre de décimales
 * @returns {number}
 */
export const ceilAmount = (amount, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.ceil(amount * factor) / factor;
};

/**
 * Arrondir à l'inférieur (floor)
 * @param {number} amount - Montant
 * @param {number} decimals - Nombre de décimales
 * @returns {number}
 */
export const floorAmount = (amount, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.floor(amount * factor) / factor;
};

/**
 * Convertir un montant en lettres (français)
 * @param {number} amount - Montant
 * @param {string} currency - Devise
 * @returns {string}
 */
export const amountToWords = (amount, currency = 'XOF') => {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  const convertLessThanOneThousand = (num) => {
    if (num === 0) return '';

    const hundred = Math.floor(num / 100);
    const remainder = num % 100;

    let result = '';

    if (hundred > 0) {
      if (hundred === 1) {
        result = 'cent';
      } else {
        result = units[hundred] + ' cent';
      }
      if (remainder === 0) result += 's';
    }

    if (remainder > 0) {
      if (result) result += ' ';

      if (remainder < 10) {
        result += units[remainder];
      } else if (remainder < 20) {
        result += teens[remainder - 10];
      } else {
        const ten = Math.floor(remainder / 10);
        const unit = remainder % 10;

        if (ten === 7 || ten === 9) {
          result += tens[ten - 1] + '-' + teens[unit];
        } else if (ten === 8) {
          result += tens[ten] + (unit > 0 ? '-' + units[unit] : 's');
        } else {
          result += tens[ten];
          if (unit > 0) {
            result += (unit === 1 && ten < 8 ? ' et ' : '-') + units[unit];
          }
        }
      }
    }

    return result;
  };

  if (amount === 0) {
    return `zéro ${currency === 'XOF' ? 'franc CFA' : currency === 'EUR' ? 'euro' : 'dollar'}`;
  }

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  let result = '';

  const billion = Math.floor(integerPart / 1000000000);
  const million = Math.floor((integerPart % 1000000000) / 1000000);
  const thousand = Math.floor((integerPart % 1000000) / 1000);
  const remainder = integerPart % 1000;

  if (billion > 0) {
    result += convertLessThanOneThousand(billion) + ' milliard' + (billion > 1 ? 's' : '');
  }

  if (million > 0) {
    if (result) result += ' ';
    result += convertLessThanOneThousand(million) + ' million' + (million > 1 ? 's' : '');
  }

  if (thousand > 0) {
    if (result) result += ' ';
    if (thousand === 1) {
      result += 'mille';
    } else {
      result += convertLessThanOneThousand(thousand) + ' mille';
    }
  }

  if (remainder > 0) {
    if (result) result += ' ';
    result += convertLessThanOneThousand(remainder);
  }

  // Ajouter la devise
  const currencyName = currency === 'XOF' ? 'franc' + (integerPart > 1 ? 's' : '') + ' CFA' :
    currency === 'EUR' ? 'euro' + (integerPart > 1 ? 's' : '') :
      currency === 'USD' ? 'dollar' + (integerPart > 1 ? 's' : '') : currency;

  result += ' ' + currencyName;

  // Ajouter les centimes si présents
  if (decimalPart > 0) {
    const centimeName = currency === 'XOF' ? 'centime' + (decimalPart > 1 ? 's' : '') :
      currency === 'EUR' ? 'centime' + (decimalPart > 1 ? 's' : '') :
        currency === 'USD' ? 'cent' + (decimalPart > 1 ? 's' : '') : '';

    result += ' et ' + convertLessThanOneThousand(decimalPart) + ' ' + centimeName;
  }

  return result.trim();
};

export default {
  formatXOF,
  formatEUR,
  formatUSD,
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatQuantity,
  formatWithSeparator,
  formatCompact,
  formatSignedAmount,
  parseAmount,
  roundAmount,
  ceilAmount,
  floorAmount,
  amountToWords,
};
