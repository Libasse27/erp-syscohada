/**
 * Routes Invoice - Gestion des factures
 */

import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  validateInvoice,
  getOverdueInvoices,
  getInvoiceStats,
} from '../controllers/invoiceController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createInvoiceValidator, updateInvoiceValidator } from '../validators/invoiceValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Statistiques
router.get('/stats', getInvoiceStats);
router.get('/overdue', getOverdueInvoices);

// CRUD
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/', authorize(['admin', 'manager', 'sales']), validateBody(createInvoiceValidator), createInvoice);
router.put('/:id', authorize(['admin', 'manager', 'sales']), validateBody(updateInvoiceValidator), updateInvoice);
router.delete('/:id', authorize(['admin', 'manager']), deleteInvoice);

// Actions
router.post('/:id/validate', authorize(['admin', 'manager']), validateInvoice);

export default router;
