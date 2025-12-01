/**
 * Validators pour les paiements
 * Validation des données avec Joi
 */

import Joi from 'joi';

/**
 * Schéma de validation pour la création d'un paiement
 */
export const createPaymentSchema = Joi.object({
  // Type de paiement
  type: Joi.string()
    .valid('customer_payment', 'supplier_payment', 'expense', 'income', 'transfer')
    .required()
    .messages({
      'any.only': 'Type de paiement invalide',
      'any.required': 'Le type de paiement est requis',
    }),

  // Facture ou document lié
  invoice: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .when('type', {
      is: Joi.string().valid('customer_payment', 'supplier_payment'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.pattern.base': 'ID facture invalide',
      'any.required': 'La facture est requise pour ce type de paiement',
    }),

  // Client ou fournisseur
  customer: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .when('type', {
      is: 'customer_payment',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.pattern.base': 'ID client invalide',
      'any.required': 'Le client est requis pour un paiement client',
    }),

  supplier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .when('type', {
      is: 'supplier_payment',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.pattern.base': 'ID fournisseur invalide',
      'any.required': 'Le fournisseur est requis pour un paiement fournisseur',
    }),

  // Montant
  amount: Joi.number()
    .min(0.01)
    .required()
    .messages({
      'number.base': 'Le montant doit être un nombre',
      'number.min': 'Le montant doit être supérieur à 0',
      'any.required': 'Le montant est requis',
    }),

  currency: Joi.string()
    .valid('XOF', 'EUR', 'USD')
    .default('XOF')
    .messages({
      'any.only': 'Devise invalide',
    }),

  // Date et référence
  date: Joi.date()
    .max('now')
    .default(() => new Date())
    .messages({
      'date.base': 'Date invalide',
      'date.max': 'La date ne peut pas être dans le futur',
    }),

  reference: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La référence ne peut pas dépasser 100 caractères',
    }),

  // Méthode de paiement
  method: Joi.string()
    .valid('cash', 'check', 'bank_transfer', 'mobile_money', 'card', 'other')
    .required()
    .messages({
      'any.only': 'Méthode de paiement invalide',
      'any.required': 'La méthode de paiement est requise',
    }),

  // Détails spécifiques selon la méthode
  checkNumber: Joi.string()
    .trim()
    .when('method', {
      is: 'check',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'any.required': 'Le numéro de chèque est requis',
    }),

  checkDate: Joi.date()
    .when('method', {
      is: 'check',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'date.base': 'Date de chèque invalide',
      'any.required': 'La date du chèque est requise',
    }),

  bankName: Joi.string()
    .trim()
    .max(100)
    .when('method', {
      is: Joi.string().valid('check', 'bank_transfer'),
      then: Joi.optional(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.max': 'Le nom de la banque ne peut pas dépasser 100 caractères',
    }),

  // Mobile Money spécifique (Orange Money, Wave, Free Money)
  mobileMoneyProvider: Joi.string()
    .valid('orange_money', 'wave', 'free_money', 'other')
    .when('method', {
      is: 'mobile_money',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'any.only': 'Opérateur Mobile Money invalide',
      'any.required': 'L\'opérateur Mobile Money est requis',
    }),

  mobileMoneyNumber: Joi.string()
    .trim()
    .pattern(/^(\+221|00221)?[0-9]{9}$/)
    .when('method', {
      is: 'mobile_money',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.pattern.base': 'Numéro Mobile Money invalide (format sénégalais)',
      'any.required': 'Le numéro Mobile Money est requis',
    }),

  mobileMoneyTransactionId: Joi.string()
    .trim()
    .max(100)
    .when('method', {
      is: 'mobile_money',
      then: Joi.optional(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.max': 'L\'ID de transaction ne peut pas dépasser 100 caractères',
    }),

  // Carte bancaire
  cardLastDigits: Joi.string()
    .trim()
    .pattern(/^[0-9]{4}$/)
    .when('method', {
      is: 'card',
      then: Joi.optional(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.pattern.base': 'Les 4 derniers chiffres doivent être au format 0000',
    }),

  cardType: Joi.string()
    .valid('visa', 'mastercard', 'american_express', 'other')
    .when('method', {
      is: 'card',
      then: Joi.optional(),
      otherwise: Joi.optional(),
    }),

  // Compte bancaire
  bankAccount: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .when('method', {
      is: Joi.string().valid('bank_transfer', 'check'),
      then: Joi.optional(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.pattern.base': 'ID compte bancaire invalide',
    }),

  // Notes et description
  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Les notes ne peuvent pas dépasser 1000 caractères',
    }),

  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'La description ne peut pas dépasser 500 caractères',
    }),

  // Pièces jointes (reçus, justificatifs)
  attachments: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .optional()
    .messages({
      'array.max': 'Maximum 5 pièces jointes',
    }),

  // Statut
  status: Joi.string()
    .valid('pending', 'completed', 'failed', 'cancelled')
    .default('completed')
    .messages({
      'any.only': 'Statut invalide',
    }),
});

