/**
 * Middleware de gestion des permissions
 * Contrôle d'accès basé sur les rôles et permissions granulaires
 */

import { AppError } from './errorMiddleware.js';
import logger from '../utils/logger.js';

/**
 * Définition des permissions du système
 */
export const PERMISSIONS = {
  // Gestion des utilisateurs
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_MANAGE_ROLES: 'users:manage_roles',

  // Gestion des produits
  PRODUCTS_VIEW: 'products:view',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',
  PRODUCTS_MANAGE_STOCK: 'products:manage_stock',

  // Gestion des clients
  CUSTOMERS_VIEW: 'customers:view',
  CUSTOMERS_CREATE: 'customers:create',
  CUSTOMERS_UPDATE: 'customers:update',
  CUSTOMERS_DELETE: 'customers:delete',

  // Gestion des fournisseurs
  SUPPLIERS_VIEW: 'suppliers:view',
  SUPPLIERS_CREATE: 'suppliers:create',
  SUPPLIERS_UPDATE: 'suppliers:update',
  SUPPLIERS_DELETE: 'suppliers:delete',

  // Gestion des ventes/factures
  SALES_VIEW: 'sales:view',
  SALES_CREATE: 'sales:create',
  SALES_UPDATE: 'sales:update',
  SALES_DELETE: 'sales:delete',
  SALES_VALIDATE: 'sales:validate',

  // Gestion des achats
  PURCHASES_VIEW: 'purchases:view',
  PURCHASES_CREATE: 'purchases:create',
  PURCHASES_UPDATE: 'purchases:update',
  PURCHASES_DELETE: 'purchases:delete',
  PURCHASES_VALIDATE: 'purchases:validate',

  // Gestion du stock
  STOCK_VIEW: 'stock:view',
  STOCK_UPDATE: 'stock:update',
  STOCK_TRANSFER: 'stock:transfer',
  STOCK_ADJUST: 'stock:adjust',

  // Comptabilité
  ACCOUNTING_VIEW: 'accounting:view',
  ACCOUNTING_CREATE: 'accounting:create',
  ACCOUNTING_UPDATE: 'accounting:update',
  ACCOUNTING_DELETE: 'accounting:delete',
  ACCOUNTING_VALIDATE: 'accounting:validate',
  ACCOUNTING_CLOSE_PERIOD: 'accounting:close_period',

  // Paiements
  PAYMENTS_VIEW: 'payments:view',
  PAYMENTS_CREATE: 'payments:create',
  PAYMENTS_VALIDATE: 'payments:validate',
  PAYMENTS_REFUND: 'payments:refund',

  // Rapports et statistiques
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',
  REPORTS_FINANCIAL: 'reports:financial',

  // Paramètres système
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update',
  SETTINGS_SYSTEM: 'settings:system',

  // Audit et logs
  AUDIT_VIEW: 'audit:view',
  AUDIT_EXPORT: 'audit:export',
};

/**
 * Permissions par défaut pour chaque rôle
 */
export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS), // Toutes les permissions

  accountant: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.SUPPLIERS_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.SALES_UPDATE,
    PERMISSIONS.PURCHASES_VIEW,
    PERMISSIONS.PURCHASES_CREATE,
    PERMISSIONS.PURCHASES_UPDATE,
    PERMISSIONS.STOCK_VIEW,
    PERMISSIONS.ACCOUNTING_VIEW,
    PERMISSIONS.ACCOUNTING_CREATE,
    PERMISSIONS.ACCOUNTING_UPDATE,
    PERMISSIONS.ACCOUNTING_VALIDATE,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.PAYMENTS_VALIDATE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.REPORTS_FINANCIAL,
  ],

  sales: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_UPDATE,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_CREATE,
    PERMISSIONS.SALES_UPDATE,
    PERMISSIONS.STOCK_VIEW,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.REPORTS_VIEW,
  ],

  user: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.STOCK_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],
};

