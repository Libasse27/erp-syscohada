/**
 * Modèle Account - Plan comptable
 * Comptes du plan comptable SYSCOHADA
 */

import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    // Code comptable SYSCOHADA
    code: {
      type: String,
      required: [true, 'Le code comptable est requis'],
      trim: true,
      match: [/^[1-8][0-9]{0,6}$/, 'Code SYSCOHADA invalide (1-8 chiffres, commence par 1-8)'],
    },

    // Libellé
    label: {
      type: String,
      required: [true, 'Le libellé est requis'],
      trim: true,
      maxlength: [200, 'Le libellé ne peut pas dépasser 200 caractères'],
    },

    // Description
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },

    // Classe SYSCOHADA (1-8)
    class: {
      type: Number,
      required: true,
      min: [1, 'La classe doit être entre 1 et 8'],
      max: [8, 'La classe doit être entre 1 et 8'],
    },

    // Type de compte
    type: {
      type: String,
      enum: ['asset', 'liability', 'equity', 'revenue', 'expense'],
      required: [true, 'Le type de compte est requis'],
    },

    // Sens naturel du compte
    naturalBalance: {
      type: String,
      enum: ['debit', 'credit'],
      required: [true, 'Le sens naturel est requis'],
    },

    // Compte parent (pour hiérarchie)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },

    // Niveau dans la hiérarchie (1 = racine)
    level: {
      type: Number,
      required: true,
      min: [1, 'Le niveau doit être au moins 1'],
      max: [7, 'Le niveau ne peut pas dépasser 7'],
    },

    // Compte collectif ou auxiliaire
    isAuxiliary: {
      type: Boolean,
      default: false,
    },

    // Peut être lettré (pour rapprochements)
    isReconcilable: {
      type: Boolean,
      default: false,
    },

    // Soldes
    balance: {
      type: Number,
      default: 0,
    },
    debitBalance: {
      type: Number,
      default: 0,
    },
    creditBalance: {
      type: Number,
      default: 0,
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
    isSystemAccount: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index
accountSchema.index({ company: 1, code: 1 }, { unique: true });
accountSchema.index({ class: 1 });
accountSchema.index({ type: 1 });
accountSchema.index({ parent: 1 });
accountSchema.index({ isActive: 1 });

// Virtual pour le code formaté
accountSchema.virtual('formattedCode').get(function () {
  const code = this.code;
  if (code.length <= 2) return code;
  if (code.length <= 4) return `${code.substring(0, 2)} ${code.substring(2)}`;
  return `${code.substring(0, 2)} ${code.substring(2, 4)} ${code.substring(4)}`;
});

// Virtual pour vérifier si c'est un compte de bilan
accountSchema.virtual('isBalanceSheet').get(function () {
  return [1, 2, 3, 4, 5].includes(this.class);
});

// Virtual pour vérifier si c'est un compte de gestion
accountSchema.virtual('isIncomeStatement').get(function () {
  return [6, 7, 8].includes(this.class);
});

// Middleware : Calculer le niveau et la classe avant sauvegarde
accountSchema.pre('save', function (next) {
  // Extraire la classe du code
  this.class = parseInt(this.code.charAt(0));

  // Calculer le niveau selon la longueur du code
  this.level = Math.min(this.code.length, 7);

  next();
});

// Méthode : Mettre à jour le solde
accountSchema.methods.updateBalance = async function (debit, credit) {
  this.debitBalance += debit;
  this.creditBalance += credit;
  this.balance = this.debitBalance - this.creditBalance;

  // Inverser pour les comptes à solde créditeur naturel
  if (this.naturalBalance === 'credit') {
    this.balance = -this.balance;
  }

  await this.save();
  return this;
};

// Méthode statique : Trouver les comptes par classe
accountSchema.statics.findByClass = function (companyId, classNumber) {
  return this.find({
    company: companyId,
    class: classNumber,
    isActive: true,
  }).sort({ code: 1 });
};

// Méthode statique : Obtenir le plan comptable complet
accountSchema.statics.getChartOfAccounts = function (companyId) {
  return this.find({ company: companyId, isActive: true }).sort({ code: 1 });
};

const Account = mongoose.model('Account', accountSchema);

export default Account;
