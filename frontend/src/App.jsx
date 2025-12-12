/**
 * Composant principal de l'application ERP SYSCOHADA
 * Gère le routing et la structure de l'application
 */

import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import { selectIsAuthenticated } from './store/slices/authSlice';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import SalesRoutes from './routes/SalesRoutes';
import PurchaseRoutes from './routes/PurchaseRoutes';
import InventoryRoutes from './routes/InventoryRoutes';
import AccountingRoutes from './routes/AccountingRoutes';
import TreasuryRoutes from './routes/TreasuryRoutes';
import ReportRoutes from './routes/ReportRoutes';
import SettingsRoutes from './routes/SettingsRoutes';

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="App">
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        } />

        {/* Routes protégées avec layout */}
        <Route element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/sales/*" element={<SalesRoutes />} />
          <Route path="/dashboard/purchases/*" element={<PurchaseRoutes />} />
          <Route path="/dashboard/inventory/*" element={<InventoryRoutes />} />
          <Route path="/dashboard/accounting/*" element={<AccountingRoutes />} />
          <Route path="/dashboard/treasury/*" element={<TreasuryRoutes />} />
          <Route path="/dashboard/reports/*" element={<ReportRoutes />} />
          <Route path="/dashboard/settings/*" element={<SettingsRoutes />} />
        </Route>

        {/* Redirection par défaut */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />

        {/* Route 404 - Page non trouvée */}
        <Route path="*" element={
          <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center p-5">
              <div className="mb-4">
                <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '5rem' }}></i>
              </div>
              <h1 className="display-1 fw-bold text-dark mb-3">404</h1>
              <h2 className="h4 text-muted mb-4">Page non trouvée</h2>
              <p className="text-secondary mb-4">
                La page que vous recherchez n'existe pas ou a été déplacée.
              </p>
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-house"></i>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
