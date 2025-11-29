/**
 * Service d'authentification
 * Gestion des appels API pour l'authentification
 */

import api from './api';

const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise}
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);

    // Sauvegarder le token d'accès
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response;
  },

  /**
   * Connexion d'un utilisateur
   * @param {Object} credentials - Email et mot de passe
   * @returns {Promise}
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);

    // Sauvegarder le token d'accès
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response;
  },

  /**
   * Déconnexion de l'utilisateur
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Supprimer le token même si la requête échoue
      localStorage.removeItem('accessToken');
    }
  },

  /**
   * Rafraîchir le token d'accès
   * @returns {Promise}
   */
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');

    // Sauvegarder le nouveau token d'accès
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response;
  },

  /**
   * Récupérer les informations de l'utilisateur connecté
   * @returns {Promise}
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  /**
   * Mettre à jour le profil de l'utilisateur
   * @param {Object} userData - Données à mettre à jour
   * @returns {Promise}
   */
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response;
  },

  /**
   * Changer le mot de passe
   * @param {Object} passwordData - Ancien et nouveau mot de passe
   * @returns {Promise}
   */
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response;
  },

  /**
   * Demander la réinitialisation du mot de passe
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise}
   */
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  /**
   * Réinitialiser le mot de passe
   * @param {string} token - Token de réinitialisation
   * @param {string} password - Nouveau mot de passe
   * @returns {Promise}
   */
  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
    });
    return response;
  },

  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Récupérer le token d'accès
   * @returns {string|null}
   */
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },
};

export default authService;
