/**
 * Service Catégorie - Gestion des catégories de produits
 */

import api from './api';

const CATEGORY_API = '/categories';

const categoryService = {
  // Obtenir toutes les catégories avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(CATEGORY_API, { params });
    return response.data;
  },

  // Obtenir une catégorie par ID
  getById: async (id) => {
    const response = await api.get(`${CATEGORY_API}/${id}`);
    return response.data;
  },

  // Créer une nouvelle catégorie
  create: async (categoryData) => {
    const response = await api.post(CATEGORY_API, categoryData);
    return response.data;
  },

  // Mettre à jour une catégorie
  update: async (id, categoryData) => {
    const response = await api.put(`${CATEGORY_API}/${id}`, categoryData);
    return response.data;
  },

  // Supprimer une catégorie
  delete: async (id) => {
    const response = await api.delete(`${CATEGORY_API}/${id}`);
    return response.data;
  },

  // Obtenir les produits d'une catégorie
  getProducts: async (id, params = {}) => {
    const response = await api.get(`${CATEGORY_API}/${id}/products`, { params });
    return response.data;
  },

  // Obtenir les sous-catégories
  getSubcategories: async (id, params = {}) => {
    const response = await api.get(`${CATEGORY_API}/${id}/subcategories`, { params });
    return response.data;
  },

  // Obtenir les statistiques d'une catégorie
  getStats: async (id) => {
    const response = await api.get(`${CATEGORY_API}/${id}/stats`);
    return response.data;
  },

  // Obtenir l'arbre des catégories (hiérarchie)
  getTree: async () => {
    const response = await api.get(`${CATEGORY_API}/tree`);
    return response.data;
  },
};

export default categoryService;
