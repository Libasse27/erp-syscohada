/**
 * Service Bon de Commande - Gestion des bons de commande d'achat
 */

import api from './api';

const PURCHASE_ORDER_API = '/purchase-orders';

const purchaseOrderService = {
  // Obtenir tous les bons de commande avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(PURCHASE_ORDER_API, { params });
    return response.data;
  },

  // Obtenir un bon de commande par ID
  getById: async (id) => {
    const response = await api.get(`${PURCHASE_ORDER_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau bon de commande
  create: async (orderData) => {
    const response = await api.post(PURCHASE_ORDER_API, orderData);
    return response.data;
  },

  // Mettre à jour un bon de commande
  update: async (id, orderData) => {
    const response = await api.put(`${PURCHASE_ORDER_API}/${id}`, orderData);
    return response.data;
  },

  // Supprimer un bon de commande
  delete: async (id) => {
    const response = await api.delete(`${PURCHASE_ORDER_API}/${id}`);
    return response.data;
  },

  // Valider un bon de commande
  validate: async (id) => {
    const response = await api.post(`${PURCHASE_ORDER_API}/${id}/validate`);
    return response.data;
  },

  // Recevoir/Marquer comme reçu un bon de commande
  receive: async (id, receiptData) => {
    const response = await api.post(`${PURCHASE_ORDER_API}/${id}/receive`, receiptData);
    return response.data;
  },

  // Obtenir les statistiques des bons de commande
  getStats: async (params = {}) => {
    const response = await api.get(`${PURCHASE_ORDER_API}/stats`, { params });
    return response.data;
  },
};

export default purchaseOrderService;
