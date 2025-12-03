/**
 * Service Bilan - Gestion du bilan comptable SYSCOHADA
 */

import api from './api';

const BALANCE_SHEET_API = '/reports/balance-sheet';

const balanceSheetService = {
  // Obtenir le bilan
  getAll: async (params = {}) => {
    const response = await api.get(BALANCE_SHEET_API, { params });
    return response.data;
  },

  // Obtenir le bilan par exercice
  getByFiscalYear: async (fiscalYearId, params = {}) => {
    const response = await api.get(`${BALANCE_SHEET_API}/fiscal-year/${fiscalYearId}`, { params });
    return response.data;
  },

  // Obtenir l'actif du bilan
  getAssets: async (params = {}) => {
    const response = await api.get(`${BALANCE_SHEET_API}/assets`, { params });
    return response.data;
  },

  // Obtenir le passif du bilan
  getLiabilities: async (params = {}) => {
    const response = await api.get(`${BALANCE_SHEET_API}/liabilities`, { params });
    return response.data;
  },

  // Obtenir les ratios financiers
  getRatios: async (params = {}) => {
    const response = await api.get(`${BALANCE_SHEET_API}/ratios`, { params });
    return response.data;
  },

  // Comparer deux bilans
  compare: async (year1, year2, params = {}) => {
    const response = await api.get(`${BALANCE_SHEET_API}/compare`, {
      params: { year1, year2, ...params }
    });
    return response.data;
  },

  // Exporter le bilan
  export: async (format = 'excel', params = {}) => {
    const response = await api.get(`${BALANCE_SHEET_API}/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default balanceSheetService;
