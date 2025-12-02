/**
 * Controller Account - Gestion du plan comptable SYSCOHADA
 */

import Account from '../models/Account.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';
import { isValidSyscohadaCode, SYSCOHADA_MAIN_ACCOUNTS } from '../utils/syscohadaHelper.js';

export const getAccounts = async (req, res, next) => {
  try {
    const { page = 1, limit = 100, search, class: accountClass, type } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const filter = { company: req.user.company, isActive: true };

    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { label: { $regex: search, $options: 'i' } },
      ];
    }

    if (accountClass) {
      filter.class = parseInt(accountClass);
    }

    if (type) filter.type = type;

    const accounts = await Account.find(filter)
      .skip(skip)
      .limit(pageLimit)
      .sort({ code: 1 });

    const total = await Account.countDocuments(filter);

    res.json(formatPaginatedResponse(accounts, total, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getAccountById = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      throw new AppError('Compte non trouvé', 404);
    }

    res.json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
};

export const getAccountByCode = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      company: req.user.company,
      code: req.params.code,
    });

    if (!account) {
      throw new AppError('Compte non trouvé', 404);
    }

    res.json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
};

export const createAccount = async (req, res, next) => {
  try {
    const { code } = req.body;

    // Valider le code SYSCOHADA
    if (!isValidSyscohadaCode(code)) {
      throw new AppError('Code compte SYSCOHADA invalide', 400);
    }

    // Vérifier si le compte existe déjà
    const existing = await Account.findOne({
      company: req.user.company,
      code,
    });

    if (existing) {
      throw new AppError('Un compte avec ce code existe déjà', 400);
    }

    const account = await Account.create({
      ...req.body,
      company: req.user.company,
    });

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      throw new AppError('Compte non trouvé', 404);
    }

    // Empêcher la modification du code
    if (req.body.code && req.body.code !== account.code) {
      throw new AppError('Le code du compte ne peut pas être modifié', 400);
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Compte mis à jour avec succès',
      data: updatedAccount,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      throw new AppError('Compte non trouvé', 404);
    }

    // Vérifier si le compte est utilisé dans des écritures
    const hasEntries = await account.hasEntries();
    if (hasEntries) {
      throw new AppError('Impossible de supprimer un compte utilisé dans des écritures', 400);
    }

    account.isActive = false;
    await account.save();

    res.json({
      success: true,
      message: 'Compte supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountBalance = async (req, res, next) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      throw new AppError('Compte non trouvé', 404);
    }

    const { startDate, endDate } = req.query;
    const balance = await account.getBalance(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    res.json({
      success: true,
      data: {
        account: {
          code: account.code,
          label: account.label,
        },
        balance,
      },
    });
  } catch (error) {
    next(error);
  }
};


export default {
  getAccounts,
  getAccountById,
  getAccountByCode,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountBalance,
};
