/**
 * Service Compte - Gestion du plan comptable SYSCOHADA
 */

import api from './api';

const ACCOUNT_API = '/accounts';

const accountService = {
  // Obtenir tous les comptes avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(ACCOUNT_API, { params });
    return response.data;
  },

  // Obtenir un compte par ID
  getById: async (id) => {
    const response = await api.get(`${ACCOUNT_API}/${id}`);
    return response.data;
  },

  // Obtenir un compte par code
  getByCode: async (code) => {
    const response = await api.get(`${ACCOUNT_API}/code/${code}`);
    return response.data;
  },

  // Créer un nouveau compte
  create: async (accountData) => {
    const response = await api.post(ACCOUNT_API, accountData);
    return response.data;
  },

  // Mettre à jour un compte
  update: async (id, accountData) => {
    const response = await api.put(`${ACCOUNT_API}/${id}`, accountData);
    return response.data;
  },

  // Supprimer un compte
  delete: async (id) => {
    const response = await api.delete(`${ACCOUNT_API}/${id}`);
    return response.data;
  },

  // Obtenir le solde d'un compte
  getBalance: async (id, params = {}) => {
    const response = await api.get(`${ACCOUNT_API}/${id}/balance`, { params });
    return response.data;
  },
};

export default accountService;
