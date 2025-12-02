/**
 * Modèle Warehouse - Entrepôts
 * Gestion des entrepôts/magasins de stockage
 */

import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom de l\'entrepôt est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    code: {
      type: String,
      required: [true, 'Le code est requis'],
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },

    // Type
    type: {
      type: String,
      enum: ['main', 'branch', 'retail', 'storage'],
      default: 'main',
    },

    // Adresse
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      region: { type: String, trim: true },
      country: { type: String, default: 'Sénégal' },
    },

    // Contact
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    // Responsable
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Capacité
    capacity: {
      type: Number,
      min: [0, 'La capacité ne peut pas être négative'],
    },
    capacityUnit: {
      type: String,
      enum: ['m2', 'm3', 'palettes', 'unités'],
      default: 'm2',
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
warehouseSchema.index({ company: 1, code: 1 }, { unique: true });
warehouseSchema.index({ isActive: 1 });
warehouseSchema.index({ isDefault: 1 });

// Méthode statique : Obtenir l'entrepôt par défaut
warehouseSchema.statics.findDefault = function (companyId) {
  return this.findOne({ company: companyId, isDefault: true, isActive: true });
};

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

export default Warehouse;
