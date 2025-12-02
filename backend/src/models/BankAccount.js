/**
 * Modèle BankAccount - Comptes bancaires
 * Gestion des comptes bancaires de l'entreprise
 */

import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema(
  {
    // Informations du compte
    accountName: {
      type: String,
      required: [true, 'Le nom du compte est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    accountNumber: {
      type: String,
      required: [true, 'Le numéro de compte est requis'],
      trim: true,
    },
    iban: {
      type: String,
      trim: true,
      uppercase: true,
    },

    // Banque
    bankName: {
      type: String,
      required: [true, 'Le nom de la banque est requis'],
      trim: true,
      maxlength: [100, 'Le nom de la banque ne peut pas dépasser 100 caractères'],
    },
    bankCode: {
      type: String,
      trim: true,
    },
    branchName: {
      type: String,
      trim: true,
    },
    branchCode: {
      type: String,
      trim: true,
    },
    swift: {
      type: String,
      trim: true,
      uppercase: true,
    },

    // Type de compte
    accountType: {
      type: String,
      enum: ['checking', 'savings', 'credit', 'other'],
      default: 'checking',
    },

    // Devise
    currency: {
      type: String,
      enum: ['XOF', 'EUR', 'USD', 'XAF'],
      default: 'XOF',
    },

    // Soldes
    balance: {
      type: Number,
      default: 0,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    openingBalanceDate: {
      type: Date,
    },

    // Limites
    overdraftLimit: {
      type: Number,
      default: 0,
      min: [0, 'La limite de découvert ne peut pas être négative'],
    },

    // Compte comptable associé
    accountingAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },

    // Contact bancaire
    contactPerson: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, lowercase: true, trim: true },
    },

    // Notes
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],
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
bankAccountSchema.index({ company: 1, accountNumber: 1 }, { unique: true });
bankAccountSchema.index({ isActive: 1 });
bankAccountSchema.index({ isDefault: 1 });

// Virtual pour vérifier si le compte est en découvert
bankAccountSchema.virtual('isOverdrawn').get(function () {
  return this.balance < 0;
});

// Virtual pour vérifier si la limite de découvert est dépassée
bankAccountSchema.virtual('isOverLimit').get(function () {
  return this.balance < -this.overdraftLimit;
});

// Méthode : Mettre à jour le solde
bankAccountSchema.methods.updateBalance = async function (amount) {
  this.balance += amount;
  await this.save();
  return this;
};

// Méthode statique : Obtenir le compte par défaut
bankAccountSchema.statics.findDefault = function (companyId) {
  return this.findOne({
    company: companyId,
    isDefault: true,
    isActive: true,
  });
};

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

export default BankAccount;
