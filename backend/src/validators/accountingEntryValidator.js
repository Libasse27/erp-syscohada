/**
 * Validators pour AccountingEntry (Écritures comptables)
 */

import Joi from 'joi';

const lineSchema = Joi.object({
  account: Joi.string()
    .required()
    .messages({
      'any.required': 'Compte requis',
    }),
  label: Joi.string()
    .required()
    .messages({
      'any.required': 'Libellé requis',
    }),
  debit: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'Le débit doit être positif',
    }),
  credit: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'Le crédit doit être positif',
    }),
  analyticAccount: Joi.string().allow(''),
})
  .custom((value, helpers) => {
    if (value.debit === 0 && value.credit === 0) {
      return helpers.error('custom.zeroAmount');
    }
    if (value.debit > 0 && value.credit > 0) {
      return helpers.error('custom.bothAmounts');
    }
    return value;
  }, 'line validation')
  .messages({
    'custom.zeroAmount': 'Une ligne doit avoir un montant en débit ou crédit',
    'custom.bothAmounts': 'Une ligne ne peut pas avoir à la fois débit et crédit',
  });

export const createAccountingEntrySchema = Joi.object({
  journal: Joi.string()
    .required()
    .messages({
      'any.required': 'Journal requis',
    }),
  fiscalYear: Joi.string()
    .required()
    .messages({
      'any.required': 'Exercice fiscal requis',
    }),
  date: Joi.date()
    .default(Date.now)
    .required()
    .messages({
      'any.required': 'Date requise',
    }),
  reference: Joi.string().allow(''),
  description: Joi.string()
    .required()
    .messages({
      'any.required': 'Description requise',
    }),
  lines: Joi.array()
    .items(lineSchema)
    .min(2)
    .required()
    .messages({
      'array.min': 'Au moins 2 lignes requises',
      'any.required': 'Lignes requises',
    })
    .custom((value, helpers) => {
      const totalDebit = value.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = value.reduce((sum, line) => sum + line.credit, 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return helpers.error('custom.unbalanced', { totalDebit, totalCredit });
      }

      return value;
    }, 'balance validation')
    .messages({
      'custom.unbalanced': 'L\'écriture n\'est pas équilibrée (débit ≠ crédit)',
    }),
  status: Joi.string().valid('draft', 'validated').default('draft'),
});

export const updateAccountingEntrySchema = Joi.object({
  date: Joi.date(),
  reference: Joi.string().allow(''),
  description: Joi.string(),
  lines: Joi.array()
    .items(lineSchema)
    .min(2)
    .custom((value, helpers) => {
      const totalDebit = value.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = value.reduce((sum, line) => sum + line.credit, 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return helpers.error('custom.unbalanced');
      }

      return value;
    }, 'balance validation')
    .messages({
      'custom.unbalanced': 'L\'écriture n\'est pas équilibrée',
    }),
});
