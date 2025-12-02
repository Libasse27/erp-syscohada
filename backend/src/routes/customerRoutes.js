/**
 * Routes Customer - Gestion des clients
 */

import express from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getTopCustomers,
} from '../controllers/customerController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createCustomerValidator, updateCustomerValidator } from '../validators/customerValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Statistiques
router.get('/top', getTopCustomers);

// CRUD
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', authorize(['admin', 'manager', 'sales']), validateBody(createCustomerValidator), createCustomer);
router.put('/:id', authorize(['admin', 'manager', 'sales']), validateBody(updateCustomerValidator), updateCustomer);
router.delete('/:id', authorize(['admin', 'manager']), deleteCustomer);

export default router;
