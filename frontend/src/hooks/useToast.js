import { useState, useCallback } from 'react';
import { TOAST_DURATION } from '../utils/constants';

/**
 * Custom hook to manage toast notifications
 * @returns {Object} - Toast state and handlers
 */
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const addToast = useCallback((message, options = {}) => {
    const {
      type = 'info', // 'success', 'error', 'warning', 'info'
      duration = TOAST_DURATION.MEDIUM,
      id = Date.now(),
      title = null,
      action = null,
    } = options;

    const newToast = {
      id,
      message,
      type,
      duration,
      title,
      action,
      createdAt: Date.now(),
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove a toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Remove all toasts
  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Show success toast
  const success = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'success' });
  }, [addToast]);

  // Show error toast
  const error = useCallback((message, options = {}) => {
    return addToast(message, {
      ...options,
      type: 'error',
      duration: options.duration || TOAST_DURATION.LONG,
    });
  }, [addToast]);

  // Show warning toast
  const warning = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'warning' });
  }, [addToast]);

  // Show info toast
  const info = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'info' });
  }, [addToast]);

  // Show loading toast (doesn't auto-dismiss)
  const loading = useCallback((message, options = {}) => {
    return addToast(message, {
      ...options,
      type: 'info',
      duration: 0, // Don't auto-dismiss
    });
  }, [addToast]);

  // Update existing toast
  const updateToast = useCallback((id, updates) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id
          ? { ...toast, ...updates }
          : toast
      )
    );
  }, []);

  // Promise-based toast (useful for async operations)
  const promise = useCallback(async (
    promiseOrFunction,
    { loading: loadingMessage, success: successMessage, error: errorMessage }
  ) => {
    const loadingToastId = loading(loadingMessage);

    try {
      const result = typeof promiseOrFunction === 'function'
        ? await promiseOrFunction()
        : await promiseOrFunction;

      removeToast(loadingToastId);
      success(successMessage || 'Opération réussie');
      return result;
    } catch (err) {
      removeToast(loadingToastId);
      error(errorMessage || err.message || 'Une erreur est survenue');
      throw err;
    }
  }, [loading, success, error, removeToast]);

  return {
    // State
    toasts,

    // Methods
    addToast,
    removeToast,
    removeAllToasts,
    updateToast,

    // Convenience methods
    success,
    error,
    warning,
    info,
    loading,
    promise,
  };
};

export { useToast };
export default useToast;
