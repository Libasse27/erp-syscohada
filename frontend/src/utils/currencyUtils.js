// Currency Utility Functions
import { DEFAULT_CURRENCY, CURRENCY_SYMBOL, DECIMAL_PLACES } from './constants';

/**
 * Format amount as currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0 ${CURRENCY_SYMBOL}`;
  }

  const formatted = Number(amount).toLocaleString('fr-FR', {
    minimumFractionDigits: DECIMAL_PLACES,
    maximumFractionDigits: DECIMAL_PLACES,
  });

  return `${formatted} ${CURRENCY_SYMBOL}`;
};

/**
 * Parse currency string to number
 * @param {string} value - Currency string
 * @returns {number} - Numeric value
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  const cleaned = value
    .toString()
    .replace(new RegExp(CURRENCY_SYMBOL, 'g'), '')
    .replace(/\s/g, '')
    .replace(',', '.');
  return parseFloat(cleaned) || 0;
};

/**
 * Add two currency amounts
 * @param {number} amount1 - First amount
 * @param {number} amount2 - Second amount
 * @returns {number} - Sum
 */
export const addAmounts = (amount1, amount2) => {
  return Number((Number(amount1) + Number(amount2)).toFixed(DECIMAL_PLACES));
};

/**
 * Subtract currency amounts
 * @param {number} amount1 - First amount
 * @param {number} amount2 - Second amount
 * @returns {number} - Difference
 */
export const subtractAmounts = (amount1, amount2) => {
  return Number((Number(amount1) - Number(amount2)).toFixed(DECIMAL_PLACES));
};

/**
 * Multiply amount by factor
 * @param {number} amount - Amount
 * @param {number} factor - Multiplier
 * @returns {number} - Product
 */
export const multiplyAmount = (amount, factor) => {
  return Number((Number(amount) * Number(factor)).toFixed(DECIMAL_PLACES));
};

/**
 * Divide amount by divisor
 * @param {number} amount - Amount
 * @param {number} divisor - Divisor
 * @returns {number} - Quotient
 */
export const divideAmount = (amount, divisor) => {
  if (divisor === 0) return 0;
  return Number((Number(amount) / Number(divisor)).toFixed(DECIMAL_PLACES));
};

/**
 * Calculate percentage of amount
 * @param {number} amount - Amount
 * @param {number} percentage - Percentage
 * @returns {number} - Calculated amount
 */
export const calculatePercentage = (amount, percentage) => {
  return Number(((Number(amount) * Number(percentage)) / 100).toFixed(DECIMAL_PLACES));
};

/**
 * Apply discount to amount
 * @param {number} amount - Original amount
 * @param {number} discount - Discount percentage
 * @returns {number} - Amount after discount
 */
export const applyDiscount = (amount, discount) => {
  const discountAmount = calculatePercentage(amount, discount);
  return subtractAmounts(amount, discountAmount);
};

/**
 * Calculate tax amount
 * @param {number} amount - Base amount
 * @param {number} taxRate - Tax rate percentage
 * @returns {number} - Tax amount
 */
export const calculateTax = (amount, taxRate) => {
  return calculatePercentage(amount, taxRate);
};

/**
 * Add tax to amount
 * @param {number} amount - Base amount (HT)
 * @param {number} taxRate - Tax rate percentage
 * @returns {number} - Amount with tax (TTC)
 */
export const addTax = (amount, taxRate) => {
  const taxAmount = calculateTax(amount, taxRate);
  return addAmounts(amount, taxAmount);
};

/**
 * Remove tax from amount
 * @param {number} amount - Amount with tax (TTC)
 * @param {number} taxRate - Tax rate percentage
 * @returns {number} - Amount without tax (HT)
 */
export const removeTax = (amount, taxRate) => {
  return Number((Number(amount) / (1 + Number(taxRate) / 100)).toFixed(DECIMAL_PLACES));
};

/**
 * Calculate total from items
 * @param {Array} items - Array of items with price and quantity
 * @returns {number} - Total amount
 */
export const calculateTotal = (items) => {
  if (!Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    const itemTotal = multiplyAmount(item.price || 0, item.quantity || 0);
    return addAmounts(total, itemTotal);
  }, 0);
};

/**
 * Calculate subtotal (before tax and discount)
 * @param {Array} items - Array of items
 * @returns {number} - Subtotal
 */
export const calculateSubtotal = (items) => {
  return calculateTotal(items);
};

/**
 * Calculate invoice total
 * @param {Array} items - Array of items
 * @param {number} discount - Discount percentage
 * @param {number} taxRate - Tax rate percentage
 * @returns {Object} - {subtotal, discountAmount, taxAmount, total}
 */
