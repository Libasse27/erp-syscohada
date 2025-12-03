/**
 * Service Journal - Gestion des journaux comptables
 */

import api from './api';

const JOURNAL_API = '/journals';

const journalService = {
  // Obtenir tous les journaux avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(JOURNAL_API, { params });
    return response.data;
  },

  // Obtenir un journal par ID
  getById: async (id) => {
    const response = await api.get(`${JOURNAL_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau journal
  create: async (journalData) => {
    const response = await api.post(JOURNAL_API, journalData);
    return response.data;
  },

  // Mettre à jour un journal
  update: async (id, journalData) => {
    const response = await api.put(`${JOURNAL_API}/${id}`, journalData);
    return response.data;
  },

  // Supprimer un journal
  delete: async (id) => {
    const response = await api.delete(`${JOURNAL_API}/${id}`);
    return response.data;
  },

  // Obtenir les écritures d'un journal
  getEntries: async (id, params = {}) => {
    const response = await api.get(`${JOURNAL_API}/${id}/entries`, { params });
    return response.data;
  },

  // Obtenir les statistiques d'un journal
  getStats: async (id, params = {}) => {
    const response = await api.get(`${JOURNAL_API}/${id}/stats`, { params });
    return response.data;
  },
};

export default journalService;
