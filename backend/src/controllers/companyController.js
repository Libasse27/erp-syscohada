/**
 * Controller Company - Gestion des entreprises
 */

import Company from '../models/Company.js';
import { AppError } from '../middlewares/errorMiddleware.js';

/**
 * Obtenir l'entreprise courante
 */
export const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.company);

    if (!company) {
      throw new AppError('Entreprise non trouvée', 404);
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour l'entreprise
 */
export const updateCompany = async (req, res, next) => {
  try {
    const {
      name,
      legalName,
      logo,
      industry,
      description,
      email,
      phone,
      fax,
      website,
      address,
      city,
      postalCode,
      region,
      country,
      ninea,
      rc,
      taxId,
      legalForm,
      fiscalYearStart,
      currency,
      vatRate,
      bankName,
      bankAccountNumber,
      iban,
      swift,
      settings,
    } = req.body;

    const company = await Company.findById(req.user.company);

    if (!company) {
      throw new AppError('Entreprise non trouvée', 404);
    }

    // Mettre à jour les champs
    if (name) company.name = name;
    if (legalName) company.legalName = legalName;
    if (logo) company.logo = logo;
    if (industry) company.industry = industry;
    if (description) company.description = description;
    if (email) company.email = email;
    if (phone) company.phone = phone;
    if (fax) company.fax = fax;
    if (website) company.website = website;
    if (address) company.address = address;
    if (city) company.city = city;
    if (postalCode) company.postalCode = postalCode;
    if (region) company.region = region;
    if (country) company.country = country;
    if (ninea) company.ninea = ninea;
    if (rc) company.rc = rc;
    if (taxId) company.taxId = taxId;
    if (legalForm) company.legalForm = legalForm;
    if (fiscalYearStart) company.fiscalYearStart = fiscalYearStart;
    if (currency) company.currency = currency;
    if (vatRate !== undefined) company.vatRate = vatRate;
    if (bankName) company.bankName = bankName;
    if (bankAccountNumber) company.bankAccountNumber = bankAccountNumber;
    if (iban) company.iban = iban;
    if (swift) company.swift = swift;
    if (settings) company.settings = { ...company.settings, ...settings };

    await company.save();

    res.json({
      success: true,
      message: 'Entreprise mise à jour avec succès',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir les paramètres de l'entreprise
 */
export const getSettings = async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.company).select('settings');

    if (!company) {
      throw new AppError('Entreprise non trouvée', 404);
    }

    res.json({
      success: true,
      data: company.settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour les paramètres de l'entreprise
 */
export const updateSettings = async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.company);

    if (!company) {
      throw new AppError('Entreprise non trouvée', 404);
    }

    company.settings = { ...company.settings, ...req.body };
    await company.save();

    res.json({
      success: true,
      message: 'Paramètres mis à jour avec succès',
      data: company.settings,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCompany,
  updateCompany,
  getSettings,
  updateSettings,
};
