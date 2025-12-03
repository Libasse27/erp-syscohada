/**
 * Service Trésorerie - Gestion des flux de trésorerie
 */

import api from './api';

const CASH_FLOW_API = '/cash-flow';

const cashFlowService = {
  // Obtenir les données de trésorerie avec filtres
  getAll: async (params = {}) => {
    const response = await api.get(CASH_FLOW_API, { params });
    return response.data;
  },

  // Obtenir le résumé de trésorerie
  getSummary: async (params = {}) => {
    const response = await api.get(`${CASH_FLOW_API}/summary`, { params });
    return response.data;
  },

  // Obtenir les transactions de trésorerie par catégorie
  getByCategory: async (category, params = {}) => {
    const response = await api.get(`${CASH_FLOW_API}/category/${category}`, { params });
    return response.data;
  },

  // Obtenir les prévisions de trésorerie
  getForecast: async (params = {}) => {
    const response = await api.get(`${CASH_FLOW_API}/forecast`, { params });
    return response.data;
  },

  // Obtenir le flux de trésorerie par période
  getByPeriod: async (startDate, endDate, params = {}) => {
    const response = await api.get(`${CASH_FLOW_API}/period`, {
      params: { startDate, endDate, ...params }
    });
    return response.data;
  },

  // Obtenir les statistiques de trésorerie
  getStats: async (params = {}) => {
    const response = await api.get(`${CASH_FLOW_API}/stats`, { params });
    return response.data;
  },

  // Exporter les données de trésorerie
  export: async (format = 'excel', params = {}) => {
    const response = await api.get(`${CASH_FLOW_API}/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default cashFlowService;
