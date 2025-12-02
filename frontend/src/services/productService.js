/**
 * Service Produit - Gestion des produits et services
 */

import api from './api';

const PRODUCT_API = '/products';

const productService = {
  // Obtenir tous les produits avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(PRODUCT_API, { params });
    return response.data;
  },

  // Obtenir un produit par ID
  getById: async (id) => {
    const response = await api.get(`${PRODUCT_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau produit
  create: async (productData) => {
    const response = await api.post(PRODUCT_API, productData);
    return response.data;
  },

  // Mettre à jour un produit
  update: async (id, productData) => {
    const response = await api.put(`${PRODUCT_API}/${id}`, productData);
    return response.data;
  },

  // Supprimer un produit
  delete: async (id) => {
    const response = await api.delete(`${PRODUCT_API}/${id}`);
    return response.data;
  },

  // Ajuster le stock d'un produit
  adjustStock: async (id, adjustment) => {
    const response = await api.post(`${PRODUCT_API}/${id}/adjust-stock`, adjustment);
    return response.data;
  },

  // Obtenir les produits en rupture de stock
  getOutOfStock: async () => {
    const response = await api.get(`${PRODUCT_API}/out-of-stock`);
    return response.data;
  },

  // Obtenir les produits en stock faible
  getLowStock: async () => {
    const response = await api.get(`${PRODUCT_API}/low-stock`);
    return response.data;
  },
};

export default productService;
