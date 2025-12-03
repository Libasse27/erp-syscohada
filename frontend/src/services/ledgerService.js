/**
 * Service Grand Livre - Gestion du grand livre général
 */

import api from './api';

const LEDGER_API = '/ledger';

const ledgerService = {
  // Obtenir les données du grand livre avec filtres
  getAll: async (params = {}) => {
    const response = await api.get(LEDGER_API, { params });
    return response.data;
  },

  // Obtenir le grand livre pour un compte spécifique
  getByAccount: async (accountId, params = {}) => {
    const response = await api.get(`${LEDGER_API}/account/${accountId}`, { params });
    return response.data;
  },

  // Obtenir le grand livre par période
  getByPeriod: async (startDate, endDate, params = {}) => {
    const response = await api.get(`${LEDGER_API}/period`, {
      params: { startDate, endDate, ...params }
    });
    return response.data;
  },

  // Obtenir le résumé du grand livre
  getSummary: async (accountId, params = {}) => {
    const response = await api.get(`${LEDGER_API}/account/${accountId}/summary`, { params });
    return response.data;
  },

  // Exporter le grand livre
  export: async (format = 'excel', params = {}) => {
    const response = await api.get(`${LEDGER_API}/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default ledgerService;
