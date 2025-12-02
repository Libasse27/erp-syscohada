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
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createCategoryValidator, updateCategoryValidator } from '../validators/categoryValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Lecture (tous les utilisateurs)
router.get('/', getCategories);
router.get('/root', getRootCategories);
router.get('/:id', getCategoryById);

// Écriture (admin/manager uniquement)
router.post('/', authorize(['admin', 'manager']), validateBody(createCategoryValidator), createCategory);
router.put('/:id', authorize(['admin', 'manager']), validateBody(updateCategoryValidator), updateCategory);
router.delete('/:id', authorize(['admin']), deleteCategory);

export default router;
