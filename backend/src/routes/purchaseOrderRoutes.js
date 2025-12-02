/**
 * Routes PurchaseOrder - Gestion des bons de commande
 */

import express from 'express';
import {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  receivePurchaseOrder,
  validatePurchaseOrder,
} from '../controllers/purchaseOrderController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createPurchaseOrderValidator, updatePurchaseOrderValidator } from '../validators/purchaseOrderValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// CRUD
router.get('/', getPurchaseOrders);
router.get('/:id', getPurchaseOrderById);
router.post('/', authorize(['admin', 'manager']), validateBody(createPurchaseOrderValidator), createPurchaseOrder);
router.put('/:id', authorize(['admin', 'manager']), validateBody(updatePurchaseOrderValidator), updatePurchaseOrder);
router.delete('/:id', authorize(['admin', 'manager']), deletePurchaseOrder);

// Actions
router.post('/:id/validate', authorize(['admin', 'manager']), validatePurchaseOrder);
router.post('/:id/receive', authorize(['admin', 'manager']), receivePurchaseOrder);

export default router;
