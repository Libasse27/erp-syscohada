// Date Utility Functions
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT, API_DATE_FORMAT } from './constants';

/**
 * Format date to French locale
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = DATE_FORMAT) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Format date to API format (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatDateForAPI = (date) => {
  return formatDate(date, API_DATE_FORMAT);
};

/**
 * Format datetime
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted datetime
 */
export const formatDateTime = (date) => {
  return formatDate(date, DATETIME_FORMAT);
};

/**
 * Format time only
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted time
 */
export const formatTime = (date) => {
  return formatDate(date, TIME_FORMAT);
};

/**
 * Get relative time (e.g., "il y a 2 heures")
 * @param {Date|string} date - Date to compare
 * @returns {string} - Relative time
 */
export const getRelativeTime = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);

  if (diffInSeconds < 60) {
    return 'à l\'instant';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `il y a ${diffInMonths} mois`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
};

/**
 * Parse date string to Date object
 * @param {string} dateString - Date string
 * @returns {Date|null} - Date object or null
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if today
 */
export const isToday = (date) => {
  if (!date) return false;

  const d = new Date(date);
  const today = new Date();

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is yesterday
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if yesterday
 */
export const isYesterday = (date) => {
  if (!date) return false;

  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Check if date is in current week
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if in current week
 */
export const isThisWeek = (date) => {
  if (!date) return false;

  const d = new Date(date);
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

  startOfWeek.setHours(0, 0, 0, 0);
  endOfWeek.setHours(23, 59, 59, 999);

  return d >= startOfWeek && d <= endOfWeek;
};

/**
 * Check if date is in current month
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if in current month
 */
export const isThisMonth = (date) => {
  if (!date) return false;

  const d = new Date(date);
  const now = new Date();

  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

/**
 * Check if date is in current year
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if in current year
 */
export const isThisYear = (date) => {
  if (!date) return false;

  const d = new Date(date);
  const now = new Date();

  return d.getFullYear() === now.getFullYear();
};

/**
 * Add days to date
 * @param {Date|string} date - Starting date
 * @param {number} days - Days to add
 * @returns {Date} - New date
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Add months to date
 * @param {Date|string} date - Starting date
 * @param {number} months - Months to add
 * @returns {Date} - New date
 */
export const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * Add years to date
 * @param {Date|string} date - Starting date
 * @param {number} years - Years to add
 * @returns {Date} - New date
 */
export const addYears = (date, years) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

/**
 * Get difference in days between two dates
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {number} - Difference in days
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get start of day
 * @param {Date|string} date - Date
 * @returns {Date} - Start of day
 */
export const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 * @param {Date|string} date - Date
 * @returns {Date} - End of day
 */
export const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of month
 * @param {Date|string} date - Date
 * @returns {Date} - Start of month
 */
export const startOfMonth = (date) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of month
 * @param {Date|string} date - Date
 * @returns {Date} - End of month
 */
export const endOfMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of year
 * @param {Date|string} date - Date
 * @returns {Date} - Start of year
 */
export const startOfYear = (date) => {
  const d = new Date(date);
  d.setMonth(0);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of year
 * @param {Date|string} date - Date
 * @returns {Date} - End of year
 */
export const endOfYear = (date) => {
  const d = new Date(date);
  d.setMonth(11);
  d.setDate(31);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Get month name in French
 * @param {number} month - Month number (0-11)
 * @returns {string} - Month name
 */
export const getMonthName = (month) => {
  const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  return months[month] || '';
};

/**
 * Get day name in French
 * @param {number} day - Day number (0-6)
 * @returns {string} - Day name
 */
export const getDayName = (day) => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[day] || '';
};

/**
 * Check if date is weekend
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if weekend
 */
export const isWeekend = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6;
};

/**
 * Check if date is business day (weekday)
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if business day
 */
export const isBusinessDay = (date) => {
  return !isWeekend(date);
};

/**
 * Get age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} - Age in years
 */
export const getAge = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Check if date is overdue
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Get date range for period
 * @param {string} period - Period ('today', 'week', 'month', 'year')
 * @returns {Object} - {startDate, endDate}
 */
export const getDateRange = (period) => {
  const now = new Date();

  switch (period) {
    case 'today':
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      };
    case 'week':
      return {
        startDate: startOfDay(addDays(now, -7)),
        endDate: endOfDay(now),
      };
    case 'month':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };
    case 'year':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
      };
    default:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };
  }
};