/**
 * Vérifier si un utilisateur a une permission spécifique
 * @param {object} user - Objet utilisateur
 * @param {string} permission - Permission à vérifier
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;

  // Les admins ont toutes les permissions
  if (user.role === 'admin') return true;

  // Vérifier les permissions personnalisées de l'utilisateur
  if (user.permissions && user.permissions.includes(permission)) {
    return true;
  }

  // Vérifier les permissions par défaut du rôle
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return rolePermissions.includes(permission);
};

/**
 * Vérifier si un utilisateur a toutes les permissions requises
 * @param {object} user - Objet utilisateur
 * @param {string[]} permissions - Liste de permissions requises
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions) => {
  return permissions.every((permission) => hasPermission(user, permission));
};

/**
 * Vérifier si un utilisateur a au moins une des permissions requises
 * @param {object} user - Objet utilisateur
 * @param {string[]} permissions - Liste de permissions
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  return permissions.some((permission) => hasPermission(user, permission));
};

/**
 * Middleware : Vérifier une permission spécifique
 * @param {string} permission - Permission requise
 * @returns {function} Middleware Express
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Utilisateur non authentifié', 401));
    }

    if (!hasPermission(req.user, permission)) {
      logger.warn(
        `Permission refusée: ${permission} pour utilisateur ${req.user.email} (rôle: ${req.user.role})`
      );
      return next(
        new AppError('Vous n\'avez pas la permission d\'effectuer cette action', 403)
      );
    }

    next();
  };
};

/**
 * Middleware : Vérifier plusieurs permissions (toutes requises)
 * @param {string[]} permissions - Liste de permissions requises
 * @returns {function} Middleware Express
 */
export const requireAllPermissions = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Utilisateur non authentifié', 401));
    }

    if (!hasAllPermissions(req.user, permissions)) {
      logger.warn(
        `Permissions insuffisantes pour utilisateur ${req.user.email}. Requis: ${permissions.join(', ')}`
      );
      return next(
        new AppError('Vous n\'avez pas toutes les permissions nécessaires', 403)
      );
    }

    next();
  };
};

/**
 * Middleware : Vérifier plusieurs permissions (au moins une requise)
 * @param {string[]} permissions - Liste de permissions
 * @returns {function} Middleware Express
 */
export const requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Utilisateur non authentifié', 401));
    }

    if (!hasAnyPermission(req.user, permissions)) {
      logger.warn(
        `Aucune permission valide pour utilisateur ${req.user.email}. Requis (au moins une): ${permissions.join(', ')}`
      );
      return next(
        new AppError('Vous n\'avez pas les permissions nécessaires', 403)
      );
    }

    next();
  };
};

/**
 * Middleware : Vérifier que l'utilisateur est propriétaire de la ressource
 * @param {string} resourceUserField - Champ contenant l'ID utilisateur dans la ressource
 * @returns {function} Middleware Express
 */
export const requireOwnership = (resourceUserField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Utilisateur non authentifié', 401));
    }

    // Les admins peuvent accéder à toutes les ressources
    if (req.user.role === 'admin') {
      return next();
    }

    const resourceUserId = req.resource?.[resourceUserField]?.toString();
    const currentUserId = req.user.id.toString();

    if (resourceUserId !== currentUserId) {
      logger.warn(
        `Accès refusé: utilisateur ${req.user.email} tente d'accéder à une ressource d'un autre utilisateur`
      );
      return next(
        new AppError('Vous ne pouvez accéder qu\'à vos propres ressources', 403)
      );
    }

    next();
  };
};

/**
 * Middleware : Vérifier que l'utilisateur appartient à la même entreprise
 * @returns {function} Middleware Express
 */
export const requireSameCompany = () => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Utilisateur non authentifié', 401));
    }

    // Les admins peuvent accéder à toutes les entreprises
    if (req.user.role === 'admin') {
      return next();
    }

    const resourceCompanyId = req.resource?.company?.toString();
    const userCompanyId = req.user.company?.toString();

    if (!userCompanyId) {
      return next(new AppError('Utilisateur non associé à une entreprise', 403));
    }

    if (resourceCompanyId !== userCompanyId) {
      logger.warn(
        `Accès refusé: utilisateur ${req.user.email} tente d'accéder à une ressource d'une autre entreprise`
      );
      return next(
        new AppError('Accès refusé: ressource d\'une autre entreprise', 403)
      );
    }

    next();
  };
};

/**
 * Middleware : Désactiver certaines actions en mode démo
 * @returns {function} Middleware Express
 */
export const preventDemoActions = () => {
  return (req, res, next) => {
    if (process.env.DEMO_MODE === 'true') {
      const destructiveMethods = ['DELETE', 'PUT', 'PATCH'];

      if (destructiveMethods.includes(req.method)) {
        return next(
          new AppError(
            'Action désactivée en mode démo. Les modifications ne sont pas autorisées.',
            403
          )
        );
      }
    }

    next();
  };
};

export default {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  requirePermission,
  requireAllPermissions,
  requireAnyPermission,
  requireOwnership,
  requireSameCompany,
  preventDemoActions,
};
