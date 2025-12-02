/**
 * Controller Report - Gestion des rapports et exports
 */

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
import { generateInvoicePDF } from '../services/pdfService.js';
import {
  exportInvoicesToExcel,
  exportPaymentsToExcel,
  exportProductsToExcel,
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

    const buffer = await exportInvoicesToExcel(req.user.company, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      type,
      status,
    });

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

    const buffer = await exportPaymentsToExcel(req.user.company, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      method,
      type,
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=paiements.xlsx');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const exportProductsExcel = async (req, res, next) => {
  try {
    const buffer = await exportProductsToExcel(req.user.company);

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
