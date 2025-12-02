/**
 * Validators pour Company
 */

import Joi from 'joi';

export const updateCompanyValidator = Joi.object({
  name: Joi.string().min(2).max(100),
  legalForm: Joi.string().valid(
    'SARL',
    'SA',
    'SAS',
    'SASU',
    'EI',
    'SNC',
    'SCS',
    'SUARL',
    'GIE'
  ),
  ninea: Joi.string().pattern(/^[0-9]{10}$/),
  rc: Joi.string(),
  address: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    postalCode: Joi.string().allow(''),
    country: Joi.string().default('Sénégal'),
  }),
  phone: Joi.string(),
  email: Joi.string().email(),
  website: Joi.string().uri().allow(''),
  logo: Joi.string().uri().allow(''),
  taxSystem: Joi.string().valid('normal', 'simplified', 'exempted'),
  defaultCurrency: Joi.string().valid('XOF', 'EUR', 'USD'),
  defaultVATRate: Joi.number().min(0).max(100),
  syscohadaConfig: Joi.object({
    fiscalYearStartMonth: Joi.number().min(1).max(12),
    accountingPlan: Joi.string().valid('syscohada_revised', 'syscohada_classic'),
    useAnalyticAccounting: Joi.boolean(),
  }),
});
