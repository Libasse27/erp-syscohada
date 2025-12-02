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
import { protect as authenticate } from '../middlewares/authMiddleware.js';
import { restrictTo as authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createInvoiceSchema, updateInvoiceSchema } from '../validators/invoiceValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Statistiques
router.get('/stats', getInvoiceStats);
router.get('/overdue', getOverdueInvoices);

// CRUD
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/', authorize(['admin', 'manager', 'sales']), validateBody(createInvoiceSchema), createInvoice);
router.put('/:id', authorize(['admin', 'manager', 'sales']), validateBody(updateInvoiceSchema), updateInvoice);
router.delete('/:id', authorize(['admin', 'manager']), deleteInvoice);

// Actions
router.post('/:id/validate', authorize(['admin', 'manager']), validateInvoice);

export default router;
