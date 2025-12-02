/**
 * Modèle Category - Catégories de produits
 * Organisation hiérarchique des produits
 */

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom de la catégorie est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    image: {
      type: String,
      default: null,
    },

    // Catégorie parente (pour hiérarchie)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    // Entreprise propriétaire
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'L\'entreprise est requise'],
    },

    // Métadonnées
    order: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#3B82F6',
    },
    icon: {
      type: String,
      default: null,
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
categorySchema.index({ company: 1, slug: 1 }, { unique: true });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });

// Virtual pour les sous-catégories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Virtual pour les produits
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
});

// Middleware : Générer le slug avant sauvegarde
categorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Méthode : Obtenir le chemin complet de la catégorie
categorySchema.methods.getPath = async function () {
  const path = [this.name];
  let current = this;

  while (current.parent) {
    current = await this.model('Category').findById(current.parent);
    if (current) {
      path.unshift(current.name);
    }
  }

  return path.join(' > ');
};

// Méthode statique : Obtenir les catégories racines (sans parent)
categorySchema.statics.findRoots = function (companyId) {
  return this.find({ company: companyId, parent: null, isActive: true }).sort({ order: 1 });
};

const Category = mongoose.model('Category', categorySchema);

export default Category;
