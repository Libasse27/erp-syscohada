/**
 * Configuration du store Redux
 */

import { configureStore } from '@reduxjs/toolkit';

// Import des slices (à décommenter au fur et à mesure)
import authReducer from './slices/authSlice';
// import productReducer from './slices/productSlice';
// import invoiceReducer from './slices/invoiceSlice';
// import customerReducer from './slices/customerSlice';
// import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // products: productReducer,
    // invoices: invoiceReducer,
    // customers: customerReducer,
    // ui: uiReducer,
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
