/**
 * Service Paiement - Gestion des paiements
 */

import api from './api';

const PAYMENT_API = '/payments';

const paymentService = {
  // Obtenir tous les paiements avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(PAYMENT_API, { params });
    return response.data;
  },

  // Obtenir un paiement par ID
  getById: async (id) => {
    const response = await api.get(`${PAYMENT_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau paiement
  create: async (paymentData) => {
    const response = await api.post(PAYMENT_API, paymentData);
    return response.data;
  },

  // Mettre à jour un paiement
  update: async (id, paymentData) => {
    const response = await api.put(`${PAYMENT_API}/${id}`, paymentData);
    return response.data;
  },

  // Supprimer un paiement
  delete: async (id) => {
    const response = await api.delete(`${PAYMENT_API}/${id}`);
    return response.data;
  },

  // Initier un paiement Mobile Money
  initiateMobileMoney: async (paymentData) => {
    const response = await api.post(`${PAYMENT_API}/mobile-money/initiate`, paymentData);
    return response.data;
  },

  // Vérifier un paiement Mobile Money
  verifyMobileMoney: async (verificationData) => {
    const response = await api.post(`${PAYMENT_API}/mobile-money/verify`, verificationData);
    return response.data;
  },

  // Obtenir les statistiques des paiements
  getStats: async (params = {}) => {
    const response = await api.get(`${PAYMENT_API}/stats`, { params });
    return response.data;
  },
};

export default paymentService;
