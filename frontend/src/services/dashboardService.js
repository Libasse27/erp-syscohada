/**
 * Service Dashboard - Gestion du tableau de bord et statistiques
 */

import api from './api';

const DASHBOARD_API = '/dashboard';

const dashboardService = {
  // Obtenir les statistiques globales
  getStats: async () => {
    const response = await api.get(`${DASHBOARD_API}/stats`);
    return response.data;
  },

  // Obtenir l'aperçu des ventes
  getSalesOverview: async (params = {}) => {
    const response = await api.get(`${DASHBOARD_API}/sales-overview`, { params });
    return response.data;
  },

  // Obtenir les alertes
  getAlerts: async () => {
    const response = await api.get(`${DASHBOARD_API}/alerts`);
    return response.data;
  },

  // Obtenir le graphique des ventes
  getSalesChart: async (params = {}) => {
    const response = await api.get(`${DASHBOARD_API}/sales-chart`, { params });
    return response.data;
  },

  // Obtenir les activités récentes
  getRecentActivities: async (limit = 10) => {
    const response = await api.get(`${DASHBOARD_API}/activities`, { params: { limit } });
    return response.data;
  },

  // Obtenir les KPIs (Indicateurs clés de performance)
  getKPIs: async (params = {}) => {
    const response = await api.get(`${DASHBOARD_API}/kpis`, { params });
    return response.data;
  },

  // Obtenir les produits les plus vendus
  getTopProducts: async (limit = 10) => {
    const response = await api.get(`${DASHBOARD_API}/top-products`, { params: { limit } });
    return response.data;
  },

  // Obtenir les meilleurs clients
  getTopCustomers: async (limit = 10) => {
    const response = await api.get(`${DASHBOARD_API}/top-customers`, { params: { limit } });
    return response.data;
  },
};

export default dashboardService;
