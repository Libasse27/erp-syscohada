/**
 * Controller Payment - Gestion des paiements
 */

import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';
import { generatePaymentNumber } from '../utils/invoiceNumberGenerator.js';
import { initiateMobileMoneyPayment, verifyMobileMoneyPayment } from '../services/mobileMoneyService.js';
import { createPaymentEntry } from '../services/accountingService.js';

export const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, type, method, status, dateFrom, dateTo } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const filter = { company: req.user.company };

    if (search) {
      filter.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) filter.type = type;
    if (method) filter.method = method;
    if (status) filter.status = status;

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const payments = await Payment.find(filter)
      .populate('invoice', 'number total')
      .populate('customer', 'firstName lastName companyName')
      .skip(skip)
      .limit(pageLimit)
      .sort({ date: -1 });

    const total = await Payment.countDocuments(filter);

    res.json(formatPaginatedResponse(payments, total, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('invoice', 'number total customer')
      .populate('customer', 'firstName lastName companyName email phone');

    if (!payment) {
      throw new AppError('Paiement non trouvé', 404);
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const { invoiceId, amount, method, type = 'customer_payment' } = req.body;

    // Vérifier la facture si fournie
    if (invoiceId) {
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        throw new AppError('Facture non trouvée', 404);
      }

      if (amount > invoice.amountDue) {
        throw new AppError('Le montant dépasse le solde dû', 400);
      }
    }

    // Générer le numéro de paiement
    const count = await Payment.countDocuments({ company: req.user.company });
    const transactionId = generatePaymentNumber(count + 1);

    const payment = await Payment.create({
      ...req.body,
      transactionId,
      type,
      company: req.user.company,
      processedBy: req.user.id,
    });

    // Mettre à jour la facture si paiement réussi
    if (invoiceId && payment.status === 'completed') {
      const invoice = await Invoice.findById(invoiceId);
      invoice.amountPaid += amount;
      invoice.amountDue -= amount;

      if (invoice.amountDue <= 0) {
        invoice.status = 'paid';
      } else {
        invoice.status = 'partial';
      }

      await invoice.save();

      // Générer les écritures comptables
      await createPaymentEntry(payment, req.user.id);
    }

    const populatedPayment = await Payment.findById(payment._id)
      .populate('invoice', 'number total')
      .populate('customer', 'firstName lastName companyName');

    res.status(201).json({
      success: true,
      message: 'Paiement enregistré avec succès',
      data: populatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      throw new AppError('Paiement non trouvé', 404);
    }

    // Empêcher la modification des paiements complétés
    if (payment.status === 'completed') {
      throw new AppError('Impossible de modifier un paiement complété', 400);
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('invoice', 'number total')
      .populate('customer', 'firstName lastName companyName');

    res.json({
      success: true,
      message: 'Paiement mis à jour avec succès',
      data: updatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      throw new AppError('Paiement non trouvé', 404);
    }

    if (payment.status === 'cancelled') {
      throw new AppError('Ce paiement est déjà annulé', 400);
    }

    // Annuler le paiement
    payment.status = 'cancelled';
    await payment.save();

    // Mettre à jour la facture associée
    if (payment.invoice && payment.status === 'completed') {
      const invoice = await Invoice.findById(payment.invoice);
      if (invoice) {
        invoice.amountPaid -= payment.amount;
        invoice.amountDue += payment.amount;
        invoice.status = invoice.amountDue === invoice.total ? 'pending' : 'partial';
        await invoice.save();
      }
    }

    res.json({
      success: true,
      message: 'Paiement annulé avec succès',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const initiateMobileMoney = async (req, res, next) => {
  try {
    const { provider, phoneNumber, amount, currency = 'XOF', reference } = req.body;

    const result = await initiateMobileMoneyPayment({
      provider,
      phoneNumber,
      amount,
      currency,
      reference,
    });

    res.json({
      success: true,
      message: 'Paiement Mobile Money initié',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyMobileMoney = async (req, res, next) => {
  try {
    const { provider, transactionId } = req.body;

    const result = await verifyMobileMoneyPayment(provider, transactionId);

    // Si le paiement est confirmé, mettre à jour le statut
    if (result.status === 'success') {
      const payment = await Payment.findOne({ transactionId });
      if (payment) {
        payment.status = 'completed';
        payment.metadata = { ...payment.metadata, verification: result };
        await payment.save();
      }
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const totals = await Payment.calculateTotals(
      req.user.company,
      startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1),
      endDate ? new Date(endDate) : new Date()
    );

    res.json({
      success: true,
      data: totals,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  cancelPayment,
  initiateMobileMoney,
  verifyMobileMoney,
  getPaymentStats,
};
