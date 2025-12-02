/**
 * Routes Dashboard - Tableau de bord
 */

import express from 'express';
import {
  getDashboard,
  getSalesOverview,
  getCashFlowOverview,
  getTopProducts,
  getTopCustomers,
  getRecentActivity,
  getAlerts,
  getSalesChart,
  getStats,
} from '../controllers/dashboardController.js';
import { protect as authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes protégées
router.use(authenticate);

// Dashboard principal
router.get('/', getDashboard);

// Widgets et KPIs
router.get('/sales-overview', getSalesOverview);
router.get('/cash-flow-overview', getCashFlowOverview);
router.get('/top-products', getTopProducts);
router.get('/top-customers', getTopCustomers);
router.get('/recent-activity', getRecentActivity);
router.get('/alerts', getAlerts);
router.get('/sales-chart', getSalesChart);
router.get('/stats', getStats);

export default router;
