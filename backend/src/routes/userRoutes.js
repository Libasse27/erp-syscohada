/**
 * Routes User - Gestion des utilisateurs
 */

import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createUserValidator, updateUserValidator } from '../validators/userValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Profile de l'utilisateur connecté
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Gestion des utilisateurs (admin/manager uniquement)
router.get('/', authorize(['admin', 'manager']), getUsers);
router.get('/:id', authorize(['admin', 'manager']), getUserById);
router.post('/', authorize(['admin']), validateBody(createUserValidator), createUser);
router.put('/:id', authorize(['admin', 'manager']), validateBody(updateUserValidator), updateUser);
router.delete('/:id', authorize(['admin']), deleteUser);

export default router;
