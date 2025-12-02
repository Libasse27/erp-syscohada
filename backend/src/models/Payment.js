/**
 * Modèle Payment - Paiements
 * Gestion des paiements et encaissements
 */

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    // Numérotation
    number: {
      type: String,
      required: [true, 'Le numéro de paiement est requis'],
      trim: true,
      uppercase: true,
    },

    // Type de paiement
    type: {
      type: String,
      enum: ['customer_payment', 'supplier_payment', 'expense', 'income', 'transfer'],
      required: [true, 'Le type de paiement est requis'],
    },

    // Relations
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },

    // Montant
    amount: {
      type: Number,
      required: [true, 'Le montant est requis'],
      min: [0.01, 'Le montant doit être positif'],
    },
    currency: {
      type: String,
      enum: ['XOF', 'EUR', 'USD', 'XAF'],
      default: 'XOF',
    },

    // Dates
    date: {
      type: Date,
      required: [true, 'La date est requise'],
      default: Date.now,
    },
    valueDate: {
      type: Date,
    },

    // Méthode de paiement
    method: {
      type: String,
      enum: ['cash', 'check', 'bank_transfer', 'mobile_money', 'card', 'other'],
      required: [true, 'La méthode de paiement est requise'],
    },

    // Détails selon la méthode
    checkNumber: {
      type: String,
      trim: true,
    },
    checkDate: {
      type: Date,
    },
    bankName: {
      type: String,
      trim: true,
    },
    mobileMoneyProvider: {
      type: String,
      enum: ['orange_money', 'wave', 'free_money', 'other'],
    },
    mobileMoneyNumber: {
      type: String,
      trim: true,
      match: [/^(\+221|00221)?[0-9]{9}$/, 'Numéro Mobile Money invalide'],
    },
    mobileMoneyTransactionId: {
      type: String,
      trim: true,
    },
    cardLastDigits: {
      type: String,
      trim: true,
      match: [/^[0-9]{4}$/, 'Les 4 derniers chiffres doivent être au format 0000'],
    },
    cardType: {
      type: String,
      enum: ['visa', 'mastercard', 'american_express', 'other'],
    },

    // Compte bancaire
    bankAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BankAccount',
    },

    // Référence
    reference: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },

    // Notes
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
    },

    // Pièces jointes (reçus, justificatifs)
    attachments: [
      {
        name: { type: String },
        url: { type: String },
        type: { type: String },
        size: { type: Number },
      },
    ],

    // Statut
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'completed',
    },

    // Validation
    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    validatedAt: {
      type: Date,
    },

    // Écriture comptable associée
    accountingEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AccountingEntry',
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
paymentSchema.index({ company: 1, number: 1 }, { unique: true });
paymentSchema.index({ invoice: 1 });
paymentSchema.index({ customer: 1 });
paymentSchema.index({ supplier: 1 });
paymentSchema.index({ type: 1 });
paymentSchema.index({ method: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ date: -1 });

// Méthode : Valider le paiement
paymentSchema.methods.validatePayment = async function (userId) {
  if (this.status !== 'pending') {
    throw new Error('Seuls les paiements en attente peuvent être validés');
  }

  this.status = 'completed';
  this.validatedBy = userId;
  this.validatedAt = new Date();
  await this.save();

  return this;
};

// Méthode : Annuler le paiement
paymentSchema.methods.cancel = async function () {
  if (this.status === 'completed' && this.accountingEntry) {
    throw new Error('Impossible d\'annuler un paiement comptabilisé');
  }

  this.status = 'cancelled';
  await this.save();

  return this;
};

// Méthode statique : Obtenir les paiements d'une période
paymentSchema.statics.findByPeriod = function (companyId, startDate, endDate) {
  return this.find({
    company: companyId,
    date: { $gte: startDate, $lte: endDate },
    status: { $ne: 'cancelled' },
  }).sort({ date: -1 });
};

// Méthode statique : Calculer le total des encaissements/décaissements
paymentSchema.statics.calculateTotals = async function (companyId, startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        company: new mongoose.Types.ObjectId(companyId),
        status: 'completed',
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  return result.reduce(
    (acc, item) => {
      if (item._id === 'customer_payment' || item._id === 'income') {
        acc.totalIncome += item.total;
        acc.incomeCount += item.count;
      } else if (item._id === 'supplier_payment' || item._id === 'expense') {
        acc.totalExpense += item.total;
        acc.expenseCount += item.count;
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0, incomeCount: 0, expenseCount: 0 }
  );
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
