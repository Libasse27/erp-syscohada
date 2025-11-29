/**
 * Constantes de l'application Frontend
 */

// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  SALES: 'sales',
  USER: 'user',
};

// Statuts de facture
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
};

// Labels de statut de facture
export const INVOICE_STATUS_LABELS = {
  draft: 'Brouillon',
  sent: 'Envoyée',
  paid: 'Payée',
  overdue: 'En retard',
  cancelled: 'Annulée',
};

// Couleurs de statut de facture (Bootstrap)
export const INVOICE_STATUS_COLORS = {
  draft: 'secondary',
  sent: 'info',
  paid: 'success',
  overdue: 'danger',
  cancelled: 'dark',
};

// Types de facture
export const INVOICE_TYPES = {
  QUOTE: 'quote',
  INVOICE: 'invoice',
  CREDIT_NOTE: 'credit_note',
};

// Labels de type de facture
export const INVOICE_TYPE_LABELS = {
  quote: 'Devis',
  invoice: 'Facture',
  credit_note: 'Avoir',
};

// Statuts de paiement
export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid',
};

// Labels de statut de paiement
export const PAYMENT_STATUS_LABELS = {
  unpaid: 'Non payé',
  partial: 'Partiellement payé',
  paid: 'Payé',
};

// Méthodes de paiement
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CHECK: 'check',
  TRANSFER: 'transfer',
  MOBILE_MONEY: 'mobile_money',
  CARD: 'card',
};

// Labels de méthode de paiement
export const PAYMENT_METHOD_LABELS = {
  cash: 'Espèces',
  check: 'Chèque',
  transfer: 'Virement',
  mobile_money: 'Mobile Money',
  card: 'Carte bancaire',
};

// Fournisseurs Mobile Money
export const MOBILE_MONEY_PROVIDERS = {
  ORANGE_MONEY: 'orange_money',
  WAVE: 'wave',
  FREE_MONEY: 'free_money',
};

// Labels Mobile Money
export const MOBILE_MONEY_PROVIDER_LABELS = {
  orange_money: 'Orange Money',
  wave: 'Wave',
  free_money: 'Free Money',
};

// Types de compte SYSCOHADA
export const ACCOUNT_TYPES = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  EQUITY: 'equity',
  REVENUE: 'revenue',
  EXPENSE: 'expense',
};

// Labels de type de compte
export const ACCOUNT_TYPE_LABELS = {
  asset: 'Actif',
  liability: 'Passif',
  equity: 'Capitaux propres',
  revenue: 'Produits',
  expense: 'Charges',
};

// Journaux comptables
export const ACCOUNTING_JOURNALS = {
  SALES: 'sales',
  PURCHASES: 'purchases',
  BANK: 'bank',
  CASH: 'cash',
  MISC: 'misc',
};

// Labels de journaux
export const ACCOUNTING_JOURNAL_LABELS = {
  sales: 'Ventes',
  purchases: 'Achats',
  bank: 'Banque',
  cash: 'Caisse',
  misc: 'Opérations diverses',
};

// Devises
export const CURRENCIES = {
  XOF: 'XOF',
  EUR: 'EUR',
  USD: 'USD',
};

// Symboles de devises
export const CURRENCY_SYMBOLS = {
  XOF: 'FCFA',
  EUR: '€',
  USD: '$',
};

// Taux de TVA
export const VAT_RATES = [
  { value: 0, label: '0% (Exonéré)' },
  { value: 18, label: '18% (Standard)' },
];

// Unités de mesure
export const UNITS = [
  'pièce',
  'kg',
  'litre',
  'mètre',
  'carton',
  'pack',
  'boîte',
  'palette',
];

// Pagination
export const ITEMS_PER_PAGE = parseInt(process.env.REACT_APP_ITEMS_PER_PAGE) || 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Délai de debounce (ms)
export const DEBOUNCE_DELAY = parseInt(process.env.REACT_APP_DEBOUNCE_DELAY) || 300;

// Taille maximale des fichiers (octets)
export const MAX_FILE_SIZE = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 5242880; // 5MB

// Formats d'image acceptés
export const ACCEPTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

// Routes de navigation
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',

  // Produits
  PRODUCTS: '/products',
  PRODUCT_CREATE: '/products/create',
  PRODUCT_DETAIL: '/products/:id',

  // Clients
  CUSTOMERS: '/customers',
  CUSTOMER_CREATE: '/customers/create',
  CUSTOMER_DETAIL: '/customers/:id',

  // Fournisseurs
  SUPPLIERS: '/suppliers',
  SUPPLIER_CREATE: '/suppliers/create',
  SUPPLIER_DETAIL: '/suppliers/:id',

  // Factures
  INVOICES: '/invoices',
  INVOICE_CREATE: '/invoices/create',
  INVOICE_DETAIL: '/invoices/:id',

  // Achats
  PURCHASES: '/purchases',
  PURCHASE_CREATE: '/purchases/create',
  PURCHASE_DETAIL: '/purchases/:id',

  // Stocks
  STOCK: '/stock',
  STOCK_MOVEMENTS: '/stock/movements',

  // Comptabilité
  ACCOUNTS: '/accounting/accounts',
  ACCOUNTING_ENTRIES: '/accounting/entries',
  GENERAL_LEDGER: '/accounting/general-ledger',
  TRIAL_BALANCE: '/accounting/trial-balance',

  // Trésorerie
  PAYMENTS: '/treasury/payments',
  BANK_ACCOUNTS: '/treasury/bank-accounts',
  CASH_FLOW: '/treasury/cash-flow',

  // Rapports
  REPORTS: '/reports',
  BALANCE_SHEET: '/reports/balance-sheet',
  INCOME_STATEMENT: '/reports/income-statement',

  // Paramètres
  SETTINGS: '/settings',
};
