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
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createAccountValidator, updateAccountValidator } from '../validators/accountValidator.js';

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
router.post('/', authorize(['admin', 'accountant']), validateBody(createAccountValidator), createAccount);
router.put('/:id', authorize(['admin', 'accountant']), validateBody(updateAccountValidator), updateAccount);
router.delete('/:id', authorize(['admin']), deleteAccount);

export default router;
