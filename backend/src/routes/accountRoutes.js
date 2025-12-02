/**
 * Routes Account - Gestion du plan comptable
 */

import express from 'express';
import {
  getAccounts,
  getAccountById,
  getAccountByCode,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountBalance,
  getAccountsByClassNumber,
} from '../controllers/accountController.js';
import { protect as authenticate } from '../middlewares/authMiddleware.js';
import { restrictTo as authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createAccountSchema, updateAccountSchema } from '../validators/accountValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Lecture
router.get('/', getAccounts);
router.get('/class/:class', getAccountsByClassNumber);
router.get('/code/:code', getAccountByCode);
router.get('/:id', getAccountById);
router.get('/:id/balance', getAccountBalance);

// Écriture (admin/accountant uniquement)
router.post('/', authorize(['admin', 'accountant']), validateBody(createAccountSchema), createAccount);
router.put('/:id', authorize(['admin', 'accountant']), validateBody(updateAccountSchema), updateAccount);
router.delete('/:id', authorize(['admin']), deleteAccount);

export default router;
