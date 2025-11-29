/**
 * Configuration Axios pour les appels API
 */

import axios from 'axios';
import toast from 'react-hot-toast';

// URL de base de l'API (Vite utilise import.meta.env au lieu de process.env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

// Instance Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Pour les cookies (refresh token)
});

/**
 * Intercepteur de requête
 * Ajoute le token d'accès à chaque requête
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse
 * Gère le rafraîchissement du token et les erreurs globales
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si le token est expiré (401) et que ce n'est pas déjà une tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Sauvegarder le nouveau token
        localStorage.setItem('accessToken', data.accessToken);

        // Réessayer la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return Promise.reject(refreshError);
      }
    }

    // Gestion des autres erreurs
    if (error.response) {
      const message = error.response.data?.error || 'Une erreur est survenue';

      switch (error.response.status) {
        case 400:
          toast.error(message);
          break;
        case 403:
          toast.error('Accès interdit');
          break;
        case 404:
          toast.error('Ressource non trouvée');
          break;
        case 500:
          toast.error('Erreur serveur. Veuillez réessayer.');
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      toast.error('Impossible de contacter le serveur');
    } else {
      toast.error('Une erreur est survenue');
    }

    return Promise.reject(error);
  }
);

export default api;
