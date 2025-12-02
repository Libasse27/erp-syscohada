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
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createPaymentValidator, updatePaymentValidator } from '../validators/paymentValidator.js';

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
router.post('/', authorize(['admin', 'manager', 'sales', 'accountant']), validateBody(createPaymentValidator), createPayment);
router.put('/:id', authorize(['admin', 'manager', 'accountant']), validateBody(updatePaymentValidator), updatePayment);
router.post('/:id/cancel', authorize(['admin', 'manager']), cancelPayment);

export default router;
