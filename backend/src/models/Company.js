/**
 * Modèle Company - Entreprises/Sociétés
 * Gestion des informations des entreprises clientes du système
 */

import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom de l\'entreprise est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    legalName: {
      type: String,
      trim: true,
      maxlength: [200, 'La raison sociale ne peut pas dépasser 200 caractères'],
    },
    logo: {
      type: String,
      default: null,
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [100, 'Le secteur d\'activité ne peut pas dépasser 100 caractères'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },

    // Informations légales
    ninea: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^[0-9]{7}$/, 'NINEA invalide (7 chiffres requis)'],
    },
    rc: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    taxId: {
      type: String,
      trim: true,
    },
    legalForm: {
      type: String,
      enum: ['SARL', 'SA', 'SAS', 'SUARL', 'EI', 'GIE', 'Autre'],
    },

    // Coordonnées
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
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
      type: String,
      required: [true, 'L\'adresse est requise'],
      trim: true,
      maxlength: [200, 'L\'adresse ne peut pas dépasser 200 caractères'],
    },
    city: {
      type: String,
      required: [true, 'La ville est requise'],
      trim: true,
      maxlength: [100, 'La ville ne peut pas dépasser 100 caractères'],
    },
    postalCode: {
      type: String,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Le pays est requis'],
      default: 'Sénégal',
      trim: true,
    },

    // Configuration comptable
    fiscalYearStart: {
      type: Number,
      min: 1,
      max: 12,
      default: 1, // Janvier
    },
    currency: {
      type: String,
      enum: ['XOF', 'EUR', 'USD', 'XAF'],
      default: 'XOF',
    },
    vatRate: {
      type: Number,
      default: 18,
      min: 0,
      max: 100,
    },
    accountingSystem: {
      type: String,
      enum: ['SYSCOHADA', 'OHADA', 'Other'],
      default: 'SYSCOHADA',
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
    swift: {
      type: String,
      trim: true,
      uppercase: true,
    },

    // Configuration
    settings: {
      invoicePrefix: {
        type: String,
        default: 'FAC',
        trim: true,
      },
      quotePrefix: {
        type: String,
        default: 'DEV',
        trim: true,
      },
      orderPrefix: {
        type: String,
        default: 'CMD',
        trim: true,
      },
      paymentTerms: {
        type: String,
        enum: ['immediate', 'net_15', 'net_30', 'net_45', 'net_60'],
        default: 'net_30',
      },
      language: {
        type: String,
        enum: ['fr', 'en'],
        default: 'fr',
      },
      timezone: {
        type: String,
        default: 'Africa/Dakar',
      },
    },

    // Statut
    isActive: {
      type: Boolean,
      default: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'professional', 'enterprise'],
        default: 'free',
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
      },
      status: {
        type: String,
        enum: ['active', 'trial', 'suspended', 'cancelled'],
        default: 'trial',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index
companySchema.index({ ninea: 1 });
companySchema.index({ email: 1 });
companySchema.index({ isActive: 1 });
companySchema.index({ 'subscription.status': 1 });

// Virtual pour l'adresse complète
companySchema.virtual('fullAddress').get(function () {
  return `${this.address}, ${this.city}, ${this.country}`;
});

// Méthode : Vérifier si l'entreprise est active et en règle
companySchema.methods.isOperational = function () {
  return (
    this.isActive &&
    ['active', 'trial'].includes(this.subscription.status)
  );
};

// Méthode statique : Trouver les entreprises actives
companySchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

const Company = mongoose.model('Company', companySchema);

export default Company;
