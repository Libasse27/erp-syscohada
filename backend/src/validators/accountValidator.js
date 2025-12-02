/**
 * Validators pour Account (Plan comptable SYSCOHADA)
 */

import Joi from 'joi';

export const createAccountSchema = Joi.object({
  code: Joi.string()
    .pattern(/^[1-8][0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Code compte SYSCOHADA invalide (7 chiffres, classe 1-8)',
      'any.required': 'Code compte requis',
    }),
  label: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Le libellé doit contenir au moins 3 caractères',
      'any.required': 'Libellé requis',
    }),
  type: Joi.string()
    .valid('asset', 'liability', 'equity', 'revenue', 'expense')
    .required()
    .messages({
      'any.required': 'Type requis',
    }),
  class: Joi.number()
    .min(1)
    .max(8)
    .required()
    .messages({
      'number.min': 'Classe doit être entre 1 et 8',
      'number.max': 'Classe doit être entre 1 et 8',
      'any.required': 'Classe requise',
    }),
  description: Joi.string().allow(''),
  parent: Joi.string().allow(null),
  isGroup: Joi.boolean().default(false),
});

export const updateAccountSchema = Joi.object({
  label: Joi.string().min(3).max(200),
  description: Joi.string().allow(''),
  parent: Joi.string().allow(null),
  isGroup: Joi.boolean(),
});
