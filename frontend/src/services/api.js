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

// Variables pour gérer le rafraîchissement du token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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

    // Ne pas gérer les 401 pour les requêtes de refresh elles-mêmes
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Si le token est expiré (401) et que ce n'est pas déjà une tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si on est déjà en train de rafraîchir, mettre en file d'attente
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenter de rafraîchir le token
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Sauvegarder le nouveau token
        const newToken = data.accessToken;
        localStorage.setItem('accessToken', newToken);

        // Mettre à jour le header de la requête originale
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Traiter la file d'attente
        processQueue(null, newToken);

        // Réessayer la requête originale avec le nouveau token
        return api(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
          // Ne pas afficher de toast pour les 404
          break;
        case 500:
          toast.error('Erreur serveur. Veuillez réessayer.');
          break;
        default:
          // Ne pas afficher de toast pour les 401 (déjà gérés)
          if (error.response.status !== 401) {
            toast.error(message);
          }
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