export const calculateInvoiceTotal = (items, discount = 0, taxRate = 0) => {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculatePercentage(subtotal, discount);
  const amountAfterDiscount = subtractAmounts(subtotal, discountAmount);
  const taxAmount = calculateTax(amountAfterDiscount, taxRate);
  const total = addAmounts(amountAfterDiscount, taxAmount);

  return {
    subtotal,
    discountAmount,
    taxableAmount: amountAfterDiscount,
    taxAmount,
    total,
  };
};

/**
 * Round amount to nearest value
 * @param {number} amount - Amount to round
 * @param {number} nearest - Round to nearest value (e.g., 5, 10, 50, 100)
 * @returns {number} - Rounded amount
 */
export const roundAmount = (amount, nearest = 5) => {
  return Math.round(Number(amount) / nearest) * nearest;
};

/**
 * Convert amount between currencies (basic conversion)
 * @param {number} amount - Amount to convert
 * @param {number} exchangeRate - Exchange rate
 * @returns {number} - Converted amount
 */
export const convertCurrency = (amount, exchangeRate) => {
  return multiplyAmount(amount, exchangeRate);
};

/**
 * Calculate change (money to return)
 * @param {number} total - Total amount due
 * @param {number} paid - Amount paid
 * @returns {number} - Change to return
 */
export const calculateChange = (total, paid) => {
  return Math.max(0, subtractAmounts(paid, total));
};

/**
 * Check if amount is positive
 * @param {number} amount - Amount to check
 * @returns {boolean} - True if positive
 */
export const isPositiveAmount = (amount) => {
  return Number(amount) > 0;
};

/**
 * Check if amount is zero
 * @param {number} amount - Amount to check
 * @returns {boolean} - True if zero
 */
export const isZeroAmount = (amount) => {
  return Number(amount) === 0;
};

/**
 * Compare two amounts
 * @param {number} amount1 - First amount
 * @param {number} amount2 - Second amount
 * @returns {number} - -1 if amount1 < amount2, 0 if equal, 1 if amount1 > amount2
 */
export const compareAmounts = (amount1, amount2) => {
  const a1 = Number(amount1);
  const a2 = Number(amount2);

  if (a1 < a2) return -1;
  if (a1 > a2) return 1;
  return 0;
};

/**
 * Get minimum amount from array
 * @param {Array<number>} amounts - Array of amounts
 * @returns {number} - Minimum amount
 */
export const getMinAmount = (amounts) => {
  if (!Array.isArray(amounts) || amounts.length === 0) return 0;
  return Math.min(...amounts.map(Number));
};

/**
 * Get maximum amount from array
 * @param {Array<number>} amounts - Array of amounts
 * @returns {number} - Maximum amount
 */
export const getMaxAmount = (amounts) => {
  if (!Array.isArray(amounts) || amounts.length === 0) return 0;
  return Math.max(...amounts.map(Number));
};

/**
 * Calculate average amount
 * @param {Array<number>} amounts - Array of amounts
 * @returns {number} - Average amount
 */
export const getAverageAmount = (amounts) => {
  if (!Array.isArray(amounts) || amounts.length === 0) return 0;
  const total = amounts.reduce((sum, amount) => addAmounts(sum, amount), 0);
  return divideAmount(total, amounts.length);
};

/**
 * Format amount as compact (K, M, B)
 * @param {number} amount - Amount to format
 * @returns {string} - Compact formatted amount
 */
export const formatCompactCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0 ${CURRENCY_SYMBOL}`;
  }

  const num = Number(amount);
  const abs = Math.abs(num);

  if (abs >= 1e9) {
    return `${(num / 1e9).toFixed(1)}B ${CURRENCY_SYMBOL}`;
  }
  if (abs >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M ${CURRENCY_SYMBOL}`;
  }
  if (abs >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K ${CURRENCY_SYMBOL}`;
  }

  return formatCurrency(num);
};

/**
 * Calculate profit margin percentage
 * @param {number} cost - Cost price
 * @param {number} selling - Selling price
 * @returns {number} - Profit margin percentage
 */
export const calculateProfitMargin = (cost, selling) => {
  if (cost === 0 || selling === 0) return 0;
  const profit = subtractAmounts(selling, cost);
  return Number(((profit / selling) * 100).toFixed(2));
};

/**
 * Calculate markup percentage
 * @param {number} cost - Cost price
 * @param {number} selling - Selling price
 * @returns {number} - Markup percentage
 */
export const calculateMarkup = (cost, selling) => {
  if (cost === 0) return 0;
  const profit = subtractAmounts(selling, cost);
  return Number(((profit / cost) * 100).toFixed(2));
};
