/**
 * Service Rapport Ventes - Gestion des rapports de ventes
 */

import api from './api';

const SALES_REPORT_API = '/reports/sales';

const salesReportService = {
  // Obtenir le rapport des ventes
  getAll: async (params = {}) => {
    const response = await api.get(SALES_REPORT_API, { params });
    return response.data;
  },

  // Obtenir le résumé des ventes
  getSummary: async (params = {}) => {
    const response = await api.get(`${SALES_REPORT_API}/summary`, { params });
    return response.data;
  },

  // Obtenir les ventes par client
  getByCustomer: async (params = {}) => {
    const response = await api.get(`${SALES_REPORT_API}/by-customer`, { params });
    return response.data;
  },

  // Obtenir les ventes par produit
  getByProduct: async (params = {}) => {
    const response = await api.get(`${SALES_REPORT_API}/by-product`, { params });
    return response.data;
  },

  // Obtenir les ventes par période
  getByPeriod: async (startDate, endDate, params = {}) => {
    const response = await api.get(`${SALES_REPORT_API}/by-period`, {
      params: { startDate, endDate, ...params }
    });
    return response.data;
  },

  // Obtenir les statistiques de ventes
  getStats: async (params = {}) => {
    const response = await api.get(`${SALES_REPORT_API}/stats`, { params });
    return response.data;
  },

  // Exporter le rapport des ventes
  export: async (format = 'excel', params = {}) => {
    const response = await api.get(`${SALES_REPORT_API}/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default salesReportService;
