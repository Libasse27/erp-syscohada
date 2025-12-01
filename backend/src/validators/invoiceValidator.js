/**
 * Validators pour les factures
 * Validation des données avec Joi
 */

import Joi from 'joi';

/**
 * Schéma pour un item de facture
 */
const invoiceItemSchema = Joi.object({
  product: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID produit invalide',
      'any.required': 'Le produit est requis',
    }),

  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La description ne peut pas dépasser 500 caractères',
    }),

  quantity: Joi.number()
    .min(0.01)
    .required()
    .messages({
      'number.base': 'La quantité doit être un nombre',
      'number.min': 'La quantité doit être positive',
      'any.required': 'La quantité est requise',
    }),

  unitPrice: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Le prix unitaire doit être un nombre',
      'number.min': 'Le prix unitaire doit être positif',
      'any.required': 'Le prix unitaire est requis',
    }),

  discount: Joi.number()
    .min(0)
    .max(100)
    .default(0)
    .messages({
      'number.base': 'La remise doit être un nombre',
      'number.min': 'La remise doit être positive',
      'number.max': 'La remise ne peut pas dépasser 100%',
    }),

  discountType: Joi.string()
    .valid('percentage', 'fixed')
    .default('percentage')
    .messages({
      'any.only': 'Le type de remise doit être "percentage" ou "fixed"',
    }),

  vatRate: Joi.number()
    .min(0)
    .max(100)
    .default(18)
    .messages({
      'number.base': 'Le taux de TVA doit être un nombre',
      'number.min': 'Le taux de TVA doit être positif',
      'number.max': 'Le taux de TVA ne peut pas dépasser 100%',
    }),
});

/**
 * Schéma de validation pour la création d'une facture
 */
export const createInvoiceSchema = Joi.object({
  // Type de facture
  type: Joi.string()
    .valid('sale', 'purchase', 'proforma', 'credit_note', 'debit_note')
    .default('sale')
    .messages({
      'any.only': 'Type de facture invalide',
    }),

  // Client ou fournisseur
  customer: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .when('type', {
      is: Joi.string().valid('sale', 'proforma', 'credit_note'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.pattern.base': 'ID client invalide',
      'any.required': 'Le client est requis pour ce type de facture',
    }),

  supplier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .when('type', {
      is: Joi.string().valid('purchase', 'debit_note'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.pattern.base': 'ID fournisseur invalide',
      'any.required': 'Le fournisseur est requis pour ce type de facture',
    }),

  // Dates
  date: Joi.date()
    .default(() => new Date())
    .messages({
      'date.base': 'Date invalide',
    }),

  dueDate: Joi.date()
    .min(Joi.ref('date'))
    .optional()
    .messages({
      'date.base': 'Date d\'échéance invalide',
      'date.min': 'La date d\'échéance doit être après la date de facture',
    }),

  // Articles
  items: Joi.array()
    .items(invoiceItemSchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'Au moins un article est requis',
      'any.required': 'Les articles sont requis',
    }),

  // Remise globale
  globalDiscount: Joi.number()
    .min(0)
    .max(100)
    .default(0)
    .messages({
      'number.base': 'La remise globale doit être un nombre',
      'number.min': 'La remise globale doit être positive',
      'number.max': 'La remise globale ne peut pas dépasser 100%',
    }),

  globalDiscountType: Joi.string()
    .valid('percentage', 'fixed')
    .default('percentage')
    .messages({
      'any.only': 'Le type de remise doit être "percentage" ou "fixed"',
    }),

  // Conditions de paiement
  paymentTerms: Joi.string()
    .valid('immediate', 'net_15', 'net_30', 'net_45', 'net_60', 'custom')
    .default('net_30')
    .messages({
      'any.only': 'Conditions de paiement invalides',
    }),

  paymentMethod: Joi.string()
    .valid('cash', 'check', 'bank_transfer', 'mobile_money', 'card', 'other')
    .optional()
    .messages({
      'any.only': 'Méthode de paiement invalide',
    }),

  // Notes et références
  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Les notes ne peuvent pas dépasser 1000 caractères',
    }),

  internalNotes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Les notes internes ne peuvent pas dépasser 1000 caractères',
    }),

  reference: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La référence ne peut pas dépasser 100 caractères',
    }),

  // Taxes et frais
  shippingCost: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Les frais de livraison doivent être un nombre',
      'number.min': 'Les frais de livraison doivent être positifs',
    }),

  otherCharges: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Les autres frais doivent être un nombre',
      'number.min': 'Les autres frais doivent être positifs',
    }),

  // Pièce jointe
  attachments: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .optional()
    .messages({
      'array.max': 'Maximum 5 pièces jointes',
    }),
});

