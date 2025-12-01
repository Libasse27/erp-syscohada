/**
 * Middleware d'audit
 * Enregistrement des actions utilisateurs pour la traçabilité et conformité
 */

import logger from '../utils/logger.js';

/**
 * Types d'actions auditables
 */
export const AUDIT_ACTIONS = {
  // Authentification
  LOGIN: 'auth.login',
  LOGOUT: 'auth.logout',
  REGISTER: 'auth.register',
  PASSWORD_CHANGE: 'auth.password_change',
  PASSWORD_RESET: 'auth.password_reset',

  // CRUD générique
  CREATE: 'resource.create',
  READ: 'resource.read',
  UPDATE: 'resource.update',
  DELETE: 'resource.delete',

  // Utilisateurs
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_ROLE_CHANGE: 'user.role_change',
  USER_ACTIVATE: 'user.activate',
  USER_DEACTIVATE: 'user.deactivate',

  // Produits
  PRODUCT_CREATE: 'product.create',
  PRODUCT_UPDATE: 'product.update',
  PRODUCT_DELETE: 'product.delete',

  // Stock
  STOCK_ADJUST: 'stock.adjust',
  STOCK_TRANSFER: 'stock.transfer',
  STOCK_IN: 'stock.in',
  STOCK_OUT: 'stock.out',

  // Ventes
  SALE_CREATE: 'sale.create',
  SALE_UPDATE: 'sale.update',
  SALE_DELETE: 'sale.delete',
  SALE_VALIDATE: 'sale.validate',
  SALE_CANCEL: 'sale.cancel',

  // Factures
  INVOICE_CREATE: 'invoice.create',
  INVOICE_UPDATE: 'invoice.update',
  INVOICE_DELETE: 'invoice.delete',
  INVOICE_SEND: 'invoice.send',
  INVOICE_PAY: 'invoice.pay',

  // Paiements
  PAYMENT_CREATE: 'payment.create',
  PAYMENT_VALIDATE: 'payment.validate',
  PAYMENT_REFUND: 'payment.refund',
  PAYMENT_CANCEL: 'payment.cancel',

  // Comptabilité
  ACCOUNTING_ENTRY_CREATE: 'accounting.entry_create',
  ACCOUNTING_ENTRY_UPDATE: 'accounting.entry_update',
  ACCOUNTING_ENTRY_DELETE: 'accounting.entry_delete',
  ACCOUNTING_ENTRY_VALIDATE: 'accounting.entry_validate',
  ACCOUNTING_PERIOD_CLOSE: 'accounting.period_close',

  // Exports
  EXPORT_DATA: 'export.data',
  EXPORT_REPORT: 'export.report',

  // Paramètres
  SETTINGS_UPDATE: 'settings.update',
  SETTINGS_SYSTEM_UPDATE: 'settings.system_update',

  // Sécurité
  PERMISSION_CHANGE: 'security.permission_change',
  ACCESS_DENIED: 'security.access_denied',
  SUSPICIOUS_ACTIVITY: 'security.suspicious_activity',
};

/**
 * Niveaux de criticité des événements
 */
export const AUDIT_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
};

/**
 * Modèle d'audit (à créer plus tard en base de données)
 * Pour l'instant, on log dans les fichiers
 */
class AuditLog {
  constructor(data) {
    this.timestamp = new Date();
    this.action = data.action;
    this.level = data.level || AUDIT_LEVELS.INFO;
    this.userId = data.userId;
    this.userEmail = data.userEmail;
    this.userRole = data.userRole;
    this.resourceType = data.resourceType;
    this.resourceId = data.resourceId;
    this.details = data.details;
    this.ipAddress = data.ipAddress;
    this.userAgent = data.userAgent;
    this.statusCode = data.statusCode;
    this.success = data.success;
    this.errorMessage = data.errorMessage;
  }

  /**
   * Enregistrer l'audit log
   */
  async save() {
    // Pour l'instant, on log dans les fichiers
    // Plus tard, on sauvegarde en base de données
    const logData = {
      timestamp: this.timestamp.toISOString(),
      action: this.action,
      level: this.level,
      user: {
        id: this.userId,
        email: this.userEmail,
        role: this.userRole,
      },
      resource: {
        type: this.resourceType,
        id: this.resourceId,
      },
      details: this.details,
      request: {
        ip: this.ipAddress,
        userAgent: this.userAgent,
      },
      statusCode: this.statusCode,
      success: this.success,
      error: this.errorMessage,
    };

    // Logger selon le niveau
    switch (this.level) {
      case AUDIT_LEVELS.CRITICAL:
      case AUDIT_LEVELS.ERROR:
        logger.error('AUDIT', logData);
        break;
      case AUDIT_LEVELS.WARNING:
        logger.warn('AUDIT', logData);
        break;
      default:
        logger.info('AUDIT', logData);
    }

    // TODO: Sauvegarder en base de données MongoDB
    // await AuditModel.create(logData);

    return this;
  }
}

