/**
 * Modèle Journal - Journaux comptables
 * Journaux pour organiser les écritures comptables
 */

import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
  {
    // Informations de base
    code: {
      type: String,
      required: [true, 'Le code du journal est requis'],
      trim: true,
      uppercase: true,
      maxlength: [10, 'Le code ne peut pas dépasser 10 caractères'],
    },
    name: {
      type: String,
      required: [true, 'Le nom du journal est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },

    // Type de journal
    type: {
      type: String,
      enum: ['sales', 'purchases', 'cash', 'bank', 'operations', 'miscellaneous'],
      required: [true, 'Le type de journal est requis'],
    },

    // Comptes par défaut
    defaultDebitAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    defaultCreditAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },

    // Numérotation des écritures
    prefix: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'ECR',
    },
    currentNumber: {
      type: Number,
      default: 0,
      min: [0, 'Le numéro ne peut pas être négatif'],
    },

    // Devise
    currency: {
      type: String,
      enum: ['XOF', 'EUR', 'USD', 'XAF'],
      default: 'XOF',
    },

    // Entreprise
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'L\'entreprise est requise'],
    },

    // Statut
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index
journalSchema.index({ company: 1, code: 1 }, { unique: true });
journalSchema.index({ type: 1 });
journalSchema.index({ isActive: 1 });
journalSchema.index({ isDefault: 1 });

// Méthode : Générer le prochain numéro d'écriture
journalSchema.methods.getNextEntryNumber = async function () {
  this.currentNumber += 1;
  await this.save();

  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const sequence = String(this.currentNumber).padStart(5, '0');

  return `${this.prefix}-${year}-${month}-${sequence}`;
};

// Méthode statique : Obtenir le journal par défaut pour un type
journalSchema.statics.findDefaultByType = function (companyId, type) {
  return this.findOne({
    company: companyId,
    type: type,
    isDefault: true,
    isActive: true,
  });
};

const Journal = mongoose.model('Journal', journalSchema);

export default Journal;
