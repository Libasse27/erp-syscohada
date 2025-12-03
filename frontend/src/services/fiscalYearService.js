/**
 * Service Exercice Comptable - Gestion des exercices comptables
 */

import api from './api';

const FISCAL_YEAR_API = '/fiscal-years';

const fiscalYearService = {
  // Obtenir tous les exercices comptables
  getAll: async (params = {}) => {
    const response = await api.get(FISCAL_YEAR_API, { params });
    return response.data;
  },

  // Obtenir un exercice comptable par ID
  getById: async (id) => {
    const response = await api.get(`${FISCAL_YEAR_API}/${id}`);
    return response.data;
  },

  // Obtenir l'exercice actif
  getActive: async () => {
    const response = await api.get(`${FISCAL_YEAR_API}/active`);
    return response.data;
  },

  // Créer un nouvel exercice comptable
  create: async (fiscalYearData) => {
    const response = await api.post(FISCAL_YEAR_API, fiscalYearData);
    return response.data;
  },

  // Mettre à jour un exercice comptable
  update: async (id, fiscalYearData) => {
    const response = await api.put(`${FISCAL_YEAR_API}/${id}`, fiscalYearData);
    return response.data;
  },

  // Supprimer un exercice comptable
  delete: async (id) => {
    const response = await api.delete(`${FISCAL_YEAR_API}/${id}`);
    return response.data;
  },

  // Définir l'exercice actif
  setActive: async (id) => {
    const response = await api.post(`${FISCAL_YEAR_API}/${id}/set-active`);
    return response.data;
  },

  // Clôturer un exercice comptable
  close: async (id) => {
    const response = await api.post(`${FISCAL_YEAR_API}/${id}/close`);
    return response.data;
  },

  // Rouvrir un exercice comptable
  reopen: async (id) => {
    const response = await api.post(`${FISCAL_YEAR_API}/${id}/reopen`);
    return response.data;
  },

  // Obtenir les statistiques d'un exercice
  getStats: async (id) => {
    const response = await api.get(`${FISCAL_YEAR_API}/${id}/stats`);
    return response.data;
  },

  // Vérifier si un exercice peut être clôturé
  canClose: async (id) => {
    const response = await api.get(`${FISCAL_YEAR_API}/${id}/can-close`);
    return response.data;
  },
};

export default fiscalYearService;
