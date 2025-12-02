// Constants for the application

// API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 10000; // 10 seconds

// Authentication
export const TOKEN_KEY = 'authToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_KEY = 'currentUser';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Currency
export const DEFAULT_CURRENCY = 'XOF'; // West African CFA franc
export const CURRENCY_SYMBOL = 'FCFA';
export const DECIMAL_PLACES = 2;

// Date & Time
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const TIME_FORMAT = 'HH:mm';
export const API_DATE_FORMAT = 'YYYY-MM-DD'; // ISO format for API

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(77|78|70|76|75)\d{7}$/, // Senegal phone numbers
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 30,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  SIRET_LENGTH: 14,
  TAX_ID_REGEX: /^[A-Z0-9]{1,20}$/, // Example for a generic tax ID
};

// UI & Theming
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};
export const DEFAULT_THEME_MODE = THEME_MODES.LIGHT;

// Notifications
export const NOTIFICATION_DURATION = 5000; // 5 seconds

// Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
  SALES: 'sales',
  WAREHOUSE: 'warehouse',
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrateur',
  [USER_ROLES.MANAGER]: 'Gestionnaire',
  [USER_ROLES.ACCOUNTANT]: 'Comptable',
  [USER_ROLES.SALES]: 'Commercial',
  [USER_ROLES.WAREHOUSE]: 'Magasinier',
};

// Invoice Status
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  VALIDATED: 'validated',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
};

export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.DRAFT]: 'Brouillon',
  [INVOICE_STATUS.PENDING]: 'En attente',
  [INVOICE_STATUS.VALIDATED]: 'Validée',
  [INVOICE_STATUS.PAID]: 'Payée',
  [INVOICE_STATUS.OVERDUE]: 'En retard',
  [INVOICE_STATUS.CANCELLED]: 'Annulée',
};

export const INVOICE_STATUS_COLORS = {
  [INVOICE_STATUS.DRAFT]: 'default',
  [INVOICE_STATUS.PENDING]: 'warning',
  [INVOICE_STATUS.VALIDATED]: 'info',
  [INVOICE_STATUS.PAID]: 'success',
  [INVOICE_STATUS.OVERDUE]: 'danger',
  [INVOICE_STATUS.CANCELLED]: 'danger',
};

// Invoice Types
export const INVOICE_TYPES = {
  SALE: 'sale',
  PURCHASE: 'purchase',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CHECK: 'check',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  MOBILE_MONEY: 'mobile_money',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Espèces',
  [PAYMENT_METHODS.CHECK]: 'Chèque',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Virement bancaire',
  [PAYMENT_METHODS.CREDIT_CARD]: 'Carte bancaire',
  [PAYMENT_METHODS.MOBILE_MONEY]: 'Mobile Money',
};

// Mobile Money Providers
export const MOBILE_MONEY_PROVIDERS = {
  ORANGE_MONEY: 'orange_money',
  WAVE: 'wave',
  FREE_MONEY: 'free_money',
};

export const MOBILE_MONEY_PROVIDER_LABELS = {
  [MOBILE_MONEY_PROVIDERS.ORANGE_MONEY]: 'Orange Money',
  [MOBILE_MONEY_PROVIDERS.WAVE]: 'Wave',
  [MOBILE_MONEY_PROVIDERS.FREE_MONEY]: 'Free Money',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'En attente',
  [PAYMENT_STATUS.COMPLETED]: 'Complété',
  [PAYMENT_STATUS.FAILED]: 'Échoué',
  [PAYMENT_STATUS.CANCELLED]: 'Annulé',
};

// Stock Movement Types
export const STOCK_MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment',
};

export const STOCK_MOVEMENT_TYPE_LABELS = {
  [STOCK_MOVEMENT_TYPES.IN]: 'Entrée',
  [STOCK_MOVEMENT_TYPES.OUT]: 'Sortie',
  [STOCK_MOVEMENT_TYPES.TRANSFER]: 'Transfert',
  [STOCK_MOVEMENT_TYPES.ADJUSTMENT]: 'Ajustement',
};

// Purchase Order Status
export const PURCHASE_ORDER_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  CONFIRMED: 'confirmed',
  RECEIVED: 'received',
  CANCELLED: 'cancelled',
};

export const PURCHASE_ORDER_STATUS_LABELS = {
  [PURCHASE_ORDER_STATUS.DRAFT]: 'Brouillon',
  [PURCHASE_ORDER_STATUS.SENT]: 'Envoyée',
  [PURCHASE_ORDER_STATUS.CONFIRMED]: 'Confirmée',
  [PURCHASE_ORDER_STATUS.RECEIVED]: 'Reçue',
  [PURCHASE_ORDER_STATUS.CANCELLED]: 'Annulée',
};

// SYSCOHADA Account Types
export const ACCOUNT_TYPES = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  EQUITY: 'equity',
  REVENUE: 'revenue',
  EXPENSE: 'expense',
};

export const ACCOUNT_TYPE_LABELS = {
  [ACCOUNT_TYPES.ASSET]: 'Actif',
  [ACCOUNT_TYPES.LIABILITY]: 'Passif',
  [ACCOUNT_TYPES.EQUITY]: 'Capitaux propres',
  [ACCOUNT_TYPES.REVENUE]: 'Produit',
  [ACCOUNT_TYPES.EXPENSE]: 'Charge',
};

// SYSCOHADA Account Classes
export const SYSCOHADA_CLASSES = {
  1: 'Comptes de ressources durables',
  2: 'Comptes d\'actif immobilisé',
  3: 'Comptes de stocks',
  4: 'Comptes de tiers',
  5: 'Comptes de trésorerie',
  6: 'Comptes de charges',
  7: 'Comptes de produits',
  8: 'Comptes des autres charges et produits',
};

// Report Types
export const REPORT_TYPES = {
  SALES: 'sales',
  PURCHASES: 'purchases',
  CASH_FLOW: 'cash_flow',
  BALANCE_SHEET: 'balance_sheet',
  INCOME_STATEMENT: 'income_statement',
  LEDGER: 'ledger',
  JOURNAL: 'journal',
};

// Chart Colors
export const CHART_COLORS = {
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
};

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent_searches',
};

// Toaster/Notification Duration
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
}