/**
 * Routes Supplier - Gestion des fournisseurs
 */

import express from 'express';
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getTopSuppliers,
} from '../controllers/supplierController.js';
import { protect as authenticate } from '../middlewares/authMiddleware.js';
import { restrictTo as authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createSupplierSchema, updateSupplierSchema } from '../validators/supplierValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Statistiques
router.get('/top', getTopSuppliers);

// CRUD
router.get('/', getSuppliers);
router.get('/:id', getSupplierById);
router.post('/', authorize(['admin', 'manager']), validateBody(createSupplierSchema), createSupplier);
router.put('/:id', authorize(['admin', 'manager']), validateBody(updateSupplierSchema), updateSupplier);
router.delete('/:id', authorize(['admin']), deleteSupplier);

export default router;
