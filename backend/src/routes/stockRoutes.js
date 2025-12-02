/**
 * Routes Stock - Gestion du stock
 */

import express from 'express';
import {
  getStockMovements,
  createStockIn,
  createStockOut,
  createTransfer,
  createAdjustment,
  getLowStock,
  getOutOfStock,
  getStockValue,
  getInventoryReport,
} from '../controllers/stockController.js';
import { protect as authenticate } from '../middlewares/authMiddleware.js';
import { restrictTo as authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Rapports et alertes
router.get('/low-stock', getLowStock);
router.get('/out-of-stock', getOutOfStock);
router.get('/value', getStockValue);
router.get('/inventory', getInventoryReport);

// Mouvements
router.get('/movements', getStockMovements);
router.post('/in', authorize(['admin', 'manager']), createStockIn);
router.post('/out', authorize(['admin', 'manager']), createStockOut);
router.post('/transfer', authorize(['admin', 'manager']), createTransfer);
router.post('/adjustment', authorize(['admin', 'manager']), createAdjustment);

export default router;
