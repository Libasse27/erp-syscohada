/**
 * Redux Slice pour le Dashboard
 * Gestion de l'état du tableau de bord (stats, alertes, activités, graphiques)
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboardService';

// État initial
const initialState = {
  // Statistiques principales
  stats: {
    sales: { total: 0, percentage: 0, trend: 'up' },
    purchases: { total: 0, percentage: 0, trend: 'up' },
    inventory: { total: 0, percentage: 0, trend: 'up' },
    customers: { total: 0, percentage: 0, trend: 'up' },
    revenue: 0,
    profit: 0,
    expenses: 0,
    profitMargin: 0,
  },

  // Données du graphique des ventes
  salesChart: {
    labels: [],
    data: [],
  },

  // Alertes
  alerts: [],

  // Activités récentes
  recentActivities: [],

  // Top produits
  topProducts: [],

  // Top clients
  topCustomers: [],

  // Période sélectionnée
  period: 'month', // week, month, year

  // État de chargement et erreurs
  isLoading: false,
  error: null,
};

// ============================================================================
// ACTIONS ASYNCHRONES
// ============================================================================

/**
 * Récupérer toutes les données du dashboard
 */
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (period = 'month', { rejectWithValue }) => {
    try {
      const [
        statsData,
        alertsData,
        activitiesData,
        productsData,
        customersData,
        chartData,
      ] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getAlerts(),
        dashboardService.getRecentActivities(10),
        dashboardService.getTopProducts(5),
        dashboardService.getTopCustomers(5),
        dashboardService.getSalesChart({ period }),
      ]);

      return {
        stats: statsData,
        alerts: alertsData,
        recentActivities: activitiesData,
        topProducts: productsData,
        topCustomers: customersData,
        salesChart: chartData,
        period,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors du chargement du tableau de bord'
      );
    }
  }
);

/**
 * Récupérer uniquement les statistiques
 */
export const fetchStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getStats();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors du chargement des statistiques'
      );
    }
  }
);

/**
 * Récupérer uniquement les alertes
 */
export const fetchAlerts = createAsyncThunk(
  'dashboard/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getAlerts();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors du chargement des alertes'
      );
    }
  }
);

/**
 * Récupérer les activités récentes
 */
export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getRecentActivities(limit);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors du chargement des activités'
      );
    }
  }
);

/**
 * Récupérer le graphique des ventes
 */
export const fetchSalesChart = createAsyncThunk(
  'dashboard/fetchSalesChart',
  async (period = 'month', { rejectWithValue }) => {
    try {
      const data = await dashboardService.getSalesChart({ period });
      return { data, period };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors du chargement du graphique'
      );
    }
  }
);

/**
 * Récupérer les top produits
 */
export const fetchTopProducts = createAsyncThunk(
  'dashboard/fetchTopProducts',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getTopProducts(limit);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors du chargement des produits'
      );
    }
  }
);

/**
 * Récupérer les top clients
 */
export const fetchTopCustomers = createAsyncThunk(
  'dashboard/fetchTopCustomers',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getTopCustomers(limit);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors du chargement des clients'
      );
    }
  }
);

// ============================================================================
// SLICE
// ============================================================================

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Changer la période
    setPeriod: (state, action) => {
      state.period = action.payload;
    },

    // Réinitialiser les erreurs
    clearError: (state) => {
      state.error = null;
    },

    // Réinitialiser le dashboard
    resetDashboard: () => initialState,

    // Ajouter une alerte manuellement
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload);
    },

    // Supprimer une alerte
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter((_, index) => index !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== Fetch Dashboard Data ==========
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.alerts = action.payload.alerts;
        state.recentActivities = action.payload.recentActivities;
        state.topProducts = action.payload.topProducts;
        state.topCustomers = action.payload.topCustomers;
        state.salesChart = action.payload.salesChart;
        state.period = action.payload.period;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ========== Fetch Stats ==========
      .addCase(fetchStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== Fetch Alerts ==========
      .addCase(fetchAlerts.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== Fetch Recent Activities ==========
      .addCase(fetchRecentActivities.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.recentActivities = action.payload;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== Fetch Sales Chart ==========
      .addCase(fetchSalesChart.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSalesChart.fulfilled, (state, action) => {
        state.salesChart = action.payload.data;
        state.period = action.payload.period;
      })
      .addCase(fetchSalesChart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== Fetch Top Products ==========
      .addCase(fetchTopProducts.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== Fetch Top Customers ==========
      .addCase(fetchTopCustomers.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTopCustomers.fulfilled, (state, action) => {
        state.topCustomers = action.payload;
      })
      .addCase(fetchTopCustomers.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

// Actions
export const {
  setPeriod,
  clearError,
  resetDashboard,
  addAlert,
  removeAlert
} = dashboardSlice.actions;

// Selectors
export const selectStats = (state) => state.dashboard.stats;
export const selectSalesChart = (state) => state.dashboard.salesChart;
export const selectAlerts = (state) => state.dashboard.alerts;
export const selectRecentActivities = (state) => state.dashboard.recentActivities;
export const selectTopProducts = (state) => state.dashboard.topProducts;
export const selectTopCustomers = (state) => state.dashboard.topCustomers;
export const selectPeriod = (state) => state.dashboard.period;
export const selectDashboardLoading = (state) => state.dashboard.isLoading;
export const selectDashboardError = (state) => state.dashboard.error;

// Selector combiné pour toutes les données du dashboard
export const selectDashboardData = (state) => ({
  stats: state.dashboard.stats,
  salesChart: state.dashboard.salesChart,
  alerts: state.dashboard.alerts,
  recentActivities: state.dashboard.recentActivities,
  topProducts: state.dashboard.topProducts,
  topCustomers: state.dashboard.topCustomers,
  period: state.dashboard.period,
  isLoading: state.dashboard.isLoading,
  error: state.dashboard.error,
});

export default dashboardSlice.reducer;
