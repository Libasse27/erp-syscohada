/**
 * Constantes de l'application
 */

// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  SALES: 'sales',
  USER: 'user'
};

// Permissions
export const PERMISSIONS = {
  // Produits
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  // Clients
  CUSTOMER_CREATE: 'customer:create',
  CUSTOMER_READ: 'customer:read',
  CUSTOMER_UPDATE: 'customer:update',
  CUSTOMER_DELETE: 'customer:delete',

  // Factures
  INVOICE_CREATE: 'invoice:create',
  INVOICE_READ: 'invoice:read',
  INVOICE_UPDATE: 'invoice:update',
  INVOICE_DELETE: 'invoice:delete',
  INVOICE_VALIDATE: 'invoice:validate',

  // Comptabilité
  ACCOUNTING_CREATE: 'accounting:create',
  ACCOUNTING_READ: 'accounting:read',
  ACCOUNTING_UPDATE: 'accounting:update',
  ACCOUNTING_DELETE: 'accounting:delete',
  ACCOUNTING_VALIDATE: 'accounting:validate',

  // Trésorerie
  PAYMENT_CREATE: 'payment:create',
  PAYMENT_READ: 'payment:read',
  PAYMENT_UPDATE: 'payment:update',
  PAYMENT_DELETE: 'payment:delete',

  // Rapports
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export',

  // Administration
  USER_MANAGE: 'user:manage',
  SETTINGS_MANAGE: 'settings:manage'
};

// Statuts de facture
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

// Types de facture
export const INVOICE_TYPES = {
  QUOTE: 'quote',
  INVOICE: 'invoice',
  CREDIT_NOTE: 'credit_note'
};

// Statuts de paiement
export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid'
};

// Méthodes de paiement
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CHECK: 'check',
  TRANSFER: 'transfer',
  MOBILE_MONEY: 'mobile_money',
  CARD: 'card'
};

// Fournisseurs Mobile Money
export const MOBILE_MONEY_PROVIDERS = {
  ORANGE_MONEY: 'orange_money',
  WAVE: 'wave',
  FREE_MONEY: 'free_money'
};

// Types de mouvement de stock
export const STOCK_MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out',
  ADJUSTMENT: 'adjustment',
  TRANSFER: 'transfer'
};

// Journaux comptables
export const ACCOUNTING_JOURNALS = {
  SALES: 'sales',
  PURCHASES: 'purchases',
  BANK: 'bank',
  CASH: 'cash',
  MISC: 'misc'
};

// Statuts d'écriture comptable
export const ACCOUNTING_ENTRY_STATUS = {
  DRAFT: 'draft',
  POSTED: 'posted',
  VALIDATED: 'validated'
};

// Types de compte SYSCOHADA
export const ACCOUNT_TYPES = {
  ASSET: 'asset',           // Actif
  LIABILITY: 'liability',   // Passif
  EQUITY: 'equity',         // Capitaux propres
  REVENUE: 'revenue',       // Produits
  EXPENSE: 'expense'        // Charges
};

// Taux de TVA (Sénégal)
export const VAT_RATES = {
  STANDARD: 18,  // Taux normal
  REDUCED: 0,    // Exonéré
};

// Devises
export const CURRENCIES = {
  XOF: 'XOF',  // Franc CFA
  EUR: 'EUR',  // Euro
  USD: 'USD'   // Dollar
};

// Unités de mesure
export const UNITS = {
  PIECE: 'pièce',
  KG: 'kg',
  LITER: 'litre',
  METER: 'mètre',
  BOX: 'carton',
  PACK: 'pack'
};

// Messages d'erreur courants
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Non autorisé. Veuillez vous connecter.',
  FORBIDDEN: 'Accès interdit. Permissions insuffisantes.',
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION_ERROR: 'Erreur de validation des données.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer.',
  DUPLICATE_ENTRY: 'Cette entrée existe déjà.',
  INVALID_CREDENTIALS: 'Identifiants invalides.'
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  CREATED: 'Créé avec succès',
  UPDATED: 'Mis à jour avec succès',
  DELETED: 'Supprimé avec succès',
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie'
};
