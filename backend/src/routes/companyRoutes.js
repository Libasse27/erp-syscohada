/**
 * Routes Company - Gestion de l'entreprise
 */

import express from 'express';
import {
  getCompany,
  updateCompany,
  getSettings,
  updateSettings,
} from '../controllers/companyController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { updateCompanyValidator } from '../validators/companyValidator.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Informations de l'entreprise
router.get('/', getCompany);
router.put('/', authorize(['admin']), validateBody(updateCompanyValidator), updateCompany);

// Paramètres
router.get('/settings', getSettings);
router.put('/settings', authorize(['admin']), updateSettings);

export default router;
