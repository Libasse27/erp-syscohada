/**
 * Service Facture - Gestion des factures de vente et d'achat
 */

import api from './api';

const INVOICE_API = '/invoices';

const invoiceService = {
  // Obtenir toutes les factures avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(INVOICE_API, { params });
    return response.data;
  },

  // Obtenir une facture par ID
  getById: async (id) => {
    const response = await api.get(`${INVOICE_API}/${id}`);
    return response.data;
  },

  // Cr�er une nouvelle facture
  create: async (invoiceData) => {
    const response = await api.post(INVOICE_API, invoiceData);
    return response.data;
  },

  // Mettre � jour une facture
  update: async (id, invoiceData) => {
    const response = await api.put(`${INVOICE_API}/${id}`, invoiceData);
    return response.data;
  },

  // Supprimer/Annuler une facture
  delete: async (id) => {
    const response = await api.delete(`${INVOICE_API}/${id}`);
    return response.data;
  },

  // Valider une facture
  validate: async (id) => {
    const response = await api.post(`${INVOICE_API}/${id}/validate`);
    return response.data;
  },

  // Mettre à jour le statut d'une facture
  updateStatus: async (id, status) => {
    const response = await api.patch(`${INVOICE_API}/${id}/status`, { status });
    return response.data;
  },

  // Obtenir les factures en retard
  getOverdue: async () => {
    const response = await api.get(`${INVOICE_API}/overdue`);
    return response.data;
  },

  // Obtenir les statistiques des factures
  getStats: async (params = {}) => {
    const response = await api.get(`${INVOICE_API}/stats`, { params });
    return response.data;
  },

  // T�l�charger une facture en PDF
  downloadPDF: async (id) => {
    const response = await api.get(`${INVOICE_API}/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default invoiceService;
