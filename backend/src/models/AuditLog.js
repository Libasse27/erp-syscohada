/**
 * Modèle AuditLog - Journal d'audit
 * Traçabilité de toutes les actions importantes dans le système
 */

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    // Action
    action: {
      type: String,
      required: [true, 'L\'action est requise'],
      enum: [
        // Authentification
        'login',
        'logout',
        'login_failed',
        'password_reset',
        'password_changed',
        // CRUD général
        'create',
        'read',
        'update',
        'delete',
        // Spécifique factures
        'invoice_created',
        'invoice_sent',
        'invoice_paid',
        'invoice_cancelled',
        // Spécifique paiements
        'payment_created',
        'payment_validated',
        'payment_cancelled',
        // Spécifique comptabilité
        'entry_posted',
        'entry_validated',
        'entry_cancelled',
        'period_closed',
        'fiscal_year_closed',
        // Stock
        'stock_in',
        'stock_out',
        'stock_transfer',
        'stock_adjustment',
        // Exports
        'export_pdf',
        'export_excel',
        'export_data',
        // Configuration
        'settings_updated',
        'user_created',
        'user_updated',
        'user_deleted',
        'permissions_changed',
        // Autres
        'other',
      ],
    },

    // Entité concernée
    entityType: {
      type: String,
      enum: [
        'User',
        'Company',
        'Product',
        'Customer',
        'Supplier',
        'Invoice',
        'Payment',
        'Account',
        'AccountingEntry',
        'StockMovement',
        'Other',
      ],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    entityName: {
      type: String,
      trim: true,
    },

    // Détails de l'action
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },

    // Données avant/après (pour les modifications)
    oldValues: {
      type: mongoose.Schema.Types.Mixed,
    },
    newValues: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Niveau de criticité
    level: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical'],
      default: 'info',
    },

    // Résultat
    status: {
      type: String,
      enum: ['success', 'failure', 'pending'],
      default: 'success',
    },
    errorMessage: {
      type: String,
      trim: true,
    },

    // Informations de contexte
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },

    // Métadonnées additionnelles
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Utilisateur et entreprise
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },

    // Timestamp (automatique via createdAt)
  },
  {
    timestamps: true,
  }
);

// Index pour les recherches fréquentes
auditLogSchema.index({ company: 1, createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ level: 1 });
auditLogSchema.index({ status: 1 });

// TTL index : Supprimer automatiquement les logs après 2 ans
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 63072000 }); // 2 ans

// Méthode statique : Logger une action
auditLogSchema.statics.log = async function (data) {
  try {
    const log = new this({
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      entityName: data.entityName,
      description: data.description,
      oldValues: data.oldValues,
      newValues: data.newValues,
      level: data.level || 'info',
      status: data.status || 'success',
      errorMessage: data.errorMessage,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      location: data.location,
      metadata: data.metadata,
      user: data.userId,
      userName: data.userName,
      company: data.companyId,
    });

    await log.save();
    return log;
  } catch (error) {
    console.error('Erreur lors de la création du log d\'audit:', error);
    // Ne pas bloquer l'opération si le logging échoue
    return null;
  }
};

// Méthode statique : Obtenir les logs d'un utilisateur
auditLogSchema.statics.findByUser = function (userId, limit = 50) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Méthode statique : Obtenir les logs d'une entité
auditLogSchema.statics.findByEntity = function (entityType, entityId) {
  return this.find({ entityType, entityId }).sort({ createdAt: -1 });
};

// Méthode statique : Obtenir les logs par période
auditLogSchema.statics.findByPeriod = function (companyId, startDate, endDate, filters = {}) {
  const query = {
    company: companyId,
    createdAt: { $gte: startDate, $lte: endDate },
    ...filters,
  };

  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('user', 'firstName lastName email');
};

// Méthode statique : Obtenir les activités critiques
auditLogSchema.statics.findCritical = function (companyId, limit = 100) {
  return this.find({
    company: companyId,
    level: { $in: ['error', 'critical'] },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName email');
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
