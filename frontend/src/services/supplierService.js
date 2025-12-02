/**
 * Service Fournisseur - Gestion des fournisseurs
 */

import api from './api';

const SUPPLIER_API = '/suppliers';

const supplierService = {
  // Obtenir tous les fournisseurs avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(SUPPLIER_API, { params });
    return response.data;
  },

  // Obtenir un fournisseur par ID
  getById: async (id) => {
    const response = await api.get(`${SUPPLIER_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau fournisseur
  create: async (supplierData) => {
    const response = await api.post(SUPPLIER_API, supplierData);
    return response.data;
  },

  // Mettre à jour un fournisseur
  update: async (id, supplierData) => {
    const response = await api.put(`${SUPPLIER_API}/${id}`, supplierData);
    return response.data;
  },

  // Supprimer un fournisseur
  delete: async (id) => {
    const response = await api.delete(`${SUPPLIER_API}/${id}`);
    return response.data;
  },

  // Obtenir les statistiques d'un fournisseur
  getStats: async (id) => {
    const response = await api.get(`${SUPPLIER_API}/${id}/stats`);
    return response.data;
  },
};

export default supplierService;
