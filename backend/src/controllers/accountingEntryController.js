/**
 * Controller AccountingEntry - Gestion des écritures comptables
 */

import AccountingEntry from '../models/AccountingEntry.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';
import { generateEntryNumber } from '../utils/invoiceNumberGenerator.js';

export const getAccountingEntries = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, journalId, status, dateFrom, dateTo } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const filter = { company: req.user.company };

    if (search) {
      filter.$or = [
        { number: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (journalId) filter.journal = journalId;
    if (status) filter.status = status;

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const entries = await AccountingEntry.find(filter)
      .populate('journal', 'code name')
      .populate('fiscalYear', 'year')
      .populate('lines.account', 'code label')
      .skip(skip)
      .limit(pageLimit)
      .sort({ date: -1, number: -1 });

    const total = await AccountingEntry.countDocuments(filter);

    res.json(formatPaginatedResponse(entries, total, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getAccountingEntryById = async (req, res, next) => {
  try {
    const entry = await AccountingEntry.findById(req.params.id)
      .populate('journal', 'code name')
      .populate('fiscalYear', 'year')
      .populate('lines.account', 'code label type')
      .populate('createdBy', 'firstName lastName');

    if (!entry) {
      throw new AppError('Écriture comptable non trouvée', 404);
    }

    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

export const createAccountingEntry = async (req, res, next) => {
  try {
    // Générer le numéro d'écriture
    const count = await AccountingEntry.countDocuments({
      company: req.user.company,
      journal: req.body.journal,
    });
    const number = generateEntryNumber(count + 1);

    const entry = await AccountingEntry.create({
      ...req.body,
      number,
      company: req.user.company,
      createdBy: req.user.id,
    });

    const populatedEntry = await AccountingEntry.findById(entry._id)
      .populate('journal', 'code name')
      .populate('fiscalYear', 'year')
      .populate('lines.account', 'code label');

    res.status(201).json({
      success: true,
      message: 'Écriture comptable créée avec succès',
      data: populatedEntry,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccountingEntry = async (req, res, next) => {
  try {
    const entry = await AccountingEntry.findById(req.params.id);

    if (!entry) {
      throw new AppError('Écriture comptable non trouvée', 404);
    }

    // Empêcher la modification si l'écriture est validée
    if (entry.status === 'validated') {
      throw new AppError('Impossible de modifier une écriture validée', 400);
    }

    const updatedEntry = await AccountingEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('journal', 'code name')
      .populate('fiscalYear', 'year')
      .populate('lines.account', 'code label');

    res.json({
      success: true,
      message: 'Écriture comptable mise à jour avec succès',
      data: updatedEntry,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccountingEntry = async (req, res, next) => {
  try {
    const entry = await AccountingEntry.findById(req.params.id);

    if (!entry) {
      throw new AppError('Écriture comptable non trouvée', 404);
    }

    // Empêcher la suppression si l'écriture est validée
    if (entry.status === 'validated') {
      throw new AppError('Impossible de supprimer une écriture validée', 400);
    }

    await entry.deleteOne();

    res.json({
      success: true,
      message: 'Écriture comptable supprimée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const validateAccountingEntry = async (req, res, next) => {
  try {
    const entry = await AccountingEntry.findById(req.params.id);

    if (!entry) {
      throw new AppError('Écriture comptable non trouvée', 404);
    }

    if (entry.status === 'validated') {
      throw new AppError('Cette écriture est déjà validée', 400);
    }

    // Valider l'équilibre
    if (!entry.isBalanced) {
      throw new AppError('L\'écriture n\'est pas équilibrée', 400);
    }

    entry.status = 'validated';
    entry.validatedBy = req.user.id;
    entry.validatedAt = new Date();
    await entry.save();

    res.json({
      success: true,
      message: 'Écriture comptable validée avec succès',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

export const getEntriesByPeriod = async (req, res, next) => {
  try {
    const { startDate, endDate, journalId } = req.query;

    const filter = {
      company: req.user.company,
      status: 'validated',
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (journalId) filter.journal = journalId;

    const entries = await AccountingEntry.find(filter)
      .populate('journal', 'code name')
      .populate('lines.account', 'code label')
      .sort({ date: 1, number: 1 });

    res.json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAccountingEntries,
  getAccountingEntryById,
  createAccountingEntry,
  updateAccountingEntry,
  deleteAccountingEntry,
  validateAccountingEntry,
  getEntriesByPeriod,
};
