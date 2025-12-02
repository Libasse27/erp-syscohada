/**
 * Service Stock - Gestion des mouvements de stock
 */

import api from './api';

const STOCK_API = '/stock';

const stockService = {
  // Obtenir tous les mouvements de stock avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(STOCK_API, { params });
    return response.data;
  },

  // Obtenir un mouvement de stock par ID
  getById: async (id) => {
    const response = await api.get(`${STOCK_API}/${id}`);
    return response.data;
  },

  // Créer une entrée de stock
  createStockIn: async (stockData) => {
    const response = await api.post(`${STOCK_API}/in`, stockData);
    return response.data;
  },

  // Créer une sortie de stock
  createStockOut: async (stockData) => {
    const response = await api.post(`${STOCK_API}/out`, stockData);
    return response.data;
  },

  // Créer un transfert de stock
  createTransfer: async (transferData) => {
    const response = await api.post(`${STOCK_API}/transfer`, transferData);
    return response.data;
  },

  // Créer un ajustement de stock
  createAdjustment: async (adjustmentData) => {
    const response = await api.post(`${STOCK_API}/adjustment`, adjustmentData);
    return response.data;
  },

  // Obtenir les produits en stock faible
  getLowStock: async () => {
    const response = await api.get(`${STOCK_API}/low-stock`);
    return response.data;
  },

  // Obtenir l'historique de stock d'un produit
  getProductHistory: async (productId, params = {}) => {
    const response = await api.get(`${STOCK_API}/product/${productId}/history`, { params });
    return response.data;
  },
};

export default stockService;
