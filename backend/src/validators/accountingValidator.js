/**
 * Validators pour la comptabilité SYSCOHADA
 * Validation des données comptables avec Joi
 */

import Joi from 'joi';

/**
 * Schéma de validation pour un compte comptable
 */
export const createAccountSchema = Joi.object({
  code: Joi.string()
    .trim()
    .pattern(/^[1-8][0-9]{0,6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Le code compte SYSCOHADA doit commencer par 1-8 et contenir jusqu\'à 7 chiffres',
      'any.required': 'Le code compte est requis',
    }),

  label: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Le libellé du compte est requis',
      'string.min': 'Le libellé doit contenir au moins 2 caractères',
      'string.max': 'Le libellé ne peut pas dépasser 200 caractères',
      'any.required': 'Le libellé du compte est requis',
    }),

  type: Joi.string()
    .valid('asset', 'liability', 'equity', 'revenue', 'expense')
    .required()
    .messages({
      'any.only': 'Le type de compte doit être: asset, liability, equity, revenue ou expense',
      'any.required': 'Le type de compte est requis',
    }),

  class: Joi.number()
    .integer()
    .min(1)
    .max(8)
    .required()
    .messages({
      'number.base': 'La classe doit être un nombre',
      'number.integer': 'La classe doit être un nombre entier',
      'number.min': 'La classe doit être entre 1 et 8',
      'number.max': 'La classe doit être entre 1 et 8',
      'any.required': 'La classe SYSCOHADA est requise',
    }),

  parent: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null)
    .messages({
      'string.pattern.base': 'ID compte parent invalide',
    }),

  description: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La description ne peut pas dépasser 1000 caractères',
    }),

  isActive: Joi.boolean()
    .default(true),

  isSystem: Joi.boolean()
    .default(false),
});

/**
 * Schéma de validation pour une ligne d'écriture comptable
 */
const entryLineSchema = Joi.object({
  account: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID compte invalide',
      'any.required': 'Le compte est requis',
    }),

  label: Joi.string()
    .trim()
    .max(200)
    .required()
    .messages({
      'string.empty': 'Le libellé est requis',
      'string.max': 'Le libellé ne peut pas dépasser 200 caractères',
      'any.required': 'Le libellé est requis',
    }),

  debit: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Le débit doit être un nombre',
      'number.min': 'Le débit doit être positif',
    }),

  credit: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Le crédit doit être un nombre',
      'number.min': 'Le crédit doit être positif',
    }),

  reference: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La référence ne peut pas dépasser 100 caractères',
    }),
}).custom((value, helpers) => {
  // Validation: une ligne ne peut avoir à la fois débit ET crédit
  if (value.debit > 0 && value.credit > 0) {
    return helpers.error('custom.debitAndCredit');
  }
  // Validation: une ligne doit avoir soit débit soit crédit
  if (value.debit === 0 && value.credit === 0) {
    return helpers.error('custom.noAmount');
  }
  return value;
}, 'Validation débit/crédit').messages({
  'custom.debitAndCredit': 'Une ligne ne peut pas avoir à la fois un débit et un crédit',
  'custom.noAmount': 'Une ligne doit avoir soit un débit soit un crédit',
});

/**
 * Schéma de validation pour une écriture comptable
 */
export const createEntrySchema = Joi.object({
  date: Joi.date()
    .max('now')
    .default(() => new Date())
    .messages({
      'date.base': 'Date invalide',
      'date.max': 'La date ne peut pas être dans le futur',
    }),

  journal: Joi.string()
    .valid('sales', 'purchases', 'cash', 'bank', 'operations', 'miscellaneous')
    .required()
    .messages({
      'any.only': 'Journal invalide',
      'any.required': 'Le journal est requis',
    }),

  reference: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La référence ne peut pas dépasser 100 caractères',
    }),

  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La description ne peut pas dépasser 500 caractères',
    }),

  lines: Joi.array()
    .items(entryLineSchema)
    .min(2)
    .required()
    .messages({
      'array.min': 'Au moins 2 lignes sont requises (débit et crédit)',
      'any.required': 'Les lignes d\'écriture sont requises',
    })
    .custom((value, helpers) => {
      // Validation: somme des débits = somme des crédits
      const totalDebit = value.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = value.reduce((sum, line) => sum + line.credit, 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) { // Tolérance de 0.01 pour les arrondis
        return helpers.error('custom.unbalanced', { totalDebit, totalCredit });
      }

      return value;
    }, 'Validation équilibre débit/crédit').messages({
      'custom.unbalanced': 'L\'écriture n\'est pas équilibrée. Débit: {{#totalDebit}}, Crédit: {{#totalCredit}}',
    }),

  relatedDocument: Joi.object({
    type: Joi.string()
      .valid('invoice', 'payment', 'receipt', 'purchase_order', 'other')
      .required(),
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  }).optional(),

  attachments: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .optional()
    .messages({
      'array.max': 'Maximum 5 pièces jointes',
    }),
});

