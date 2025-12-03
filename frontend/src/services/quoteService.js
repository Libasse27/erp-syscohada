/**
 * Service Devis - Gestion des devis de vente
 */

import api from './api';

const QUOTE_API = '/quotes';

const quoteService = {
  // Obtenir tous les devis avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(QUOTE_API, { params });
    return response.data;
  },

  // Obtenir un devis par ID
  getById: async (id) => {
    const response = await api.get(`${QUOTE_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau devis
  create: async (quoteData) => {
    const response = await api.post(QUOTE_API, quoteData);
    return response.data;
  },

  // Mettre à jour un devis
  update: async (id, quoteData) => {
    const response = await api.put(`${QUOTE_API}/${id}`, quoteData);
    return response.data;
  },

  // Supprimer un devis
  delete: async (id) => {
    const response = await api.delete(`${QUOTE_API}/${id}`);
    return response.data;
  },

  // Convertir un devis en facture
  convertToInvoice: async (id) => {
    const response = await api.post(`${QUOTE_API}/${id}/convert-to-invoice`);
    return response.data;
  },

  // Envoyer un devis par email
  sendByEmail: async (id, emailData) => {
    const response = await api.post(`${QUOTE_API}/${id}/send-email`, emailData);
    return response.data;
  },

  // Dupliquer un devis
  duplicate: async (id) => {
    const response = await api.post(`${QUOTE_API}/${id}/duplicate`);
    return response.data;
  },

  // Valider un devis
  validate: async (id) => {
    const response = await api.post(`${QUOTE_API}/${id}/validate`);
    return response.data;
  },

  // Rejeter un devis
  reject: async (id, reason) => {
    const response = await api.post(`${QUOTE_API}/${id}/reject`, { reason });
    return response.data;
  },

  // Obtenir le PDF d'un devis
  getPdf: async (id) => {
    const response = await api.get(`${QUOTE_API}/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Obtenir les statistiques des devis
  getStats: async (params = {}) => {
    const response = await api.get(`${QUOTE_API}/stats`, { params });
    return response.data;
  },

  // Obtenir les devis par client
  getByCustomer: async (customerId, params = {}) => {
    const response = await api.get(`${QUOTE_API}/customer/${customerId}`, { params });
    return response.data;
  },
};

export default quoteService;
