/**
 * Controller Invoice - Gestion des factures (ventes et achats)
 */

import Invoice from '../models/Invoice.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';
import { generateInvoiceNumber } from '../utils/invoiceNumberGenerator.js';
import { createSaleEntry, createPurchaseEntry } from '../services/accountingService.js';
import { recordStockOut } from '../services/stockService.js';

export const getInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, type, status, customerId, dateFrom, dateTo } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const filter = { company: req.user.company };

    if (search) {
      filter.$or = [
        { number: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (customerId) filter.customer = customerId;

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const invoices = await Invoice.find(filter)
      .populate('customer', 'firstName lastName companyName')
      .populate('items.product', 'name code')
      .skip(skip)
      .limit(pageLimit)
      .sort({ date: -1 });

    const total = await Invoice.countDocuments(filter);

    res.json(formatPaginatedResponse(invoices, total, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'firstName lastName companyName email phone address')
      .populate('items.product', 'name code unit');

    if (!invoice) {
      throw new AppError('Facture non trouvée', 404);
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { type = 'sale' } = req.body;

    // Générer le numéro de facture
    const count = await Invoice.countDocuments({
      company: req.user.company,
      type
    });
    const number = generateInvoiceNumber(count + 1);

    const invoice = await Invoice.create({
      ...req.body,
      number,
      type,
      company: req.user.company,
      createdBy: req.user.id,
    });

    // Si facture de vente validée, enregistrer les mouvements de stock
    if (type === 'sale' && invoice.status === 'paid') {
      for (const item of invoice.items) {
        await recordStockOut({
          productId: item.product,
          quantity: item.quantity,
          reason: `Vente - Facture ${invoice.number}`,
          referenceType: 'invoice',
          referenceId: invoice._id,
        }, req.user.id);
      }
    }

    // Générer les écritures comptables si configuré
    if (invoice.status !== 'draft') {
      await (invoice.type === 'sale' ? createSaleEntry(invoice, req.user.id) : createPurchaseEntry(invoice, req.user.id));
    }

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('customer', 'firstName lastName companyName')
      .populate('items.product', 'name code');

    res.status(201).json({
      success: true,
      message: 'Facture créée avec succès',
      data: populatedInvoice,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      throw new AppError('Facture non trouvée', 404);
    }

    // Empêcher la modification si la facture est payée
    if (invoice.status === 'paid' && req.body.status !== 'paid') {
      throw new AppError('Impossible de modifier une facture payée', 400);
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('customer', 'firstName lastName companyName')
      .populate('items.product', 'name code');

    res.json({
      success: true,
      message: 'Facture mise à jour avec succès',
      data: updatedInvoice,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      throw new AppError('Facture non trouvée', 404);
    }

    // Empêcher la suppression si la facture est payée
    if (invoice.status === 'paid') {
      throw new AppError('Impossible de supprimer une facture payée', 400);
    }

    invoice.status = 'cancelled';
    await invoice.save();

    res.json({
      success: true,
      message: 'Facture annulée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const validateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      throw new AppError('Facture non trouvée', 404);
    }

    if (invoice.status !== 'draft') {
      throw new AppError('Seules les factures brouillon peuvent être validées', 400);
    }

    invoice.status = 'pending';
    await invoice.save();

    // Générer les écritures comptables
    await (invoice.type === 'sale' ? createSaleEntry(invoice, req.user.id) : createPurchaseEntry(invoice, req.user.id));

    res.json({
      success: true,
      message: 'Facture validée avec succès',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

export const getOverdueInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.findOverdue(req.user.company);

    res.json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const revenue = await Invoice.calculateRevenue(
      req.user.company,
      startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1),
      endDate ? new Date(endDate) : new Date()
    );

    res.json({
      success: true,
      data: revenue,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  validateInvoice,
  getOverdueInvoices,
  getInvoiceStats,
};