/**
 * Schéma de validation pour la mise à jour d'une écriture
 */
export const updateEntrySchema = Joi.object({
  date: Joi.date()
    .max('now')
    .optional(),

  reference: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(''),

  lines: Joi.array()
    .items(entryLineSchema)
    .min(2)
    .optional()
    .custom((value, helpers) => {
      if (!value) return value;

      const totalDebit = value.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = value.reduce((sum, line) => sum + line.credit, 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return helpers.error('custom.unbalanced');
      }

      return value;
    }),

  attachments: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .optional(),
});

/**
 * Schéma de validation pour clôturer une période
 */
export const closePeriodSchema = Joi.object({
  period: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
    .required()
    .messages({
      'string.pattern.base': 'Format de période invalide (YYYY-MM)',
      'any.required': 'La période est requise',
    }),

  closedBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'ID utilisateur invalide',
    }),

  notes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Les notes ne peuvent pas dépasser 500 caractères',
    }),
});

/**
 * Schéma de validation pour le grand livre
 */
export const ledgerQuerySchema = Joi.object({
  account: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'ID compte invalide',
    }),

  startDate: Joi.date()
    .optional(),

  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.min': 'La date de fin doit être après la date de début',
    }),

  journal: Joi.string()
    .valid('sales', 'purchases', 'cash', 'bank', 'operations', 'miscellaneous')
    .optional(),

  includeOpening: Joi.boolean()
    .default(true),

  includeClosing: Joi.boolean()
    .default(true),
});

/**
 * Schéma de validation pour le bilan
 */
export const balanceSheetSchema = Joi.object({
  date: Joi.date()
    .default(() => new Date())
    .messages({
      'date.base': 'Date invalide',
    }),

  comparative: Joi.boolean()
    .default(false),

  comparativeDate: Joi.date()
    .when('comparative', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'date.base': 'Date de comparaison invalide',
      'any.required': 'La date de comparaison est requise en mode comparatif',
    }),

  format: Joi.string()
    .valid('syscohada', 'simplified', 'detailed')
    .default('syscohada')
    .messages({
      'any.only': 'Format invalide',
    }),
});

/**
 * Schéma de validation pour le compte de résultat
 */
export const incomeStatementSchema = Joi.object({
  startDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Date de début invalide',
      'any.required': 'La date de début est requise',
    }),

  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .required()
    .messages({
      'date.base': 'Date de fin invalide',
      'date.min': 'La date de fin doit être après la date de début',
      'any.required': 'La date de fin est requise',
    }),

  comparative: Joi.boolean()
    .default(false),

  format: Joi.string()
    .valid('syscohada', 'nature', 'function')
    .default('syscohada')
    .messages({
      'any.only': 'Format invalide',
    }),
});

/**
 * Schéma de validation pour la recherche d'écritures
 */
export const searchEntrySchema = Joi.object({
  search: Joi.string()
    .trim()
    .optional()
    .allow(''),

  journal: Joi.string()
    .valid('sales', 'purchases', 'cash', 'bank', 'operations', 'miscellaneous')
    .optional(),

  account: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),

  startDate: Joi.date()
    .optional(),

  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .optional(),

  status: Joi.string()
    .valid('draft', 'posted', 'validated', 'cancelled')
    .optional(),

  minAmount: Joi.number()
    .min(0)
    .optional(),

  maxAmount: Joi.number()
    .min(0)
    .optional(),

  sortBy: Joi.string()
    .valid('date', 'number', 'amount', 'createdAt')
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
  createAccountSchema,
  createEntrySchema,
  updateEntrySchema,
  closePeriodSchema,
  ledgerQuerySchema,
  balanceSheetSchema,
  incomeStatementSchema,
  searchEntrySchema,
};
