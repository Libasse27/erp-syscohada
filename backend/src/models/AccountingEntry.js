/**
 * Modèle AccountingEntry - Écritures comptables
 * Gestion des écritures comptables avec lignes (partie double)
 */

import mongoose from 'mongoose';

const entryLineSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Le compte est requis'],
  },
  label: {
    type: String,
    required: [true, 'Le libellé est requis'],
    trim: true,
    maxlength: [200, 'Le libellé ne peut pas dépasser 200 caractères'],
  },
  debit: {
    type: Number,
    default: 0,
    min: [0, 'Le débit ne peut pas être négatif'],
  },
  credit: {
    type: Number,
    default: 0,
    min: [0, 'Le crédit ne peut pas être négatif'],
  },
  reference: {
    type: String,
    trim: true,
  },
});

const accountingEntrySchema = new mongoose.Schema(
  {
    // Numérotation
    number: {
      type: String,
      required: [true, 'Le numéro d\'écriture est requis'],
      trim: true,
      uppercase: true,
    },

    // Journal
    journal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journal',
      required: [true, 'Le journal est requis'],
    },

    // Dates
    date: {
      type: Date,
      required: [true, 'La date est requise'],
      default: Date.now,
    },
    valueDate: {
      type: Date,
      default: Date.now,
    },

    // Libellé général
    label: {
      type: String,
      required: [true, 'Le libellé est requis'],
      trim: true,
      maxlength: [200, 'Le libellé ne peut pas dépasser 200 caractères'],
    },

    // Référence externe
    reference: {
      type: String,
      trim: true,
    },
    referenceType: {
      type: String,
      enum: ['invoice', 'payment', 'purchase_order', 'salary', 'other'],
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // Lignes d'écriture (partie double)
    lines: [entryLineSchema],

    // Totaux
    totalDebit: {
      type: Number,
      required: true,
      default: 0,
    },
    totalCredit: {
      type: Number,
      required: true,
      default: 0,
    },

    // Période comptable
    fiscalYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FiscalYear',
    },
    period: {
      type: String,
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Format de période invalide (YYYY-MM)'],
    },

    // Devise
    currency: {
      type: String,
      enum: ['XOF', 'EUR', 'USD', 'XAF'],
      default: 'XOF',
    },

    // Notes
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
    },

    // Statut
    status: {
      type: String,
      enum: ['draft', 'posted', 'validated', 'cancelled'],
      default: 'draft',
    },

    // Validation
    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    validatedAt: {
      type: Date,
    },

    // Entreprise et utilisateur
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'L\'entreprise est requise'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur est requis'],
    },
  },
  {
    timestamps: true,
  }
);

// Index
accountingEntrySchema.index({ company: 1, number: 1 }, { unique: true });
accountingEntrySchema.index({ journal: 1, date: -1 });
accountingEntrySchema.index({ period: 1 });
accountingEntrySchema.index({ fiscalYear: 1 });
accountingEntrySchema.index({ status: 1 });
accountingEntrySchema.index({ 'lines.account': 1 });

// Middleware : Calculer les totaux et vérifier l'équilibre avant sauvegarde
accountingEntrySchema.pre('save', function (next) {
  // Calculer les totaux
  this.totalDebit = this.lines.reduce((sum, line) => sum + line.debit, 0);
  this.totalCredit = this.lines.reduce((sum, line) => sum + line.credit, 0);

  // Vérifier l'équilibre (débit = crédit)
  const difference = Math.abs(this.totalDebit - this.totalCredit);
  if (difference > 0.01) {
    return next(new Error('L\'écriture n\'est pas équilibrée (débit ≠ crédit)'));
  }

  // Générer la période si pas définie
  if (!this.period && this.date) {
    const year = this.date.getFullYear();
    const month = String(this.date.getMonth() + 1).padStart(2, '0');
    this.period = `${year}-${month}`;
  }

  next();
});

// Middleware : Vérifier qu'une ligne a soit un débit soit un crédit (pas les deux)
accountingEntrySchema.pre('save', function (next) {
  for (const line of this.lines) {
    if (line.debit > 0 && line.credit > 0) {
      return next(new Error('Une ligne ne peut pas avoir à la fois un débit et un crédit'));
    }
    if (line.debit === 0 && line.credit === 0) {
      return next(new Error('Une ligne doit avoir soit un débit soit un crédit'));
    }
  }
  next();
});

// Méthode : Poster l'écriture
accountingEntrySchema.methods.post = async function () {
  if (this.status !== 'draft') {
    throw new Error('Seules les écritures en brouillon peuvent être postées');
  }

  this.status = 'posted';
  await this.save();

  // Mettre à jour les soldes des comptes
  const Account = mongoose.model('Account');
  for (const line of this.lines) {
    await Account.findByIdAndUpdate(line.account, {
      $inc: {
        debitBalance: line.debit,
        creditBalance: line.credit,
      },
    });
  }

  return this;
};

// Méthode : Valider l'écriture
accountingEntrySchema.methods.validateEntry = async function (userId) {
  if (this.status !== 'posted') {
    throw new Error('Seules les écritures postées peuvent être validées');
  }

  this.status = 'validated';
  this.validatedBy = userId;
  this.validatedAt = new Date();
  await this.save();

  return this;
};

// Méthode : Annuler l'écriture
accountingEntrySchema.methods.cancel = async function () {
  if (this.status === 'validated') {
    throw new Error('Impossible d\'annuler une écriture validée');
  }

  this.status = 'cancelled';
  await this.save();

  return this;
};

// Méthode statique : Obtenir le grand livre d'un compte
accountingEntrySchema.statics.getLedger = function (accountId, startDate, endDate) {
  return this.find({
    'lines.account': accountId,
    status: { $in: ['posted', 'validated'] },
    date: { $gte: startDate, $lte: endDate },
  })
    .sort({ date: 1, number: 1 })
    .populate('journal', 'name code')
    .populate('lines.account', 'code label');
};

// Méthode statique : Obtenir les écritures d'une période
accountingEntrySchema.statics.findByPeriod = function (companyId, period) {
  return this.find({
    company: companyId,
    period: period,
    status: { $in: ['posted', 'validated'] },
  }).sort({ date: 1, number: 1 });
};

const AccountingEntry = mongoose.model('AccountingEntry', accountingEntrySchema);

export default AccountingEntry;
