/**
 * Service Rapport - Gestion des rapports et exports
 */

import api from './api';

const REPORT_API = '/reports';

const reportService = {
  // Obtenir le rapport des ventes
  getSalesReport: async (params = {}) => {
    const response = await api.get(`${REPORT_API}/sales`, { params });
    return response.data;
  },

  // Obtenir le rapport de trésorerie
  getCashFlowReport: async (params = {}) => {
    const response = await api.get(`${REPORT_API}/cash-flow`, { params });
    return response.data;
  },

  // Obtenir le rapport de stock
  getStockReport: async (params = {}) => {
    const response = await api.get(`${REPORT_API}/stock`, { params });
    return response.data;
  },

  // Obtenir le rapport de rentabilité
  getProfitabilityReport: async (params = {}) => {
    const response = await api.get(`${REPORT_API}/profitability`, { params });
    return response.data;
  },

  // Obtenir le bilan comptable
  getBalanceSheet: async (params = {}) => {
    const response = await api.get(`${REPORT_API}/balance-sheet`, { params });
    return response.data;
  },

  // Obtenir le compte de résultat
  getIncomeStatement: async (params = {}) => {
    const response = await api.get(`${REPORT_API}/income-statement`, { params });
    return response.data;
  },

  // Exporter une facture en PDF
  exportInvoicePDF: async (invoiceId) => {
    const response = await api.get(`${REPORT_API}/invoice/${invoiceId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Exporter les factures en Excel
  exportInvoicesExcel: async (params = {}) => {
    const response = await api.get(`${REPORT_API}/invoices/excel`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Exporter les paiements en Excel
  exportPaymentsExcel: async (params = {}) => {
    const response = await api.get(`${REPORT_API}/payments/excel`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // Exporter les produits en Excel
  exportProductsExcel: async () => {
    const response = await api.get(`${REPORT_API}/products/excel`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default reportService;
