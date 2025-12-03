/**
 * Service Rapport Stock - Gestion des rapports de stock
 */

import api from './api';

const STOCK_REPORT_API = '/reports/stock';

const stockReportService = {
  // Obtenir le rapport de stock
  getAll: async (params = {}) => {
    const response = await api.get(STOCK_REPORT_API, { params });
    return response.data;
  },

  // Obtenir le résumé du stock
  getSummary: async (params = {}) => {
    const response = await api.get(`${STOCK_REPORT_API}/summary`, { params });
    return response.data;
  },

  // Obtenir le stock par produit
  getByProduct: async (params = {}) => {
    const response = await api.get(`${STOCK_REPORT_API}/by-product`, { params });
    return response.data;
  },

  // Obtenir le stock par catégorie
  getByCategory: async (params = {}) => {
    const response = await api.get(`${STOCK_REPORT_API}/by-category`, { params });
    return response.data;
  },

  // Obtenir les mouvements de stock
  getMovements: async (params = {}) => {
    const response = await api.get(`${STOCK_REPORT_API}/movements`, { params });
    return response.data;
  },

  // Obtenir les stocks faibles
  getLowStock: async (params = {}) => {
    const response = await api.get(`${STOCK_REPORT_API}/low-stock`, { params });
    return response.data;
  },

  // Obtenir la valorisation du stock
  getValuation: async (params = {}) => {
    const response = await api.get(`${STOCK_REPORT_API}/valuation`, { params });
    return response.data;
  },

  // Obtenir les statistiques de stock
  getStats: async (params = {}) => {
    const response = await api.get(`${STOCK_REPORT_API}/stats`, { params });
    return response.data;
  },

  // Exporter le rapport de stock
  export: async (format = 'excel', params = {}) => {
    const response = await api.get(`${STOCK_REPORT_API}/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default stockReportService;
