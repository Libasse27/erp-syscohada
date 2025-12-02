/**
 * Routes Category - Gestion des catégories
 */

import express from 'express';
import {
  getCategories,
  getCategoryById,
  getRootCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect as authenticate } from '../middlewares/authMiddleware.js';
import { restrictTo as authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Lecture (tous les utilisateurs)
router.get('/', getCategories);
router.get('/root', getRootCategories);
router.get('/:id', getCategoryById);

// Écriture (admin/manager uniquement)
router.post('/', authorize(['admin', 'manager']), validateBody(createCategorySchema), createCategory);
router.put('/:id', authorize(['admin', 'manager']), validateBody(updateCategorySchema), updateCategory);
router.delete('/:id', authorize(['admin']), deleteCategory);

export default router;
