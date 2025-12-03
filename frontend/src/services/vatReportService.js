/**
 * Service Rapport TVA - Gestion des déclarations de TVA
 */

import api from './api';

const VAT_REPORT_API = '/reports/vat';

const vatReportService = {
  // Obtenir le rapport de TVA
  getAll: async (params = {}) => {
    const response = await api.get(VAT_REPORT_API, { params });
    return response.data;
  },

  // Obtenir le résumé de TVA
  getSummary: async (params = {}) => {
    const response = await api.get(`${VAT_REPORT_API}/summary`, { params });
    return response.data;
  },

  // Obtenir la TVA collectée
  getCollected: async (params = {}) => {
    const response = await api.get(`${VAT_REPORT_API}/collected`, { params });
    return response.data;
  },

  // Obtenir la TVA déductible
  getDeductible: async (params = {}) => {
    const response = await api.get(`${VAT_REPORT_API}/deductible`, { params });
    return response.data;
  },

  // Obtenir la TVA à payer
  getToPay: async (params = {}) => {
    const response = await api.get(`${VAT_REPORT_API}/to-pay`, { params });
    return response.data;
  },

  // Obtenir la déclaration de TVA par période
  getByPeriod: async (startDate, endDate, params = {}) => {
    const response = await api.get(`${VAT_REPORT_API}/period`, {
      params: { startDate, endDate, ...params }
    });
    return response.data;
  },

  // Générer la déclaration de TVA
  generateDeclaration: async (params = {}) => {
    const response = await api.post(`${VAT_REPORT_API}/generate`, params);
    return response.data;
  },

  // Exporter le rapport de TVA
  export: async (format = 'excel', params = {}) => {
    const response = await api.get(`${VAT_REPORT_API}/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default vatReportService;
