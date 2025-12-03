/**
 * Service Balance - Gestion de la balance générale
 */

import api from './api';

const TRIAL_BALANCE_API = '/trial-balance';

const trialBalanceService = {
  // Obtenir la balance générale
  getAll: async (params = {}) => {
    const response = await api.get(TRIAL_BALANCE_API, { params });
    return response.data;
  },

  // Obtenir la balance par période
  getByPeriod: async (startDate, endDate, params = {}) => {
    const response = await api.get(`${TRIAL_BALANCE_API}/period`, {
      params: { startDate, endDate, ...params }
    });
    return response.data;
  },

  // Obtenir la balance par classe de compte
  getByClass: async (classNumber, params = {}) => {
    const response = await api.get(`${TRIAL_BALANCE_API}/class/${classNumber}`, { params });
    return response.data;
  },

  // Obtenir les totaux de la balance
  getTotals: async (params = {}) => {
    const response = await api.get(`${TRIAL_BALANCE_API}/totals`, { params });
    return response.data;
  },

  // Vérifier l'équilibre de la balance
  checkBalance: async (params = {}) => {
    const response = await api.get(`${TRIAL_BALANCE_API}/check`, { params });
    return response.data;
  },

  // Exporter la balance
  export: async (format = 'excel', params = {}) => {
    const response = await api.get(`${TRIAL_BALANCE_API}/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default trialBalanceService;
