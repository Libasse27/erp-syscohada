/**
 * Sidebar - Menu de navigation latéral
 * Affiche les liens de navigation principaux et sous-menus
 */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import {
  toggleSidebar,
  selectSidebarOpen,
  selectSidebarCollapsed,
} from '../../store/slices/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);

  const menuItems = [
    {
      title: 'Tableau de bord',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      path: '/dashboard',
    },
    {
      title: 'Ventes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      children: [
        { title: 'Factures', path: '/invoices', icon: '📄' },
        { title: 'Devis', path: '/quotes', icon: '📋' },
        { title: 'Clients', path: '/customers', icon: '👥' },
      ],
    },
    {
      title: 'Achats',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      children: [
        { title: 'Commandes', path: '/purchase-orders', icon: '📦' },
        { title: 'Fournisseurs', path: '/suppliers', icon: '🏭' },
      ],
    },
    {
      title: 'Produits',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      path: '/products',
    },
    {
      title: 'Stock',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
      children: [
        { title: 'Mouvements', path: '/stock/movements', icon: '↔️' },
        { title: 'Inventaire', path: '/stock/inventory', icon: '📊' },
      ],
    },
    {
      title: 'Comptabilité',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      children: [
        { title: 'Comptes', path: '/accounts', icon: '💰' },
        { title: 'Écritures', path: '/entries', icon: '✍️' },
        { title: 'Grand livre', path: '/ledger', icon: '📖' },
        { title: 'Balance', path: '/balance', icon: '⚖️' },
      ],
    },
    {
      title: 'Paiements',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      path: '/payments',
    },
    {
      title: 'Rapports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      children: [
        { title: 'Ventes', path: '/reports/sales', icon: '📈' },
        { title: 'Achats', path: '/reports/purchases', icon: '📉' },
        { title: 'Trésorerie', path: '/reports/cash-flow', icon: '💵' },
        { title: 'Bilan', path: '/reports/balance-sheet', icon: '📊' },
      ],
    },
  ];

  // MenuItem Component
  const MenuItem = ({ item, isChild = false }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.path;
    const isParentActive =
      hasChildren && item.children.some((child) => location.pathname === child.path);

    // État local pour l'ouverture du sous-menu
    const [isOpen, setIsOpen] = useState(isParentActive);

    // Gérer les items avec sous-menus
    if (hasChildren) {
      return (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 group ${
              isParentActive
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{item.icon}</div>
              {!sidebarCollapsed && (
                <span className="text-sm font-medium truncate">{item.title}</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <svg
                className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          {/* Sous-menu avec animation */}
          {isOpen && !sidebarCollapsed && (
            <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1 animate-slideDown">
              {item.children.map((child, index) => (
                <MenuItem key={index} item={child} isChild={true} />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Items simples (sans sous-menus)
    return (
      <NavLink
        to={item.path}
        onClick={() => dispatch(toggleSidebar())}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative ${
            isActive
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          } ${isChild ? 'text-sm' : ''}`
        }
      >
        {/* Indicateur actif */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
        )}

        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Icône pour les sous-items */}
          {isChild && item.icon && <span className="text-base">{item.icon}</span>}
          {!isChild && <div className="flex-shrink-0">{item.icon}</div>}

          {/* Titre */}
          {!sidebarCollapsed && (
            <span className="font-medium truncate">{item.title}</span>
          )}
        </div>

        {/* Badge NEW (optionnel) */}
        {item.badge && !sidebarCollapsed && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-fadeIn"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out shadow-xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-blue-200 dark:ring-blue-800">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">ERP</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SYSCOHADA</p>
                </div>
              </div>
            )}

            {/* Bouton fermer (mobile) */}
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700 lg:hidden transition-colors"
              aria-label="Fermer le menu"
            >
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {menuItems.map((item, index) => (
              <MenuItem key={index} item={item} />
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            {!sidebarCollapsed ? (
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  © 2025 ERP SYSCOHADA
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Version 1.0.0</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">v1</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Custom scrollbar styles */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
