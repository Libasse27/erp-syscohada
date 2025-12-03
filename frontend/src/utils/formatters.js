// Formatting Functions
import { DEFAULT_CURRENCY, CURRENCY_SYMBOL, DECIMAL_PLACES } from './constants';

/**
 * Format date to French locale
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'datetime', 'time'
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('fr-FR');
    case 'long':
      return dateObj.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'datetime':
      return dateObj.toLocaleString('fr-FR');
    case 'time':
      return dateObj.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return dateObj.toLocaleDateString('fr-FR');
  }
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted currency
 */
export const formatCurrency = (amount, currency = DEFAULT_CURRENCY, decimals = DECIMAL_PLACES) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0 ${CURRENCY_SYMBOL}`;
  }

  const formatted = Number(amount).toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${formatted} ${CURRENCY_SYMBOL}`;
};

/**
 * Format relative time (e.g., "il y a 2 jours")
 * @param {Date|string} date - Date to format
 * @returns {string} - Relative time
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) return 'À l\'instant';
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`;
  if (diffInSeconds < 31536000) return `Il y a ${Math.floor(diffInSeconds / 2592000)} mois`;
  return `Il y a ${Math.floor(diffInSeconds / 31536000)} ans`;
};

/**
 * Format date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {string} - Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Get month name in French
 * @param {number} month - Month number (0-11)
 * @returns {string} - Month name
 */
export const getMonthName = (month) => {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[month] || '';
};

/**
 * Format number with thousand separators
 * @param {number} number - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted number
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }

  return Number(number).toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Octets';
  if (!bytes) return 'N/A';

  const k = 1024;
  const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone
 */
export const formatPhone = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as XX XXX XX XX (Senegal format)
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }

  // Format with country code
  if (cleaned.length === 12 && cleaned.startsWith('221')) {
    return cleaned.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
  }

  return phone;
};

/**
 * Format SIRET number
 * @param {string} siret - SIRET to format
 * @returns {string} - Formatted SIRET
 */
export const formatSIRET = (siret) => {
  if (!siret) return '';
  const cleaned = siret.replace(/\s/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
};

/**
 * Format IBAN
 * @param {string} iban - IBAN to format
 * @returns {string} - Formatted IBAN
 */
export const formatIBAN = (iban) => {
  if (!iban) return '';
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  return cleaned.match(/.{1,4}/g)?.join(' ') || iban;
};

/**
 * Format name (capitalize each word)
 * @param {string} name - Name to format
 * @returns {string} - Formatted name
 */
export const formatName = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format address to single line
 * @param {Object} address - Address object
 * @returns {string} - Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return '';

  const parts = [
    address.street,
    address.city,
    address.postalCode,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
};

/**
 * Format initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials
 */
export const formatInitials = (name) => {
  if (!name) return '';

  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Format account number (SYSCOHADA)
 * @param {string} account - Account number
 * @returns {string} - Formatted account
 */
export const formatAccountNumber = (account) => {
  if (!account) return '';

  // Format SYSCOHADA account: Class-Group-Account-SubAccount
  const cleaned = account.replace(/\D/g, '');

  if (cleaned.length >= 6) {
    return cleaned.replace(/(\d{1})(\d{2})(\d{2})(\d+)/, '$1-$2-$3-$4');
  }

  return account;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};

/**
 * Format status badge text
 * @param {string} status - Status value
 * @returns {string} - Formatted status
 */
export const formatStatus = (status) => {
  if (!status) return '';
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format list to comma-separated string
 * @param {Array} items - Array of items
 * @param {string} conjunction - Conjunction word (default: 'et')
 * @returns {string} - Formatted list
 */
export const formatList = (items, conjunction = 'et') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1).join(', ');
  return `${otherItems} ${conjunction} ${lastItem}`;
};

/**
 * Format duration in seconds to readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Format quantity with unit
 * @param {number} quantity - Quantity value
 * @param {string} unit - Unit name
 * @param {boolean} plural - Use plural form
 * @returns {string} - Formatted quantity
 */
export const formatQuantity = (quantity, unit, plural = true) => {
  const qty = formatNumber(quantity, 2);
  const unitText = plural && quantity > 1 ? `${unit}s` : unit;
  return `${qty} ${unitText}`;
};

/**
 * Format boolean to Oui/Non
 * @param {boolean} value - Boolean value
 * @returns {string} - 'Oui' or 'Non'
 */
export const formatBoolean = (value) => {
  return value ? 'Oui' : 'Non';
};

/**
 * Parse currency string to number
 * @param {string} value - Currency string
 * @returns {number} - Numeric value
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  const cleaned = value.toString().replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

/**
 * Parse number string with French format
 * @param {string} value - Number string
 * @returns {number} - Numeric value
 */
export const parseNumber = (value) => {
  if (!value) return 0;
  const cleaned = value.toString().replace(/\s/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

/**
 * Highlight search term in text
 * @param {string} text - Text to highlight
 * @param {string} search - Search term
 * @returns {string} - HTML string with highlighted text
 */
export const highlightText = (text, search) => {
  if (!text || !search) return text;

  const regex = new RegExp(`(${search})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};
