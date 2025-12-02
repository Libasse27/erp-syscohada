/**
 * Controller Report - Gestion des rapports et exports
 */

import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import {
  generateSalesReport,
  generateCashFlowReport,
  generateStockReport,
  generateProfitabilityReport,
} from '../services/reportService.js';
import {
  generateBalanceSheet,
  generateIncomeStatement,
} from '../services/accountingService.js';
import { generateInvoice as generateInvoicePDF } from '../services/pdfService.js';
import {
  exportInvoices,
  exportPayments,
  exportProducts,
} from '../services/excelService.js';

export const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Les dates de début et fin sont requises', 400);
    }

    const report = await generateSalesReport(
      req.user.company,
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getCashFlowReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Les dates de début et fin sont requises', 400);
    }

    const report = await generateCashFlowReport(
      req.user.company,
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockReport = async (req, res, next) => {
  try {
    const report = await generateStockReport(req.user.company);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfitabilityReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Les dates de début et fin sont requises', 400);
    }

    const report = await generateProfitabilityReport(
      req.user.company,
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getBalanceSheet = async (req, res, next) => {
  try {
    const { fiscalYearId, date } = req.query;

    const balanceSheet = await generateBalanceSheet(
      req.user.company,
      fiscalYearId,
      date ? new Date(date) : new Date()
    );

    res.json({
      success: true,
      data: balanceSheet,
    });
  } catch (error) {
    next(error);
  }
};

export const getIncomeStatement = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Les dates de début et fin sont requises', 400);
    }

    const incomeStatement = await generateIncomeStatement(
      req.user.company,
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      success: true,
      data: incomeStatement,
    });
  } catch (error) {
    next(error);
  }
};

export const exportInvoicePDF = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    const pdfBuffer = await generateInvoicePDF(invoiceId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facture-${invoiceId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const exportInvoicesExcel = async (req, res, next) => {
  try {
    const { startDate, endDate, type, status } = req.query;

    const filter = { company: req.user.company };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (type) filter.type = type;
    if (status) filter.status = status;

    const invoices = await Invoice.find(filter)
      .populate('customer', 'firstName lastName companyName')
      .populate('items.product', 'name code');

    const buffer = await exportInvoices(invoices);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=factures.xlsx');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const exportPaymentsExcel = async (req, res, next) => {
  try {
    const { startDate, endDate, method, type } = req.query;

    const filter = { company: req.user.company };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (method) filter.method = method;
    if (type) filter.type = type;

    const payments = await Payment.find(filter)
      .populate('invoice', 'number')
      .populate('customer', 'firstName lastName companyName');

    const buffer = await exportPayments(payments);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=paiements.xlsx');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const exportProductsExcel = async (req, res, next) => {
  try {
    const products = await Product.find({ company: req.user.company })
      .populate('category', 'name');

    const buffer = await exportProducts(products);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=produits.xlsx');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export default {
  getSalesReport,
  getCashFlowReport,
  getStockReport,
  getProfitabilityReport,
  getBalanceSheet,
  getIncomeStatement,
  exportInvoicePDF,
  exportInvoicesExcel,
  exportPaymentsExcel,
  exportProductsExcel,
};
