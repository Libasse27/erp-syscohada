// Validation Functions
import { VALIDATION } from './constants';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validate phone number (Senegal format)
 * @param {string} phone - Phone to validate
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  return VALIDATION.PHONE_REGEX.test(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    return { isValid: false, errors: ['Le mot de passe est requis'] };
  }

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    errors.push(`Le mot de passe doit contenir au moins ${VALIDATION.MIN_PASSWORD_LENGTH} caractères`);
  }

  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    errors.push(`Le mot de passe ne doit pas dépasser ${VALIDATION.MAX_PASSWORD_LENGTH} caractères`);
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
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
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} - Validation result
 */
export const validateUsername = (username) => {
  const errors = [];

  if (!username) {
    return { isValid: false, errors: ['Le nom d\'utilisateur est requis'] };
  }

  if (username.length < VALIDATION.MIN_USERNAME_LENGTH) {
    errors.push(`Le nom d'utilisateur doit contenir au moins ${VALIDATION.MIN_USERNAME_LENGTH} caractères`);
  }

  if (username.length > VALIDATION.MAX_USERNAME_LENGTH) {
    errors.push(`Le nom d'utilisateur ne doit pas dépasser ${VALIDATION.MAX_USERNAME_LENGTH} caractères`);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate required field
 * @param {*} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} - Error message or null
 */
export const validateRequired = (value, fieldName = 'Ce champ') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} est requis`;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} est requis`;
  }
  return null;
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} - Error message or null
 */
export const validateMinLength = (value, min, fieldName = 'Ce champ') => {
  if (!value || value.length < min) {
    return `${fieldName} doit contenir au moins ${min} caractères`;
  }
  return null;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} - Error message or null
 */
export const validateMaxLength = (value, max, fieldName = 'Ce champ') => {
  if (value && value.length > max) {
    return `${fieldName} ne doit pas dépasser ${max} caractères`;
  }
  return null;
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} - Error message or null
 */
export const validateRange = (value, min, max, fieldName = 'Ce champ') => {
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} doit être un nombre`;
  }
  if (num < min || num > max) {
    return `${fieldName} doit être entre ${min} et ${max}`;
  }
  return null;
};

/**
 * Validate positive number
 * @param {number} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} - Error message or null
 */
export const validatePositive = (value, fieldName = 'Ce champ') => {
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} doit être un nombre`;
  }
  if (num < 0) {
    return `${fieldName} doit être positif`;
  }
  return null;
};

/**
 * Validate date format
 * @param {string} date - Date to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} - Error message or null
 */
export const validateDate = (date, fieldName = 'La date') => {
  if (!date) {
    return `${fieldName} est requise`;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} n'est pas valide`;
  }
  return null;
};

/**
 * Validate date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {string|null} - Error message or null
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return 'Les dates de début et de fin sont requises';
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) {
    return 'La date de début doit être antérieure à la date de fin';
  }
  return null;
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {string|null} - Error message or null
 */
export const validateFileSize = (file, maxSize) => {
  if (!file) {
    return 'Le fichier est requis';
  }
  if (file.size > maxSize) {
    const maxMB = (maxSize / (1024 * 1024)).toFixed(2);
    return `Le fichier ne doit pas dépasser ${maxMB} MB`;
  }
  return null;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @returns {string|null} - Error message or null
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) {
    return 'Le fichier est requis';
  }
  if (!allowedTypes.includes(file.type)) {
    return 'Type de fichier non autorisé';
  }
  return null;
};

/**
 * Validate SIRET number (French business identifier)
 * @param {string} siret - SIRET to validate
 * @returns {boolean} - True if valid
 */
export const isValidSIRET = (siret) => {
  if (!siret) return false;
  const cleaned = siret.replace(/\s/g, '');
  return cleaned.length === VALIDATION.SIRET_LENGTH && /^\d+$/.test(cleaned);
};

/**
 * Validate Tax ID
 * @param {string} taxId - Tax ID to validate
 * @returns {boolean} - True if valid
 */
export const isValidTaxId = (taxId) => {
  if (!taxId) return false;
  return VALIDATION.TAX_ID_REGEX.test(taxId);
};

/**
 * Validate IBAN (International Bank Account Number)
 * @param {string} iban - IBAN to validate
 * @returns {boolean} - True if valid
 */
export const isValidIBAN = (iban) => {
  if (!iban) return false;
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  if (cleaned.length < 15 || cleaned.length > 34) return false;

  const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
  const numericString = rearranged.replace(/[A-Z]/g, (char) => char.charCodeAt(0) - 55);

  // Modulo 97 check
  let remainder = numericString;
  while (remainder.length > 2) {
    const block = remainder.substring(0, 9);
    remainder = (parseInt(block, 10) % 97) + remainder.substring(block.length);
  }

  return parseInt(remainder, 10) % 97 === 1;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export const isValidURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate form data
 * @param {Object} data - Form data
 * @param {Object} rules - Validation rules
 * @returns {Object} - Errors object
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = data[field];

    if (fieldRules.required) {
      const error = validateRequired(value, fieldRules.label || field);
      if (error) {
        errors[field] = error;
        return;
      }
    }

    if (fieldRules.minLength) {
      const error = validateMinLength(value, fieldRules.minLength, fieldRules.label || field);
      if (error) {
        errors[field] = error;
        return;
      }
    }

    if (fieldRules.maxLength) {
      const error = validateMaxLength(value, fieldRules.maxLength, fieldRules.label || field);
      if (error) {
        errors[field] = error;
        return;
      }
    }

    if (fieldRules.email && value) {
      if (!isValidEmail(value)) {
        errors[field] = 'Email invalide';
        return;
      }
    }

    if (fieldRules.phone && value) {
      if (!isValidPhone(value)) {
        errors[field] = 'Numéro de téléphone invalide';
        return;
      }
    }

    if (fieldRules.min !== undefined || fieldRules.max !== undefined) {
      const error = validateRange(
        value,
        fieldRules.min ?? -Infinity,
        fieldRules.max ?? Infinity,
        fieldRules.label || field
      );
      if (error) {
        errors[field] = error;
        return;
      }
    }

    if (fieldRules.positive && value) {
      const error = validatePositive(value, fieldRules.label || field);
      if (error) {
        errors[field] = error;
        return;
      }
    }

    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const error = fieldRules.custom(value, data);
      if (error) {
        errors[field] = error;
      }
    }
  });

  return errors;
};