/**
 * Schéma de validation pour la mise à jour d'une facture
 */
export const updateInvoiceSchema = Joi.object({
  customer: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),

  supplier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),

  date: Joi.date()
    .optional(),

  dueDate: Joi.date()
    .optional(),

  items: Joi.array()
    .items(invoiceItemSchema)
    .min(1)
    .optional(),

  globalDiscount: Joi.number()
    .min(0)
    .max(100)
    .optional(),

  globalDiscountType: Joi.string()
    .valid('percentage', 'fixed')
    .optional(),

  paymentTerms: Joi.string()
    .valid('immediate', 'net_15', 'net_30', 'net_45', 'net_60', 'custom')
    .optional(),

  paymentMethod: Joi.string()
    .valid('cash', 'check', 'bank_transfer', 'mobile_money', 'card', 'other')
    .optional(),

  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(''),

  internalNotes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(''),

  reference: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  shippingCost: Joi.number()
    .min(0)
    .optional(),

  otherCharges: Joi.number()
    .min(0)
    .optional(),

  attachments: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .optional(),

  status: Joi.string()
    .valid('draft', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'cancelled')
    .optional()
    .messages({
      'any.only': 'Statut invalide',
    }),
});

/**
 * Schéma de validation pour valider une facture
 */
export const validateInvoiceSchema = Joi.object({
  validatedBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'ID utilisateur invalide',
    }),

  validationNotes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Les notes de validation ne peuvent pas dépasser 500 caractères',
    }),
});

/**
 * Schéma de validation pour envoyer une facture
 */
export const sendInvoiceSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email invalide',
      'any.required': 'L\'email est requis',
    }),

  subject: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Le sujet ne peut pas dépasser 200 caractères',
    }),

  message: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Le message ne peut pas dépasser 1000 caractères',
    }),

  ccEmails: Joi.array()
    .items(Joi.string().email())
    .max(5)
    .optional()
    .messages({
      'array.max': 'Maximum 5 emails en copie',
    }),
});

/**
 * Schéma de validation pour la recherche/filtrage de factures
 */
export const searchInvoiceSchema = Joi.object({
  search: Joi.string()
    .trim()
    .optional()
    .allow(''),

  type: Joi.string()
    .valid('sale', 'purchase', 'proforma', 'credit_note', 'debit_note')
    .optional(),

  status: Joi.string()
    .valid('draft', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'cancelled')
    .optional(),

  customer: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),

  supplier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),

  startDate: Joi.date()
    .optional(),

  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.min': 'La date de fin doit être après la date de début',
    }),

  minAmount: Joi.number()
    .min(0)
    .optional(),

  maxAmount: Joi.number()
    .min(0)
    .optional(),

  paymentMethod: Joi.string()
    .valid('cash', 'check', 'bank_transfer', 'mobile_money', 'card', 'other')
    .optional(),

  sortBy: Joi.string()
    .valid('number', 'date', 'dueDate', 'total', 'status', 'createdAt')
    .default('date')
    .optional(),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
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
  createInvoiceSchema,
  updateInvoiceSchema,
  validateInvoiceSchema,
  sendInvoiceSchema,
  searchInvoiceSchema,
};
