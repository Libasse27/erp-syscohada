/**
 * Modèle Invoice - Factures
 * Gestion des factures de vente et d'achat
 */

import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  productName: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est requise'],
    min: [0.01, 'La quantité doit être positive'],
  },
  unit: {
    type: String,
    default: 'unit',
  },
  unitPrice: {
    type: Number,
    required: [true, 'Le prix unitaire est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'La remise ne peut pas être négative'],
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  vatRate: {
    type: Number,
    default: 18,
  },
  total: {
    type: Number,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    // Numérotation
    number: {
      type: String,
      required: [true, 'Le numéro de facture est requis'],
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['sale', 'purchase', 'proforma', 'credit_note', 'debit_note'],
      required: [true, 'Le type de facture est requis'],
      default: 'sale',
    },

    // Dates
    date: {
      type: Date,
      required: [true, 'La date est requise'],
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    paidDate: {
      type: Date,
    },

    // Client ou Fournisseur
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },

    // Lignes de facture
    items: [invoiceItemSchema],

    // Montants
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    globalDiscount: {
      type: Number,
      default: 0,
      min: [0, 'La remise ne peut pas être négative'],
    },
    globalDiscountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'Les frais de livraison ne peuvent pas être négatifs'],
    },
    vatRate: {
      type: Number,
      default: 18,
    },
    vatAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      enum: ['XOF', 'EUR', 'USD', 'XAF'],
      default: 'XOF',
    },

    // Paiement
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, 'Le montant payé ne peut pas être négatif'],
    },
    amountDue: {
      type: Number,
      default: 0,
    },
    paymentTerms: {
      type: String,
      enum: ['immediate', 'net_15', 'net_30', 'net_45', 'net_60'],
      default: 'net_30',
    },

    // Statut
    status: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'cancelled'],
      default: 'draft',
    },

    // Références
    reference: {
      type: String,
      trim: true,
    },
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PurchaseOrder',
    },

    // Notes et conditions
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
    },
    terms: {
      type: String,
      trim: true,
      maxlength: [2000, 'Les conditions ne peuvent pas dépasser 2000 caractères'],
    },

    // Pièces jointes
    attachments: [
      {
        name: { type: String },
        url: { type: String },
        type: { type: String },
        size: { type: Number },
      },
    ],

    // Entreprise propriétaire
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'L\'entreprise est requise'],
    },

    // Utilisateur créateur
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Historique d'envoi
    sentHistory: [
      {
        sentTo: { type: String },
        sentAt: { type: Date, default: Date.now },
        sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index
invoiceSchema.index({ company: 1, number: 1 }, { unique: true });
invoiceSchema.index({ customer: 1 });
invoiceSchema.index({ supplier: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ type: 1 });
invoiceSchema.index({ date: -1 });
invoiceSchema.index({ dueDate: 1 });

// Virtual pour vérifier si la facture est en retard
invoiceSchema.virtual('isOverdue').get(function () {
  if (this.status === 'paid' || !this.dueDate) return false;
  return new Date() > this.dueDate;
});

// Virtual pour vérifier si la facture est payée
invoiceSchema.virtual('isPaid').get(function () {
  return this.status === 'paid';
});

// Virtual pour le solde restant
invoiceSchema.virtual('balance').get(function () {
  return this.total - this.amountPaid;
});

// Middleware : Calculer les totaux avant sauvegarde
invoiceSchema.pre('save', function (next) {
  // Calculer le sous-total
  this.subtotal = this.items.reduce((sum, item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const discount =
      item.discountType === 'percentage'
        ? (lineTotal * item.discount) / 100
        : item.discount;
    item.total = lineTotal - discount;
    return sum + item.total;
  }, 0);

  // Calculer la remise globale
  if (this.globalDiscount > 0) {
    this.discountAmount =
      this.globalDiscountType === 'percentage'
        ? (this.subtotal * this.globalDiscount) / 100
        : this.globalDiscount;
  } else {
    this.discountAmount = 0;
  }

  // Calculer la TVA et le total
  const amountBeforeTax = this.subtotal - this.discountAmount + this.shippingCost;
  this.vatAmount = (amountBeforeTax * this.vatRate) / 100;
  this.total = amountBeforeTax + this.vatAmount;

  // Calculer le montant dû
  this.amountDue = this.total - this.amountPaid;

  // Mettre à jour le statut selon les paiements
  if (this.amountPaid >= this.total) {
    this.status = 'paid';
    this.paidDate = this.paidDate || new Date();
  } else if (this.amountPaid > 0) {
    this.status = 'partial';
  } else if (this.isOverdue) {
    this.status = 'overdue';
  }

  next();
});

// Méthode : Enregistrer un paiement
invoiceSchema.methods.recordPayment = async function (amount) {
  if (amount <= 0) {
    throw new Error('Le montant du paiement doit être positif');
  }

  this.amountPaid += amount;

  if (this.amountPaid >= this.total) {
    this.status = 'paid';
    this.paidDate = new Date();
  } else {
    this.status = 'partial';
  }

  await this.save();
  return this;
};

// Méthode : Marquer comme envoyée
invoiceSchema.methods.markAsSent = async function (email, userId) {
  this.status = 'sent';
  this.sentHistory.push({
    sentTo: email,
    sentAt: new Date(),
    sentBy: userId,
  });
  await this.save();
  return this;
};

// Méthode : Annuler la facture
invoiceSchema.methods.cancel = async function () {
  if (this.status === 'paid') {
    throw new Error('Impossible d\'annuler une facture déjà payée');
  }
  this.status = 'cancelled';
  await this.save();
  return this;
};

// Méthode statique : Trouver les factures en retard
invoiceSchema.statics.findOverdue = function (companyId) {
  const today = new Date();
  return this.find({
    company: companyId,
    status: { $nin: ['paid', 'cancelled'] },
    dueDate: { $lt: today },
  }).sort({ dueDate: 1 });
};

// Méthode statique : Calculer le CA sur une période
invoiceSchema.statics.calculateRevenue = async function (companyId, startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        company: new mongoose.Types.ObjectId(companyId),
        type: 'sale',
        status: { $ne: 'cancelled' },
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
        totalPaid: { $sum: '$amountPaid' },
        count: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { totalRevenue: 0, totalPaid: 0, count: 0 };
};

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