/**
 * Créer un audit log
 * @param {object} data - Données de l'audit
 * @returns {Promise<AuditLog>}
 */
export const createAuditLog = async (data) => {
  const auditLog = new AuditLog(data);
  return await auditLog.save();
};

/**
 * Middleware : Auditer toutes les requêtes
 * @returns {function} Middleware Express
 */
export const auditRequest = () => {
  return async (req, res, next) => {
    // Capturer les informations de la requête
    const startTime = Date.now();

    // Intercepter la réponse
    const originalSend = res.send;
    res.send = function (data) {
      res.send = originalSend;

      // Créer l'audit log après la réponse
      const duration = Date.now() - startTime;
      const success = res.statusCode < 400;

      // Ne pas auditer les requêtes GET (lecture simple) sauf erreurs
      if (req.method === 'GET' && success) {
        return res.send(data);
      }

      // Déterminer l'action basée sur la méthode et la route
      let action = AUDIT_ACTIONS.READ;
      if (req.method === 'POST') action = AUDIT_ACTIONS.CREATE;
      if (req.method === 'PUT' || req.method === 'PATCH') action = AUDIT_ACTIONS.UPDATE;
      if (req.method === 'DELETE') action = AUDIT_ACTIONS.DELETE;

      // Créer l'audit log de manière asynchrone (ne pas bloquer la réponse)
      setImmediate(async () => {
        try {
          await createAuditLog({
            action,
            level: success ? AUDIT_LEVELS.INFO : AUDIT_LEVELS.WARNING,
            userId: req.user?.id,
            userEmail: req.user?.email,
            userRole: req.user?.role,
            resourceType: req.baseUrl.split('/')[2], // Ex: /api/products -> products
            resourceId: req.params.id,
            details: {
              method: req.method,
              path: req.originalUrl,
              duration,
              body: sanitizeBody(req.body),
            },
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            statusCode: res.statusCode,
            success,
            errorMessage: success ? null : extractErrorMessage(data),
          });
        } catch (error) {
          logger.error('Erreur lors de la création de l\'audit log:', error);
        }
      });

      return res.send(data);
    };

    next();
  };
};

/**
 * Middleware : Auditer une action spécifique
 * @param {string} action - Type d'action
 * @param {object} options - Options supplémentaires
 * @returns {function} Middleware Express
 */
export const auditAction = (action, options = {}) => {
  return async (req, res, next) => {
    // Capturer les informations de la requête
    const startTime = Date.now();

    // Intercepter la réponse
    const originalSend = res.send;
    res.send = function (data) {
      res.send = originalSend;

      const duration = Date.now() - startTime;
      const success = res.statusCode < 400;

      // Déterminer le niveau de criticité
      let level = AUDIT_LEVELS.INFO;
      if (options.critical) level = AUDIT_LEVELS.CRITICAL;
      else if (!success) level = AUDIT_LEVELS.WARNING;

      // Créer l'audit log de manière asynchrone
      setImmediate(async () => {
        try {
          await createAuditLog({
            action,
            level,
            userId: req.user?.id,
            userEmail: req.user?.email,
            userRole: req.user?.role,
            resourceType: options.resourceType || req.baseUrl.split('/')[2],
            resourceId: options.resourceId || req.params.id || req.body.id,
            details: {
              method: req.method,
              path: req.originalUrl,
              duration,
              customDetails: options.details,
              body: sanitizeBody(req.body),
            },
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            statusCode: res.statusCode,
            success,
            errorMessage: success ? null : extractErrorMessage(data),
          });
        } catch (error) {
          logger.error('Erreur lors de la création de l\'audit log:', error);
        }
      });

      return res.send(data);
    };

    next();
  };
};

/**
 * Auditer un événement manuellement (en dehors d'une requête HTTP)
 * @param {string} action - Type d'action
 * @param {object} data - Données de l'audit
 */
export const auditEvent = async (action, data = {}) => {
  try {
    await createAuditLog({
      action,
      level: data.level || AUDIT_LEVELS.INFO,
      userId: data.userId,
      userEmail: data.userEmail,
      userRole: data.userRole,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      details: data.details,
      success: data.success !== false,
      errorMessage: data.errorMessage,
    });
  } catch (error) {
    logger.error('Erreur lors de l\'audit d\'événement:', error);
  }
};

/**
 * Sanitize le body pour ne pas logger les informations sensibles
 * @param {object} body - Corps de la requête
 * @returns {object} Body sanitizé
 */
const sanitizeBody = (body) => {
  if (!body) return null;

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'confirmPassword', 'token', 'refreshToken', 'apiKey', 'secret'];

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};

/**
 * Extraire le message d'erreur de la réponse
 * @param {string|object} data - Données de la réponse
 * @returns {string|null}
 */
const extractErrorMessage = (data) => {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    return parsed.error || parsed.message || null;
  } catch {
    return null;
  }
};

export default {
  AUDIT_ACTIONS,
  AUDIT_LEVELS,
  createAuditLog,
  auditRequest,
  auditAction,
  auditEvent,
};
