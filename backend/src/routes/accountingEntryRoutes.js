/**
 * Routes AccountingEntry - Gestion des écritures comptables
 */

import express from 'express';
import {
  getAccountingEntries,
  getAccountingEntryById,
  createAccountingEntry,
  updateAccountingEntry,
  deleteAccountingEntry,
  validateAccountingEntry,
  getEntriesByPeriod,
} from '../controllers/accountingEntryController.js';
import { protect as authenticate } from '../middlewares/authMiddleware.js';
import { restrictTo as authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createAccountingEntrySchema, updateAccountingEntrySchema } from '../validators/accountingEntryValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Lecture
router.get('/', getAccountingEntries);
router.get('/period', getEntriesByPeriod);
router.get('/:id', getAccountingEntryById);

// Écriture (admin/accountant uniquement)
router.post('/', authorize(['admin', 'accountant']), validateBody(createAccountingEntrySchema), createAccountingEntry);
router.put('/:id', authorize(['admin', 'accountant']), validateBody(updateAccountingEntrySchema), updateAccountingEntry);
router.delete('/:id', authorize(['admin', 'accountant']), deleteAccountingEntry);

// Validation
router.post('/:id/validate', authorize(['admin', 'accountant']), validateAccountingEntry);

export default router;
