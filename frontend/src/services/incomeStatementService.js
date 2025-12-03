/**
 * Service Compte de Résultat - Gestion du compte de résultat SYSCOHADA
 */

import api from './api';

const INCOME_STATEMENT_API = '/reports/income-statement';

const incomeStatementService = {
  // Obtenir le compte de résultat
  getAll: async (params = {}) => {
    const response = await api.get(INCOME_STATEMENT_API, { params });
    return response.data;
  },

  // Obtenir le compte de résultat par exercice
  getByFiscalYear: async (fiscalYearId, params = {}) => {
    const response = await api.get(`${INCOME_STATEMENT_API}/fiscal-year/${fiscalYearId}`, { params });
    return response.data;
  },

  // Obtenir les produits (Classe 7)
  getRevenues: async (params = {}) => {
    const response = await api.get(`${INCOME_STATEMENT_API}/revenues`, { params });
    return response.data;
  },

  // Obtenir les charges (Classe 6)
  getExpenses: async (params = {}) => {
    const response = await api.get(`${INCOME_STATEMENT_API}/expenses`, { params });
    return response.data;
  },

  // Obtenir le résultat d'exploitation
  getOperatingIncome: async (params = {}) => {
    const response = await api.get(`${INCOME_STATEMENT_API}/operating-income`, { params });
    return response.data;
  },

  // Obtenir le résultat financier
  getFinancialIncome: async (params = {}) => {
    const response = await api.get(`${INCOME_STATEMENT_API}/financial-income`, { params });
    return response.data;
  },

  // Obtenir le résultat exceptionnel
  getExtraordinaryIncome: async (params = {}) => {
    const response = await api.get(`${INCOME_STATEMENT_API}/extraordinary-income`, { params });
    return response.data;
  },

  // Obtenir les ratios de rentabilité
  getRatios: async (params = {}) => {
    const response = await api.get(`${INCOME_STATEMENT_API}/ratios`, { params });
    return response.data;
  },

  // Comparer deux comptes de résultat
  compare: async (year1, year2, params = {}) => {
    const response = await api.get(`${INCOME_STATEMENT_API}/compare`, {
      params: { year1, year2, ...params }
    });
    return response.data;
  },

  // Exporter le compte de résultat
  export: async (format = 'excel', params = {}) => {
    const response = await api.get(`${INCOME_STATEMENT_API}/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default incomeStatementService;
