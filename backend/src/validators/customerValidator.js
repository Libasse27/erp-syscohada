/**
 * Validators pour Customer
 */

import Joi from 'joi';

export const createCustomerValidator = Joi.object({
  type: Joi.string()
    .valid('individual', 'company')
    .required()
    .messages({
      'any.required': 'Type requis',
    }),
  firstName: Joi.string().when('type', {
    is: 'individual',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  lastName: Joi.string().when('type', {
    is: 'individual',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  companyName: Joi.string().when('type', {
    is: 'company',
    then: Joi.required(),
    otherwise: Joi.optional(),
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
  category: Joi.string().allow(null),
  paymentTerms: Joi.number().min(0).default(30),
  creditLimit: Joi.number().min(0).default(0),
  taxExempt: Joi.boolean().default(false),
});

export const updateCustomerValidator = Joi.object({
  type: Joi.string().valid('individual', 'company'),
  firstName: Joi.string(),
  lastName: Joi.string(),
  companyName: Joi.string(),
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
  category: Joi.string().allow(null),
  paymentTerms: Joi.number().min(0),
  creditLimit: Joi.number().min(0),
  taxExempt: Joi.boolean(),
});
