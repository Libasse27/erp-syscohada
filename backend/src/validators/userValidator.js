/**
 * Validators pour User
 */

import Joi from 'joi';

export const createUserValidator = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email invalide',
      'any.required': 'Email requis',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'any.required': 'Mot de passe requis',
    }),
  firstName: Joi.string()
    .required()
    .messages({
      'any.required': 'Prénom requis',
    }),
  lastName: Joi.string()
    .required()
    .messages({
      'any.required': 'Nom requis',
    }),
  role: Joi.string()
    .valid('admin', 'manager', 'accountant', 'sales', 'user')
    .default('user'),
  permissions: Joi.array().items(Joi.string()),
  phone: Joi.string().allow(''),
});

export const updateUserValidator = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  role: Joi.string().valid('admin', 'manager', 'accountant', 'sales', 'user'),
  permissions: Joi.array().items(Joi.string()),
  phone: Joi.string().allow(''),
  isActive: Joi.boolean(),
});
