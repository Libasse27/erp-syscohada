/**
 * Validators pour PurchaseOrder
 */

import Joi from 'joi';

const itemSchema = Joi.object({
  product: Joi.string()
    .required()
    .messages({
      'any.required': 'Produit requis',
    }),
  description: Joi.string().allow(''),
  quantity: Joi.number()
    .min(0.01)
    .required()
    .messages({
      'number.min': 'La quantité doit être positive',
      'any.required': 'Quantité requise',
    }),
  unitPrice: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Le prix unitaire doit être positif',
      'any.required': 'Prix unitaire requis',
    }),
  tax: Joi.number().min(0).default(0),
  discount: Joi.number().min(0).default(0),
});

export const createPurchaseOrderSchema = Joi.object({
  supplier: Joi.string()
    .required()
    .messages({
      'any.required': 'Fournisseur requis',
    }),
  orderDate: Joi.date().default(Date.now),
  expectedDate: Joi.date(),
  items: Joi.array()
    .items(itemSchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'Au moins un article requis',
      'any.required': 'Articles requis',
    }),
  status: Joi.string().valid('draft', 'sent', 'approved', 'received', 'cancelled').default('draft'),
  notes: Joi.string().allow(''),
  reference: Joi.string().allow(''),
});

export const updatePurchaseOrderSchema = Joi.object({
  supplier: Joi.string(),
  orderDate: Joi.date(),
  expectedDate: Joi.date(),
  items: Joi.array().items(itemSchema).min(1),
  status: Joi.string().valid('draft', 'sent', 'approved', 'received', 'cancelled'),
  notes: Joi.string().allow(''),
  reference: Joi.string().allow(''),
});
