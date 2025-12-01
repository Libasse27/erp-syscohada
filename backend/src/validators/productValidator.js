/**
 * Validators pour les produits
 * Validation des données avec Joi
 */

import Joi from 'joi';

/**
 * Schéma de validation pour la création d'un produit
 */
export const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Le nom du produit est requis',
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 200 caractères',
      'any.required': 'Le nom du produit est requis',
    }),

  code: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le code produit est requis',
      'string.min': 'Le code doit contenir au moins 2 caractères',
      'string.max': 'Le code ne peut pas dépasser 50 caractères',
      'any.required': 'Le code produit est requis',
    }),

  barcode: Joi.string()
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.base': 'Le code-barres doit être une chaîne de caractères',
    }),

  description: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La description ne peut pas dépasser 1000 caractères',
    }),

  category: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'La catégorie est requise',
      'any.required': 'La catégorie est requise',
    }),

  type: Joi.string()
    .valid('product', 'service')
    .default('product')
    .messages({
      'any.only': 'Le type doit être "product" ou "service"',
    }),

  unit: Joi.string()
    .valid('unit', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'm2', 'm3', 'pack', 'box', 'carton')
    .default('unit')
    .messages({
      'any.only': 'Unité de mesure invalide',
    }),

  // Prix
  purchasePrice: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Le prix d\'achat doit être un nombre',
      'number.min': 'Le prix d\'achat doit être positif',
      'any.required': 'Le prix d\'achat est requis',
    }),

  sellingPrice: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Le prix de vente doit être un nombre',
      'number.min': 'Le prix de vente doit être positif',
      'any.required': 'Le prix de vente est requis',
    }),

  wholesalePrice: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Le prix de gros doit être un nombre',
      'number.min': 'Le prix de gros doit être positif',
    }),

  // TVA
  vatRate: Joi.number()
    .min(0)
    .max(100)
    .default(18)
    .messages({
      'number.base': 'Le taux de TVA doit être un nombre',
      'number.min': 'Le taux de TVA doit être positif',
      'number.max': 'Le taux de TVA ne peut pas dépasser 100%',
    }),

  vatIncluded: Joi.boolean()
    .default(false),

  // Stock
  stockManaged: Joi.boolean()
    .default(true),

  initialStock: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Le stock initial doit être un nombre',
      'number.integer': 'Le stock initial doit être un nombre entier',
      'number.min': 'Le stock initial doit être positif',
    }),

  minStockAlert: Joi.number()
    .integer()
    .min(0)
    .default(5)
    .messages({
      'number.base': 'Le stock minimum doit être un nombre',
      'number.integer': 'Le stock minimum doit être un nombre entier',
      'number.min': 'Le stock minimum doit être positif',
    }),

  maxStock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Le stock maximum doit être un nombre',
      'number.integer': 'Le stock maximum doit être un nombre entier',
      'number.min': 'Le stock maximum doit être positif',
    }),

  // Fournisseur
  supplier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'ID fournisseur invalide',
    }),

  // Images
  images: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .optional()
    .messages({
      'array.max': 'Maximum 5 images par produit',
    }),

  // Autres
  tags: Joi.array()
    .items(Joi.string().trim())
    .optional(),

  brand: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La marque ne peut pas dépasser 100 caractères',
    }),

  warranty: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'La garantie doit être un nombre (en mois)',
      'number.integer': 'La garantie doit être un nombre entier',
      'number.min': 'La garantie doit être positive',
    }),

  isActive: Joi.boolean()
    .default(true),

  isFeatured: Joi.boolean()
    .default(false),
});

/**
 * Schéma de validation pour la mise à jour d'un produit
 */
export const updateProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 200 caractères',
    }),

  code: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Le code doit contenir au moins 2 caractères',
      'string.max': 'Le code ne peut pas dépasser 50 caractères',
    }),

  barcode: Joi.string()
    .trim()
    .optional()
    .allow(''),

  description: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(''),

  category: Joi.string()
    .trim()
    .optional(),

  type: Joi.string()
    .valid('product', 'service')
    .optional(),

  unit: Joi.string()
    .valid('unit', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'm2', 'm3', 'pack', 'box', 'carton')
    .optional(),

  purchasePrice: Joi.number()
    .min(0)
    .optional(),

  sellingPrice: Joi.number()
    .min(0)
    .optional(),

  wholesalePrice: Joi.number()
    .min(0)
    .optional(),

  vatRate: Joi.number()
    .min(0)
    .max(100)
    .optional(),

  vatIncluded: Joi.boolean()
    .optional(),

  stockManaged: Joi.boolean()
    .optional(),

  minStockAlert: Joi.number()
    .integer()
    .min(0)
    .optional(),

  maxStock: Joi.number()
    .integer()
    .min(0)
    .optional(),

  supplier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null),

  images: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .optional(),

  tags: Joi.array()
    .items(Joi.string().trim())
    .optional(),

  brand: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  warranty: Joi.number()
    .integer()
    .min(0)
    .optional(),

  isActive: Joi.boolean()
    .optional(),

  isFeatured: Joi.boolean()
    .optional(),
});

/**
 * Schéma de validation pour l'ajustement de stock
 */
export const adjustStockSchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'La quantité doit être un nombre',
      'number.integer': 'La quantité doit être un nombre entier',
      'any.required': 'La quantité est requise',
    }),

  type: Joi.string()
    .valid('in', 'out', 'adjust')
    .required()
    .messages({
      'any.only': 'Le type doit être "in", "out" ou "adjust"',
      'any.required': 'Le type d\'ajustement est requis',
    }),

  reason: Joi.string()
    .valid('purchase', 'sale', 'return', 'damage', 'loss', 'correction', 'transfer', 'other')
    .required()
    .messages({
      'any.only': 'Raison invalide',
      'any.required': 'La raison est requise',
    }),

  notes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Les notes ne peuvent pas dépasser 500 caractères',
    }),

  reference: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La référence ne peut pas dépasser 100 caractères',
    }),
});

/**
 * Schéma de validation pour le transfert de stock
 */
export const transferStockSchema = Joi.object({
  fromWarehouse: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID entrepôt source invalide',
      'any.required': 'L\'entrepôt source est requis',
    }),

  toWarehouse: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID entrepôt destination invalide',
      'any.required': 'L\'entrepôt destination est requis',
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'La quantité doit être un nombre',
      'number.integer': 'La quantité doit être un nombre entier',
      'number.min': 'La quantité doit être au moins 1',
      'any.required': 'La quantité est requise',
    }),

  notes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(''),
});

/**
 * Schéma de validation pour la recherche/filtrage de produits
 */
export const searchProductSchema = Joi.object({
  search: Joi.string()
    .trim()
    .optional()
    .allow(''),

  category: Joi.string()
    .trim()
    .optional(),

  type: Joi.string()
    .valid('product', 'service')
    .optional(),

  supplier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),

  minPrice: Joi.number()
    .min(0)
    .optional(),

  maxPrice: Joi.number()
    .min(0)
    .optional(),

  inStock: Joi.boolean()
    .optional(),

  lowStock: Joi.boolean()
    .optional(),

  isActive: Joi.boolean()
    .optional(),

  isFeatured: Joi.boolean()
    .optional(),

  sortBy: Joi.string()
    .valid('name', 'code', 'price', 'stock', 'createdAt', 'updatedAt')
    .default('name')
    .optional(),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('asc')
    .optional(),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional(),
});

export default {
  createProductSchema,
  updateProductSchema,
  adjustStockSchema,
  transferStockSchema,
  searchProductSchema,
};
