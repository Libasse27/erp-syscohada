/**
 * Composant principal de l'application ERP SYSCOHADA
 * Gère le routing et la structure de l'application
 */

import { Routes, Route, Navigate } from 'react-router-dom';
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
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Page non trouvée
              </p>
              <a
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
