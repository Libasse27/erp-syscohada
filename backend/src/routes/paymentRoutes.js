/**
 * Routes Payment - Gestion des paiements
 */

import express from 'express';
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  cancelPayment,
  initiateMobileMoney,
  verifyMobileMoney,
  getPaymentStats,
} from '../controllers/paymentController.js';
import { protect as authenticate } from '../middlewares/authMiddleware.js';
import { restrictTo as authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createPaymentSchema, updatePaymentSchema } from '../validators/paymentValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Statistiques
router.get('/stats', getPaymentStats);

// Mobile Money
router.post('/mobile-money/initiate', initiateMobileMoney);
router.post('/mobile-money/verify', verifyMobileMoney);

// CRUD
router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.post('/', authorize(['admin', 'manager', 'sales', 'accountant']), validateBody(createPaymentSchema), createPayment);
router.put('/:id', authorize(['admin', 'manager', 'accountant']), validateBody(updatePaymentSchema), updatePayment);
router.post('/:id/cancel', authorize(['admin', 'manager']), cancelPayment);

export default router;
