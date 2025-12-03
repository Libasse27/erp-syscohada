/**
 * Service Système - Gestion des paramètres système
 */

import api from './api';

const SYSTEM_API = '/system';

const systemService = {
  // Obtenir les paramètres système
  getSettings: async () => {
    const response = await api.get(`${SYSTEM_API}/settings`);
    return response.data;
  },

  // Mettre à jour les paramètres système
  updateSettings: async (settings) => {
    const response = await api.put(`${SYSTEM_API}/settings`, settings);
    return response.data;
  },

  // Obtenir les informations système
  getInfo: async () => {
    const response = await api.get(`${SYSTEM_API}/info`);
    return response.data;
  },

  // Obtenir les logs système
  getLogs: async (params = {}) => {
    const response = await api.get(`${SYSTEM_API}/logs`, { params });
    return response.data;
  },

  // Créer une sauvegarde
  createBackup: async () => {
    const response = await api.post(`${SYSTEM_API}/backup`);
    return response.data;
  },

  // Obtenir la liste des sauvegardes
  getBackups: async () => {
    const response = await api.get(`${SYSTEM_API}/backups`);
    return response.data;
  },

  // Restaurer une sauvegarde
  restoreBackup: async (backupId) => {
    const response = await api.post(`${SYSTEM_API}/backup/${backupId}/restore`);
    return response.data;
  },

  // Supprimer une sauvegarde
  deleteBackup: async (backupId) => {
    const response = await api.delete(`${SYSTEM_API}/backup/${backupId}`);
    return response.data;
  },

  // Vider le cache
  clearCache: async () => {
    const response = await api.post(`${SYSTEM_API}/cache/clear`);
    return response.data;
  },

  // Obtenir les statistiques système
  getStats: async () => {
    const response = await api.get(`${SYSTEM_API}/stats`);
    return response.data;
  },

  // Vérifier les mises à jour
  checkUpdates: async () => {
    const response = await api.get(`${SYSTEM_API}/updates/check`);
    return response.data;
  },

  // Effectuer une maintenance
  performMaintenance: async () => {
    const response = await api.post(`${SYSTEM_API}/maintenance`);
    return response.data;
  },
};

export default systemService;
