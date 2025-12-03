/**
 * Service Utilisateur - Gestion des utilisateurs
 */

import api from './api';

const USER_API = '/users';

const userService = {
  // Obtenir tous les utilisateurs avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(USER_API, { params });
    return response.data;
  },

  // Obtenir un utilisateur par ID
  getById: async (id) => {
    const response = await api.get(`${USER_API}/${id}`);
    return response.data;
  },

  // Créer un nouveau utilisateur
  create: async (userData) => {
    const response = await api.post(USER_API, userData);
    return response.data;
  },

  // Mettre à jour un utilisateur
  update: async (id, userData) => {
    const response = await api.put(`${USER_API}/${id}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur
  delete: async (id) => {
    const response = await api.delete(`${USER_API}/${id}`);
    return response.data;
  },

  // Activer/Désactiver un utilisateur
  toggleActive: async (id) => {
    const response = await api.patch(`${USER_API}/${id}/toggle-active`);
    return response.data;
  },

  // Changer le mot de passe d'un utilisateur
  changePassword: async (id, passwordData) => {
    const response = await api.put(`${USER_API}/${id}/password`, passwordData);
    return response.data;
  },

  // Réinitialiser le mot de passe d'un utilisateur
  resetPassword: async (id) => {
    const response = await api.post(`${USER_API}/${id}/reset-password`);
    return response.data;
  },

  // Obtenir les permissions d'un utilisateur
  getPermissions: async (id) => {
    const response = await api.get(`${USER_API}/${id}/permissions`);
    return response.data;
  },

  // Mettre à jour les permissions d'un utilisateur
  updatePermissions: async (id, permissions) => {
    const response = await api.put(`${USER_API}/${id}/permissions`, permissions);
    return response.data;
  },

  // Obtenir le profil de l'utilisateur connecté
  getProfile: async () => {
    const response = await api.get(`${USER_API}/profile`);
    return response.data;
  },

  // Mettre à jour le profil de l'utilisateur connecté
  updateProfile: async (profileData) => {
    const response = await api.put(`${USER_API}/profile`, profileData);
    return response.data;
  },
};

export default userService;
