/**
 * Modèle Customer - Clients
 * Gestion des clients et de leurs informations
 */

import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    // Informations de base
    customerNumber: {
      type: String,
      required: [true, 'Le numéro client est requis'],
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['individual', 'company'],
      required: [true, 'Le type de client est requis'],
      default: 'individual',
    },

    // Nom (selon le type)
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères'],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères'],
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: [200, 'Le nom de l\'entreprise ne peut pas dépasser 200 caractères'],
    },

    // Coordonnées
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email invalide',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Le téléphone est requis'],
      trim: true,
      match: [
        /^(\+221|00221)?[0-9]{9}$/,
        'Numéro de téléphone invalide (format sénégalais)',
      ],
    },
    mobile: {
      type: String,
      trim: true,
    },
    fax: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },

    // Adresse de facturation
    billingAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      region: { type: String, trim: true },
      country: { type: String, default: 'Sénégal', trim: true },
    },

    // Adresse de livraison
    shippingAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      region: { type: String, trim: true },
      country: { type: String, default: 'Sénégal', trim: true },
      sameAsBilling: { type: Boolean, default: true },
    },

    // Informations légales (pour les entreprises)
    ninea: {
      type: String,
      trim: true,
      match: [/^[0-9]{7}$/, 'NINEA invalide (7 chiffres requis)'],
    },
    rc: {
      type: String,
      trim: true,
    },
    taxId: {
      type: String,
      trim: true,
    },

    // Informations commerciales
    category: {
      type: String,
      enum: ['retail', 'wholesale', 'vip', 'regular'],
      default: 'regular',
    },
    priceList: {
      type: String,
      enum: ['retail', 'wholesale', 'special'],
      default: 'retail',
    },
    paymentTerms: {
      type: String,
      enum: ['immediate', 'net_15', 'net_30', 'net_45', 'net_60'],
      default: 'immediate',
    },
    creditLimit: {
      type: Number,
      default: 0,
      min: [0, 'La limite de crédit ne peut pas être négative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'La remise ne peut pas être négative'],
      max: [100, 'La remise ne peut pas dépasser 100%'],
    },

    // Statistiques financières
    totalPurchases: {
      type: Number,
      default: 0,
      min: [0, 'Le total des achats ne peut pas être négatif'],
    },
    totalPaid: {
      type: Number,
      default: 0,
      min: [0, 'Le total payé ne peut pas être négatif'],
    },
    balance: {
      type: Number,
      default: 0,
    },
    lastPurchaseDate: {
      type: Date,
      default: null,
    },

    // Contact commercial
    salesRepresentative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Notes et tags
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Entreprise propriétaire
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index
customerSchema.index({ company: 1, customerNumber: 1 }, { unique: true });
customerSchema.index({ company: 1, email: 1 });
customerSchema.index({ company: 1, phone: 1 });
customerSchema.index({ isActive: 1 });
customerSchema.index({ category: 1 });
customerSchema.index({ tags: 1 });

// Virtual pour le nom complet
customerSchema.virtual('name').get(function () {
  if (this.type === 'company') {
    return this.companyName;
  }
  return `${this.firstName} ${this.lastName}`.trim();
});

// Virtual pour l'adresse complète de facturation
customerSchema.virtual('fullBillingAddress').get(function () {
  const addr = this.billingAddress;
  if (!addr.street) return '';
  return `${addr.street}, ${addr.city}, ${addr.country}`;
});

// Virtual pour vérifier si le client a dépassé sa limite de crédit
customerSchema.virtual('isOverCreditLimit').get(function () {
  return this.balance > this.creditLimit;
});

// Middleware : Validation conditionnelle selon le type
customerSchema.pre('save', function (next) {
  if (this.type === 'individual') {
    if (!this.firstName || !this.lastName) {
      return next(new Error('Le prénom et le nom sont requis pour un particulier'));
    }
  } else if (this.type === 'company') {
    if (!this.companyName) {
      return next(new Error('Le nom de l\'entreprise est requis pour une société'));
    }
  }
  next();
});

// Méthode : Mettre à jour les statistiques après une vente
customerSchema.methods.updateStats = async function (amount, paid = 0) {
  this.totalPurchases += amount;
  this.totalPaid += paid;
  this.balance = this.totalPurchases - this.totalPaid;
  this.lastPurchaseDate = new Date();
  await this.save();
  return this;
};

// Méthode : Vérifier si le client peut acheter à crédit
customerSchema.methods.canBuyOnCredit = function (amount) {
  if (this.paymentTerms === 'immediate') return false;
  const newBalance = this.balance + amount;
  return newBalance <= this.creditLimit;
};

// Méthode statique : Trouver les clients avec solde impayé
customerSchema.statics.findWithBalance = function (companyId) {
  return this.find({
    company: companyId,
    balance: { $gt: 0 },
    isActive: true,
  }).sort({ balance: -1 });
};

// Méthode statique : Trouver les meilleurs clients
customerSchema.statics.findTopCustomers = function (companyId, limit = 10) {
  return this.find({
    company: companyId,
    isActive: true,
  })
    .sort({ totalPurchases: -1 })
    .limit(limit);
};

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