/**
 * Schéma de validation pour la mise à jour d'un paiement
 */
export const updatePaymentSchema = Joi.object({
  date: Joi.date()
    .max('now')
    .optional(),

  reference: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  checkNumber: Joi.string()
    .trim()
    .optional(),

  checkDate: Joi.date()
    .optional(),

  bankName: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  mobileMoneyTransactionId: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(''),

  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(''),

  description: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(''),

  attachments: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .optional(),

  status: Joi.string()
    .valid('pending', 'completed', 'failed', 'cancelled')
    .optional(),
});

/**
 * Schéma de validation pour valider un paiement
 */
export const validatePaymentSchema = Joi.object({
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
 * Schéma de validation pour un remboursement
 */
export const refundPaymentSchema = Joi.object({
  amount: Joi.number()
    .min(0.01)
    .required()
    .messages({
      'number.base': 'Le montant du remboursement doit être un nombre',
      'number.min': 'Le montant doit être supérieur à 0',
      'any.required': 'Le montant du remboursement est requis',
    }),

  reason: Joi.string()
    .trim()
    .max(500)
    .required()
    .messages({
      'string.empty': 'La raison du remboursement est requise',
      'string.max': 'La raison ne peut pas dépasser 500 caractères',
      'any.required': 'La raison du remboursement est requise',
    }),

  method: Joi.string()
    .valid('cash', 'check', 'bank_transfer', 'mobile_money', 'card', 'original')
    .default('original')
    .messages({
      'any.only': 'Méthode de remboursement invalide',
    }),

  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(''),
});

/**
 * Schéma de validation pour un transfert entre comptes
 */
export const transferSchema = Joi.object({
  fromAccount: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID compte source invalide',
      'any.required': 'Le compte source est requis',
    }),

  toAccount: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID compte destination invalide',
      'any.required': 'Le compte destination est requis',
    }),

  amount: Joi.number()
    .min(0.01)
    .required()
    .messages({
      'number.base': 'Le montant doit être un nombre',
      'number.min': 'Le montant doit être supérieur à 0',
      'any.required': 'Le montant est requis',
    }),

  date: Joi.date()
    .max('now')
    .default(() => new Date()),

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

  fees: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Les frais doivent être un nombre',
      'number.min': 'Les frais doivent être positifs',
    }),
});

/**
 * Schéma de validation pour la recherche de paiements
 */
export const searchPaymentSchema = Joi.object({
  search: Joi.string()
    .trim()
    .optional()
    .allow(''),

  type: Joi.string()
    .valid('customer_payment', 'supplier_payment', 'expense', 'income', 'transfer')
    .optional(),

  method: Joi.string()
    .valid('cash', 'check', 'bank_transfer', 'mobile_money', 'card', 'other')
    .optional(),

  status: Joi.string()
    .valid('pending', 'completed', 'failed', 'cancelled')
    .optional(),

  customer: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),

  supplier: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),

  invoice: Joi.string()
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

  mobileMoneyProvider: Joi.string()
    .valid('orange_money', 'wave', 'free_money', 'other')
    .optional(),

  sortBy: Joi.string()
    .valid('date', 'amount', 'reference', 'status', 'createdAt')
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

/**
 * Schéma de validation pour réconciliation bancaire
 */
export const reconciliationSchema = Joi.object({
  bankAccount: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID compte bancaire invalide',
      'any.required': 'Le compte bancaire est requis',
    }),

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

  statementBalance: Joi.number()
    .required()
    .messages({
      'number.base': 'Le solde du relevé doit être un nombre',
      'any.required': 'Le solde du relevé est requis',
    }),

  reconciledPayments: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      'string.pattern.base': 'ID paiement invalide',
    }),
});

export default {
  createPaymentSchema,
  updatePaymentSchema,
  validatePaymentSchema,
  refundPaymentSchema,
  transferSchema,
  searchPaymentSchema,
  reconciliationSchema,
};
