/**
 * Service Compte Bancaire - Gestion des comptes bancaires et caisses
 */

import api from './api';

const BANK_ACCOUNT_API = '/bank-accounts';

const bankAccountService = {
  // Obtenir tous les comptes bancaires avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(BANK_ACCOUNT_API, { params });
    return response.data;
  },

  // Obtenir un compte bancaire par ID
  getById: async (id) => {
    const response = await api.get(`${BANK_ACCOUNT_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau compte bancaire
  create: async (accountData) => {
    const response = await api.post(BANK_ACCOUNT_API, accountData);
    return response.data;
  },

  // Mettre à jour un compte bancaire
  update: async (id, accountData) => {
    const response = await api.put(`${BANK_ACCOUNT_API}/${id}`, accountData);
    return response.data;
  },

  // Supprimer un compte bancaire
  delete: async (id) => {
    const response = await api.delete(`${BANK_ACCOUNT_API}/${id}`);
    return response.data;
  },

  // Obtenir le solde d'un compte
  getBalance: async (id) => {
    const response = await api.get(`${BANK_ACCOUNT_API}/${id}/balance`);
    return response.data;
  },

  // Obtenir les transactions d'un compte
  getTransactions: async (id, params = {}) => {
    const response = await api.get(`${BANK_ACCOUNT_API}/${id}/transactions`, { params });
    return response.data;
  },

  // Effectuer un transfert entre comptes
  transfer: async (transferData) => {
    const response = await api.post(`${BANK_ACCOUNT_API}/transfer`, transferData);
    return response.data;
  },

  // Obtenir les statistiques des comptes
  getStats: async (params = {}) => {
    const response = await api.get(`${BANK_ACCOUNT_API}/stats`, { params });
    return response.data;
  },

  // Rapprocher un compte bancaire
  reconcile: async (id, reconciliationData) => {
    const response = await api.post(`${BANK_ACCOUNT_API}/${id}/reconcile`, reconciliationData);
    return response.data;
  },
};

export default bankAccountService;
