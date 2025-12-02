import { createSlice } from '@reduxjs/toolkit';
import { THEME_MODES } from '../../utils/constants';

// Initial state
const initialState = {
  // Theme
  theme: THEME_MODES.LIGHT,

  // Sidebar
  sidebarOpen: true,
  sidebarCollapsed: false,

  // Modals
  modals: {},

  // Toasts/Notifications
  toasts: [],

  // Loading states
  globalLoading: false,
  loadingMessage: '',

  // Breadcrumbs
  breadcrumbs: [],

  // Page title
  pageTitle: '',

  // Mobile view
  isMobile: false,

  // Search
  searchOpen: false,
  searchQuery: '',
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },

    // Sidebar
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    // Modals
    openModal: (state, action) => {
      const { id, props = {} } = action.payload;
      state.modals[id] = { isOpen: true, props };
    },
    closeModal: (state, action) => {
      const id = action.payload;
      if (state.modals[id]) {
        state.modals[id].isOpen = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((id) => {
        state.modals[id].isOpen = false;
      });
    },
    updateModalProps: (state, action) => {
      const { id, props } = action.payload;
      if (state.modals[id]) {
        state.modals[id].props = { ...state.modals[id].props, ...props };
      }
    },

    // Toasts/Notifications
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: 'info',
        duration: 3000,
        ...action.payload,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },

    // Convenience toast methods
    showSuccessToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: 'success',
        duration: 3000,
        message: action.payload,
      };
      state.toasts.push(toast);
    },
    showErrorToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: 'error',
        duration: 5000,
        message: action.payload,
      };
      state.toasts.push(toast);
    },
    showWarningToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: 'warning',
        duration: 4000,
        message: action.payload,
      };
      state.toasts.push(toast);
    },
    showInfoToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: 'info',
        duration: 3000,
        message: action.payload,
      };
      state.toasts.push(toast);
    },

    // Global loading
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    setLoadingMessage: (state, action) => {
      state.loadingMessage = action.payload;
    },

    // Breadcrumbs
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },

    // Page title
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload;
      if (typeof document !== 'undefined') {
        document.title = action.payload ? `${action.payload} - ERP SYSCOHADA` : 'ERP SYSCOHADA';
      }
    },

    // Mobile view
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },

    // Search
    setSearchOpen: (state, action) => {
      state.searchOpen = action.payload;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
    },
  },
});

// Actions
export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  openModal,
  closeModal,
  closeAllModals,
  updateModalProps,
  addToast,
  removeToast,
  clearToasts,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  setGlobalLoading,
  setLoadingMessage,
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
  setPageTitle,
  setIsMobile,
  setSearchOpen,
  toggleSearch,
  setSearchQuery,
  clearSearch,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectModals = (state) => state.ui.modals;
export const selectModal = (id) => (state) => state.ui.modals[id];
export const selectToasts = (state) => state.ui.toasts;
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectLoadingMessage = (state) => state.ui.loadingMessage;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;
export const selectPageTitle = (state) => state.ui.pageTitle;
export const selectIsMobile = (state) => state.ui.isMobile;
export const selectSearchOpen = (state) => state.ui.searchOpen;
export const selectSearchQuery = (state) => state.ui.searchQuery;

export default uiSlice.reducer;
