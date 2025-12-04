/**
 * Routes pour le module Paramètres
 */

import { Routes, Route } from 'react-router-dom';
import CompanySettings from '../pages/Settings/CompanySettings';
import UserSettings from '../pages/Settings/UserSettings';
import SystemSettings from '../pages/Settings/SystemSettings';
import FiscalYearSettings from '../pages/Settings/FiscalYearSettings';

const SettingsRoutes = () => {
  return (
    <Routes>
      {/* Paramètres entreprise */}
      <Route path="company" element={<CompanySettings />} />

      {/* Paramètres utilisateurs */}
      <Route path="users" element={<UserSettings />} />

      {/* Paramètres système */}
      <Route path="system" element={<SystemSettings />} />

      {/* Exercices fiscaux */}
      <Route path="fiscal-years" element={<FiscalYearSettings />} />
    </Routes>
  );
};

export default SettingsRoutes;
