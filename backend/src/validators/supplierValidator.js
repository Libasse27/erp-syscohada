/**
 * Validators pour Supplier
 */

import Joi from 'joi';

export const createSupplierValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'any.required': 'Nom requis',
    }),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    postalCode: Joi.string().allow(''),
    country: Joi.string().default('Sénégal'),
  }),
  ninea: Joi.string().pattern(/^[0-9]{10}$/),
  rc: Joi.string().allow(''),
  category: Joi.string().allow(''),
  paymentTerms: Joi.number().min(0).default(30),
  taxExempt: Joi.boolean().default(false),
  bankAccount: Joi.object({
    accountNumber: Joi.string().allow(''),
    bankName: Joi.string().allow(''),
    iban: Joi.string().allow(''),
    swift: Joi.string().allow(''),
  }),
});

export const updateSupplierValidator = Joi.object({
  name: Joi.string().min(2).max(200),
  email: Joi.string().email(),
  phone: Joi.string(),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    postalCode: Joi.string().allow(''),
    country: Joi.string(),
  }),
  ninea: Joi.string().pattern(/^[0-9]{10}$/),
  rc: Joi.string().allow(''),
  category: Joi.string().allow(''),
  paymentTerms: Joi.number().min(0),
  taxExempt: Joi.boolean(),
  bankAccount: Joi.object({
    accountNumber: Joi.string().allow(''),
    bankName: Joi.string().allow(''),
    iban: Joi.string().allow(''),
    swift: Joi.string().allow(''),
  }),
});
