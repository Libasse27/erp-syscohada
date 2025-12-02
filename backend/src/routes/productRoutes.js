/**
 * Routes Product - Gestion des produits
 */

import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustProductStock,
} from '../controllers/productController.js';
import { protect as authenticate } from '../middlewares/authMiddleware.js';
import { restrictTo as authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Lecture (tous les utilisateurs)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Écriture (admin/manager uniquement)
router.post('/', authorize(['admin', 'manager']), validateBody(createProductSchema), createProduct);
router.put('/:id', authorize(['admin', 'manager']), validateBody(updateProductSchema), updateProduct);
router.delete('/:id', authorize(['admin']), deleteProduct);

// Ajustement stock
router.post('/:id/adjust-stock', authorize(['admin', 'manager']), adjustProductStock);

export default router;
