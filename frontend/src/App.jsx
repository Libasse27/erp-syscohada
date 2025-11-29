/**
 * Composant principal de l'application
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Pages (à développer progressivement)
// import Login from './pages/Auth/Login';
// import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Route de bienvenue temporaire */}
        <Route path="/" element={
          <div className="container mt-5">
            <div className="text-center">
              <h1 className="display-4 mb-4">
                <i className="bi bi-check-circle-fill text-success me-3"></i>
                ERP SYSCOHADA
              </h1>
              <p className="lead text-muted mb-4">
                Application de gestion commerciale et comptabilité pour PME sénégalaises
              </p>
              <div className="alert alert-success" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Initialisation réussie !</strong> La structure du projet est prête.
              </div>
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="card-title">Prochaines étapes</h5>
                  <ol className="text-start">
                    <li className="mb-2">Installer les dépendances : <code>npm install</code></li>
                    <li className="mb-2">Configurer le fichier <code>.env</code></li>
                    <li className="mb-2">Démarrer le serveur backend : <code>cd backend && npm run dev</code></li>
                    <li className="mb-2">Démarrer le serveur frontend : <code>cd frontend && npm start</code></li>
                    <li className="mb-2">Commencer le développement des modules</li>
                  </ol>
                </div>
              </div>
              <div className="mt-4">
                <span className="badge bg-primary me-2">React 18</span>
                <span className="badge bg-success me-2">Bootstrap 5</span>
                <span className="badge bg-info me-2">Node.js + Express</span>
                <span className="badge bg-warning text-dark me-2">MongoDB</span>
                <span className="badge bg-danger">SYSCOHADA</span>
              </div>
            </div>
          </div>
        } />

        {/* Routes d'authentification (à décommenter) */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Routes protégées (à décommenter) */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
