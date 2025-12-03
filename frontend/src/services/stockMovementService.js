/**
 * Service Mouvement de Stock - Gestion des mouvements de stock
 */

import api from './api';

const STOCK_MOVEMENT_API = '/stock-movements';

const stockMovementService = {
  // Obtenir tous les mouvements de stock avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(STOCK_MOVEMENT_API, { params });
    return response.data;
  },

  // Obtenir un mouvement de stock par ID
  getById: async (id) => {
    const response = await api.get(`${STOCK_MOVEMENT_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau mouvement de stock
  create: async (movementData) => {
    const response = await api.post(STOCK_MOVEMENT_API, movementData);
    return response.data;
  },

  // Mettre à jour un mouvement de stock
  update: async (id, movementData) => {
    const response = await api.put(`${STOCK_MOVEMENT_API}/${id}`, movementData);
    return response.data;
  },

  // Supprimer un mouvement de stock
  delete: async (id) => {
    const response = await api.delete(`${STOCK_MOVEMENT_API}/${id}`);
    return response.data;
  },

  // Obtenir les mouvements par produit
  getByProduct: async (productId, params = {}) => {
    const response = await api.get(`${STOCK_MOVEMENT_API}/product/${productId}`, { params });
    return response.data;
  },

  // Obtenir les mouvements par type (entrée/sortie)
  getByType: async (type, params = {}) => {
    const response = await api.get(`${STOCK_MOVEMENT_API}/type/${type}`, { params });
    return response.data;
  },

  // Obtenir les mouvements par période
  getByPeriod: async (startDate, endDate, params = {}) => {
    const response = await api.get(`${STOCK_MOVEMENT_API}/period`, {
      params: { startDate, endDate, ...params }
    });
    return response.data;
  },

  // Enregistrer une entrée de stock
  recordEntry: async (entryData) => {
    const response = await api.post(`${STOCK_MOVEMENT_API}/entry`, entryData);
    return response.data;
  },

  // Enregistrer une sortie de stock
  recordExit: async (exitData) => {
    const response = await api.post(`${STOCK_MOVEMENT_API}/exit`, exitData);
    return response.data;
  },

  // Enregistrer un transfert de stock
  recordTransfer: async (transferData) => {
    const response = await api.post(`${STOCK_MOVEMENT_API}/transfer`, transferData);
    return response.data;
  },

  // Enregistrer un ajustement de stock
  recordAdjustment: async (adjustmentData) => {
    const response = await api.post(`${STOCK_MOVEMENT_API}/adjustment`, adjustmentData);
    return response.data;
  },

  // Obtenir les statistiques des mouvements
  getStats: async (params = {}) => {
    const response = await api.get(`${STOCK_MOVEMENT_API}/stats`, { params });
    return response.data;
  },

  // Exporter les mouvements de stock
  export: async (format = 'excel', params = {}) => {
    const response = await api.get(`${STOCK_MOVEMENT_API}/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default stockMovementService;
