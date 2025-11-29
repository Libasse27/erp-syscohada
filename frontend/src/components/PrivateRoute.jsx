/**
 * Composant PrivateRoute
 * Protection des routes nécessitant une authentification
 */

import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children, roles = [], permissions = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier les rôles si spécifiés
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Vérifier les permissions si spécifiées
  if (permissions.length > 0) {
    const hasRequiredPermission = permissions.some((permission) =>
      user?.permissions?.includes(permission)
    );

    if (!hasRequiredPermission && user?.role !== 'admin') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Autoriser l'accès
  return children;
};

export default PrivateRoute;
