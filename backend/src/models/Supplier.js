/**
 * Modèle Supplier - Fournisseurs
 * Gestion des fournisseurs et de leurs informations
 */

import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    // Informations de base
    supplierNumber: {
      type: String,
      required: [true, 'Le numéro fournisseur est requis'],
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Le nom du fournisseur est requis'],
      trim: true,
      maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères'],
    },
    legalName: {
      type: String,
      trim: true,
      maxlength: [200, 'La raison sociale ne peut pas dépasser 200 caractères'],
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

    // Adresse
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      region: { type: String, trim: true },
      country: { type: String, default: 'Sénégal', trim: true },
    },

    // Informations légales
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

    // Personne de contact
    contactPerson: {
      name: { type: String, trim: true },
      position: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, lowercase: true, trim: true },
    },

    // Informations commerciales
    category: {
      type: String,
      trim: true,
    },
    products: [
      {
        type: String,
        trim: true,
      },
    ],
    paymentTerms: {
      type: String,
      enum: ['immediate', 'net_15', 'net_30', 'net_45', 'net_60'],
      default: 'net_30',
    },
    currency: {
      type: String,
      enum: ['XOF', 'EUR', 'USD', 'XAF'],
      default: 'XOF',
    },
    leadTime: {
      type: Number,
      default: 0,
      min: [0, 'Le délai de livraison ne peut pas être négatif'],
    },

    // Informations bancaires
    bankName: {
      type: String,
      trim: true,
    },
    bankAccountNumber: {
      type: String,
      trim: true,
    },
    iban: {
      type: String,
      trim: true,
      uppercase: true,
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

    // Évaluation
    rating: {
      type: Number,
      min: [0, 'La note ne peut pas être inférieure à 0'],
      max: [5, 'La note ne peut pas dépasser 5'],
      default: null,
    },
    qualityScore: {
      type: Number,
      min: [0, 'Le score qualité ne peut pas être inférieur à 0'],
      max: [100, 'Le score qualité ne peut pas dépasser 100'],
      default: null,
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
    isPreferred: {
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
supplierSchema.index({ company: 1, supplierNumber: 1 }, { unique: true });
supplierSchema.index({ company: 1, email: 1 });
supplierSchema.index({ company: 1, phone: 1 });
supplierSchema.index({ isActive: 1 });
supplierSchema.index({ isPreferred: 1 });
supplierSchema.index({ tags: 1 });

// Virtual pour l'adresse complète
supplierSchema.virtual('fullAddress').get(function () {
  const addr = this.address;
  if (!addr.street) return '';
  return `${addr.street}, ${addr.city}, ${addr.country}`;
});

// Virtual pour vérifier si le fournisseur a des impayés
supplierSchema.virtual('hasBalance').get(function () {
  return this.balance > 0;
});

// Méthode : Mettre à jour les statistiques après un achat
supplierSchema.methods.updateStats = async function (amount, paid = 0) {
  this.totalPurchases += amount;
  this.totalPaid += paid;
  this.balance = this.totalPurchases - this.totalPaid;
  this.lastPurchaseDate = new Date();
  await this.save();
  return this;
};

// Méthode : Mettre à jour la note
supplierSchema.methods.updateRating = async function (newRating) {
  if (newRating < 0 || newRating > 5) {
    throw new Error('La note doit être entre 0 et 5');
  }
  this.rating = newRating;
  await this.save();
  return this;
};

// Méthode statique : Trouver les fournisseurs avec solde impayé
supplierSchema.statics.findWithBalance = function (companyId) {
  return this.find({
    company: companyId,
    balance: { $gt: 0 },
    isActive: true,
  }).sort({ balance: -1 });
};

// Méthode statique : Trouver les fournisseurs préférés
supplierSchema.statics.findPreferred = function (companyId) {
  return this.find({
    company: companyId,
    isPreferred: true,
    isActive: true,
  }).sort({ name: 1 });
};

// Méthode statique : Trouver les meilleurs fournisseurs
supplierSchema.statics.findTopSuppliers = function (companyId, limit = 10) {
  return this.find({
    company: companyId,
    isActive: true,
  })
    .sort({ totalPurchases: -1 })
    .limit(limit);
};

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
