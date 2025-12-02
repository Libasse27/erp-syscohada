/**
 * Validators pour Category
 */

import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'any.required': 'Nom requis',
    }),
  description: Joi.string().allow(''),
  type: Joi.string()
    .valid('product', 'service')
    .required()
    .messages({
      'any.required': 'Type requis',
      'any.only': 'Type doit être "product" ou "service"',
    }),
  parent: Joi.string().allow(null),
  image: Joi.string().uri().allow(''),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().allow(''),
  type: Joi.string().valid('product', 'service'),
  parent: Joi.string().allow(null),
  image: Joi.string().uri().allow(''),
});
