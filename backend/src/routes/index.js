/**
 * Routes principales de l'API
 * Point d'entrée pour toutes les routes
 */

import express from 'express';

const router = express.Router();

// Route de bienvenue API
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur l\'API ERP SYSCOHADA',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      customers: '/api/customers',
      suppliers: '/api/suppliers',
      invoices: '/api/invoices',
      purchases: '/api/purchases',
      stock: '/api/stock',
      accounting: '/api/accounting',
      payments: '/api/payments',
      reports: '/api/reports',
      dashboard: '/api/dashboard'
    }
  });
});

// Import des routes (à décommenter au fur et à mesure du développement)
// import authRoutes from './authRoutes.js';
// import userRoutes from './userRoutes.js';
// import productRoutes from './productRoutes.js';
// import customerRoutes from './customerRoutes.js';
// import supplierRoutes from './supplierRoutes.js';
// import invoiceRoutes from './invoiceRoutes.js';
// import purchaseOrderRoutes from './purchaseOrderRoutes.js';
// import stockRoutes from './stockRoutes.js';
// import accountRoutes from './accountRoutes.js';
// import accountingEntryRoutes from './accountingEntryRoutes.js';
// import paymentRoutes from './paymentRoutes.js';
// import reportRoutes from './reportRoutes.js';
// import dashboardRoutes from './dashboardRoutes.js';

// Utilisation des routes (à décommenter au fur et à mesure)
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);
// router.use('/customers', customerRoutes);
// router.use('/suppliers', supplierRoutes);
// router.use('/invoices', invoiceRoutes);
// router.use('/purchases', purchaseOrderRoutes);
// router.use('/stock', stockRoutes);
// router.use('/accounting/accounts', accountRoutes);
// router.use('/accounting/entries', accountingEntryRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/reports', reportRoutes);
// router.use('/dashboard', dashboardRoutes);

export default router;
