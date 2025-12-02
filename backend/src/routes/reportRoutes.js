/**
 * Routes Report - Rapports et exports
 */

import express from 'express';
import {
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
} from '../controllers/reportController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Rapports analytiques
router.get('/sales', authorize(['admin', 'manager']), getSalesReport);
router.get('/cash-flow', authorize(['admin', 'manager', 'accountant']), getCashFlowReport);
router.get('/stock', authorize(['admin', 'manager']), getStockReport);
router.get('/profitability', authorize(['admin', 'manager']), getProfitabilityReport);

// Rapports comptables
router.get('/balance-sheet', authorize(['admin', 'accountant']), getBalanceSheet);
router.get('/income-statement', authorize(['admin', 'accountant']), getIncomeStatement);

// Exports PDF
router.get('/invoice/:invoiceId/pdf', exportInvoicePDF);

// Exports Excel
router.get('/invoices/excel', authorize(['admin', 'manager']), exportInvoicesExcel);
router.get('/payments/excel', authorize(['admin', 'manager', 'accountant']), exportPaymentsExcel);
router.get('/products/excel', authorize(['admin', 'manager']), exportProductsExcel);

export default router;
