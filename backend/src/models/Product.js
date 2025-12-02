/**
 * Modèle Product - Produits et services
 * Gestion du catalogue produits avec stock et prix
 */

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Informations de base
    name: {
      type: String,
      required: [true, 'Le nom du produit est requis'],
      trim: true,
      maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères'],
    },
    code: {
      type: String,
      required: [true, 'Le code produit est requis'],
      trim: true,
      uppercase: true,
    },
    barcode: {
      type: String,
      trim: true,
      sparse: true,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },

    // Description
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'La description courte ne peut pas dépasser 500 caractères'],
    },

    // Type et catégorie
    type: {
      type: String,
      enum: ['product', 'service'],
      required: [true, 'Le type est requis'],
      default: 'product',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    // Prix
    purchasePrice: {
      type: Number,
      required: [true, 'Le prix d\'achat est requis'],
      min: [0, 'Le prix d\'achat ne peut pas être négatif'],
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Le prix de vente est requis'],
      min: [0, 'Le prix de vente ne peut pas être négatif'],
    },
    wholesalePrice: {
      type: Number,
      min: [0, 'Le prix de gros ne peut pas être négatif'],
      default: 0,
    },
    currency: {
      type: String,
      enum: ['XOF', 'EUR', 'USD', 'XAF'],
      default: 'XOF',
    },

    // TVA
    vatRate: {
      type: Number,
      default: 18,
      min: [0, 'Le taux de TVA ne peut pas être négatif'],
      max: [100, 'Le taux de TVA ne peut pas dépasser 100%'],
    },
    taxable: {
      type: Boolean,
      default: true,
    },

    // Stock (pour les produits physiques)
    trackStock: {
      type: Boolean,
      default: true,
    },
    currentStock: {
      type: Number,
      default: 0,
      min: [0, 'Le stock ne peut pas être négatif'],
    },
    minStock: {
      type: Number,
      default: 0,
      min: [0, 'Le stock minimum ne peut pas être négatif'],
    },
    maxStock: {
      type: Number,
      default: null,
    },
    reorderLevel: {
      type: Number,
      default: 10,
      min: [0, 'Le niveau de réapprovisionnement ne peut pas être négatif'],
    },
    unit: {
      type: String,
      enum: ['unit', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'm2', 'm3', 'pack', 'box', 'carton'],
      default: 'unit',
    },

    // Dimensions et poids (optionnel)
    weight: {
      type: Number,
      min: [0, 'Le poids ne peut pas être négatif'],
    },
    weightUnit: {
      type: String,
      enum: ['kg', 'g'],
      default: 'kg',
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      unit: { type: String, enum: ['cm', 'm'], default: 'cm' },
    },

    // Fournisseur par défaut
    defaultSupplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },

    // Images
    images: [
      {
        url: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    // Métadonnées
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
    },

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
    isFeatured: {
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

// Index composés
productSchema.index({ company: 1, code: 1 }, { unique: true });
productSchema.index({ company: 1, barcode: 1 }, { sparse: true });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ currentStock: 1 });
productSchema.index({ tags: 1 });

// Virtual pour la marge bénéficiaire
productSchema.virtual('profitMargin').get(function () {
  if (!this.purchasePrice || this.purchasePrice === 0) return 0;
  return ((this.sellingPrice - this.purchasePrice) / this.purchasePrice) * 100;
});

// Virtual pour vérifier si le stock est bas
productSchema.virtual('isLowStock').get(function () {
  if (!this.trackStock) return false;
  return this.currentStock <= this.reorderLevel;
});

// Virtual pour vérifier si le produit est en rupture
productSchema.virtual('isOutOfStock').get(function () {
  if (!this.trackStock) return false;
  return this.currentStock === 0;
});

// Virtual pour l'image principale
productSchema.virtual('primaryImage').get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  return primary ? primary.url : this.images[0]?.url || null;
});

// Middleware : Vérifier qu'une seule image est marquée comme principale
productSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter((img) => img.isPrimary);
    if (primaryImages.length === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryImages.length > 1) {
      // Garder seulement la première comme principale
      this.images.forEach((img, index) => {
        img.isPrimary = index === 0;
      });
    }
  }
  next();
});

// Méthode : Ajuster le stock
productSchema.methods.adjustStock = async function (quantity, reason = 'adjustment') {
  if (!this.trackStock) {
    throw new Error('Ce produit ne gère pas le stock');
  }

  this.currentStock += quantity;

  if (this.currentStock < 0) {
    throw new Error('Stock insuffisant');
  }

  await this.save();
  return this;
};

// Méthode : Vérifier la disponibilité
productSchema.methods.isAvailable = function (quantity = 1) {
  if (!this.trackStock) return true;
  return this.currentStock >= quantity;
};

// Méthode statique : Trouver les produits en rupture de stock
productSchema.statics.findOutOfStock = function (companyId) {
  return this.find({
    company: companyId,
    trackStock: true,
    currentStock: 0,
    isActive: true,
  });
};

// Méthode statique : Trouver les produits à faible stock
productSchema.statics.findLowStock = function (companyId) {
  return this.find({
    company: companyId,
    trackStock: true,
    isActive: true,
  }).where('currentStock').lte(this.reorderLevel);
};

const Product = mongoose.model('Product', productSchema);

export default Product;
