/**
 * Formattage des dates
 * Utilitaires pour formater et manipuler les dates
 */

/**
 * Formater une date au format français
 * @param {Date|string} date - Date à formater
 * @param {string} format - Format de sortie
 * @returns {string}
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  const formats = {
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'DD-MM-YYYY': `${day}-${month}-${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'DD/MM/YYYY HH:mm': `${day}/${month}/${year} ${hours}:${minutes}`,
    'DD/MM/YYYY HH:mm:ss': `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`,
    'YYYY-MM-DD HH:mm:ss': `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    'HH:mm': `${hours}:${minutes}`,
    'HH:mm:ss': `${hours}:${minutes}:${seconds}`,
  };

  return formats[format] || formats['DD/MM/YYYY'];
};

/**
 * Formater une date au format long (français)
 * @param {Date|string} date - Date à formater
 * @param {object} options - Options
 * @returns {string}
 */
export const formatDateLong = (date, options = {}) => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const { locale = 'fr-FR', includeTime = false } = options;

  const formatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
};

/**
 * Formater une date au format court (français)
 * @param {Date|string} date - Date à formater
 * @param {string} locale - Locale
 * @returns {string}
 */
export const formatDateShort = (date, locale = 'fr-FR') => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Formater une date en relatif (il y a X jours)
 * @param {Date|string} date - Date à formater
 * @param {string} locale - Locale
 * @returns {string}
 */
export const formatDateRelative = (date, locale = 'fr-FR') => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const now = new Date();
  const diffMs = now - dateObj;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return "à l'instant";
  if (diffMins < 60) return `il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 30) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  if (diffMonths < 12) return `il y a ${diffMonths} mois`;
  return `il y a ${diffYears} an${diffYears > 1 ? 's' : ''}`;
};

/**
 * Formater une plage de dates
 * @param {Date|string} startDate - Date de début
 * @param {Date|string} endDate - Date de fin
 * @param {string} format - Format
 * @returns {string}
 */
export const formatDateRange = (startDate, endDate, format = 'DD/MM/YYYY') => {
  const start = formatDate(startDate, format);
  const end = formatDate(endDate, format);
  return `${start} - ${end}`;
};

/**
 * Obtenir le mois en toutes lettres
 * @param {number} month - Mois (1-12)
 * @param {boolean} short - Format court
 * @returns {string}
 */
export const getMonthName = (month, short = false) => {
  const monthsLong = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  const monthsShort = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
  ];

  const index = month - 1;
  return short ? monthsShort[index] : monthsLong[index];
};

/**
 * Obtenir le jour de la semaine
 * @param {Date|string} date - Date
 * @param {boolean} short - Format court
 * @returns {string}
 */
export const getDayName = (date, short = false) => {
  const dateObj = new Date(date);
  const dayIndex = dateObj.getDay();

  const daysLong = [
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi',
  ];

  const daysShort = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return short ? daysShort[dayIndex] : daysLong[dayIndex];
};

/**
 * Ajouter des jours à une date
 * @param {Date|string} date - Date de base
 * @param {number} days - Nombre de jours
 * @returns {Date}
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Ajouter des mois à une date
 * @param {Date|string} date - Date de base
 * @param {number} months - Nombre de mois
 * @returns {Date}
 */
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Calculer la différence en jours entre deux dates
 * @param {Date|string} date1 - Première date
 * @param {Date|string} date2 - Deuxième date
 * @returns {number}
 */
export const daysDiff = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffMs = d2 - d1;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Vérifier si une date est aujourd'hui
 * @param {Date|string} date - Date à vérifier
 * @returns {boolean}
 */
export const isToday = (date) => {
  const today = new Date();
  const dateObj = new Date(date);

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Vérifier si une date est dans le passé
 * @param {Date|string} date - Date à vérifier
 * @returns {boolean}
 */
export const isPast = (date) => {
  return new Date(date) < new Date();
};

/**
 * Vérifier si une date est dans le futur
 * @param {Date|string} date - Date à vérifier
 * @returns {boolean}
 */
export const isFuture = (date) => {
  return new Date(date) > new Date();
};

/**
 * Obtenir le début du mois
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export const startOfMonth = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

/**
 * Obtenir la fin du mois
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export const endOfMonth = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
};

/**
 * Obtenir le début de l'année
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export const startOfYear = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), 0, 1);
};

/**
 * Obtenir la fin de l'année
 * @param {Date|string} date - Date
 * @returns {Date}
 */
export const endOfYear = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
};

/**
 * Formater une période comptable (YYYY-MM)
 * @param {Date|string} date - Date
 * @returns {string}
 */
export const formatAccountingPeriod = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Obtenir l'exercice fiscal
 * @param {Date|string} date - Date
 * @returns {string}
 */
export const getFiscalYear = (date = new Date()) => {
  const d = new Date(date);
  return d.getFullYear().toString();
};

/**
 * Formater une durée en secondes en texte lisible
 * @param {number} seconds - Durée en secondes
 * @returns {string}
 */
export const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}j ${remainingHours}h` : `${days}j`;
};

/**
 * Parser une date au format français (DD/MM/YYYY)
 * @param {string} dateString - Date au format français
 * @returns {Date|null}
 */
export const parseFrenchDate = (dateString) => {
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Obtenir la liste des mois d'une année
 * @param {number} year - Année
 * @returns {Array}
 */
export const getMonthsOfYear = (year = new Date().getFullYear()) => {
  return Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    name: getMonthName(i + 1),
    period: `${year}-${String(i + 1).padStart(2, '0')}`,
    startDate: new Date(year, i, 1),
    endDate: new Date(year, i + 1, 0, 23, 59, 59, 999),
  }));
};

/**
 * Formater une date au format ISO 8601
 * @param {Date|string} date - Date
 * @returns {string}
 */
export const toISODate = (date = new Date()) => {
  return new Date(date).toISOString();
};

export default {
  formatDate,
  formatDateLong,
  formatDateShort,
  formatDateRelative,
  formatDateRange,
  getMonthName,
  getDayName,
  addDays,
  addMonths,
  daysDiff,
  isToday,
  isPast,
  isFuture,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  formatAccountingPeriod,
  getFiscalYear,
  formatDuration,
  parseFrenchDate,
  getMonthsOfYear,
  toISODate,
};
