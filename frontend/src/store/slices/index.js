// Export all slices from a single entry point

// Auth slice
export * from './authSlice';
export { default as authReducer } from './authSlice';

// Product slice
export * from './productSlice';
export { default as productReducer } from './productSlice';

// Invoice slice
export * from './invoiceSlice';
export { default as invoiceReducer } from './invoiceSlice';

// Customer slice
export * from './customerSlice';
export { default as customerReducer } from './customerSlice';

// UI slice
export * from './uiSlice';
export { default as uiReducer } from './uiSlice';
