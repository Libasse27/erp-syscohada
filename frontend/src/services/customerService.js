/**
 * Service Client - Gestion des clients
 */

import api from './api';

const CUSTOMER_API = '/customers';

const customerService = {
  // Obtenir tous les clients avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(CUSTOMER_API, { params });
    return response.data;
  },

  // Obtenir un client par ID
  getById: async (id) => {
    const response = await api.get(`${CUSTOMER_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau client
  create: async (customerData) => {
    const response = await api.post(CUSTOMER_API, customerData);
    return response.data;
  },

  // Mettre à jour un client
  update: async (id, customerData) => {
    const response = await api.put(`${CUSTOMER_API}/${id}`, customerData);
    return response.data;
  },

  // Supprimer un client
  delete: async (id) => {
    const response = await api.delete(`${CUSTOMER_API}/${id}`);
    return response.data;
  },

  // Obtenir les meilleurs clients
  getTopCustomers: async (limit = 10) => {
    const response = await api.get(`${CUSTOMER_API}/top`, { params: { limit } });
    return response.data;
  },

  // Obtenir les statistiques d'un client
  getStats: async (id) => {
    const response = await api.get(`${CUSTOMER_API}/${id}/stats`);
    return response.data;
  },
};

export default customerService;
