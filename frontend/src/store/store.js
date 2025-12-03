/**
 * Configuration du store Redux
 */

import { configureStore } from '@reduxjs/toolkit';

// Import des slices
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import invoiceReducer from './slices/invoiceSlice';
import customerReducer from './slices/customerSlice';
import uiReducer from './slices/uiSlice';
import dashboardReducer from './slices/dashboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    invoices: invoiceReducer,
    customers: customerReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les actions de vérification de sérialisation pour certaines actions si nécessaire
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
