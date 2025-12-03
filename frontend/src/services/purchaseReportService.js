/**
 * Service Rapport Achats - Gestion des rapports d'achats
 */

import api from './api';

const PURCHASE_REPORT_API = '/reports/purchases';

const purchaseReportService = {
  // Obtenir le rapport des achats
  getAll: async (params = {}) => {
    const response = await api.get(PURCHASE_REPORT_API, { params });
    return response.data;
  },

  // Obtenir le résumé des achats
  getSummary: async (params = {}) => {
    const response = await api.get(`${PURCHASE_REPORT_API}/summary`, { params });
    return response.data;
  },

  // Obtenir les achats par fournisseur
  getBySupplier: async (params = {}) => {
    const response = await api.get(`${PURCHASE_REPORT_API}/by-supplier`, { params });
    return response.data;
  },

  // Obtenir les achats par produit
  getByProduct: async (params = {}) => {
    const response = await api.get(`${PURCHASE_REPORT_API}/by-product`, { params });
    return response.data;
  },

  // Obtenir les achats par période
  getByPeriod: async (startDate, endDate, params = {}) => {
    const response = await api.get(`${PURCHASE_REPORT_API}/by-period`, {
      params: { startDate, endDate, ...params }
    });
    return response.data;
  },

  // Obtenir les statistiques d'achats
  getStats: async (params = {}) => {
    const response = await api.get(`${PURCHASE_REPORT_API}/stats`, { params });
    return response.data;
  },

  // Exporter le rapport des achats
  export: async (format = 'excel', params = {}) => {
    const response = await api.get(`${PURCHASE_REPORT_API}/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default purchaseReportService;
