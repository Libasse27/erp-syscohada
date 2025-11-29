/**
 * Hook personnalisé pour l'authentification
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../store/slices/authSlice';
import authService from '../services/authService';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      // Si un token existe, récupérer les infos utilisateur
      if (authService.isAuthenticated() && !user && !isLoading) {
        try {
          await dispatch(getMe()).unwrap();
        } catch (err) {
          // L'erreur est gérée par le slice
        }
      }
    };

    checkAuth();
  }, [dispatch, user, isLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin: user?.role === 'admin',
    isAccountant: user?.role === 'accountant',
    isSales: user?.role === 'sales',
    hasPermission: (permission) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return user.permissions?.includes(permission);
    },
  };
};

export default useAuth;
