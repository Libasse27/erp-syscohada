/**
 * Point d'entrée de l'application React
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import App from './App';

// Import des styles (ordre important!)
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/theme.scss'; // Thème Bootstrap personnalisé (remplace bootstrap.min.css)
import './styles/layout.scss'; // Styles du layout (Header, Sidebar, Footer)
import './styles/variables.css'; // Variables CSS
import './styles/compatibility.css'; // Compatibilité Bootstrap/Tailwind
import './styles/custom-bootstrap.css'; // Personnalisations Bootstrap
import './styles/index.css'; // Styles globaux
import './styles/dashboard.css'; // Styles dashboard

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
