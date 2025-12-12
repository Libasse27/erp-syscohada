/**
 * Sidebar - Menu de navigation latéral
 * Affiche les liens de navigation principaux et sous-menus
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import {
  toggleSidebar,
  selectSidebarOpen,
  selectSidebarCollapsed,
} from '../../store/slices/uiSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const sidebarCollapsed = useSelector(selectSidebarCollapsed);
  const currentUser = useSelector(selectCurrentUser);

  const menuItems = [
    {
      title: 'Tableau de bord',
      icon: 'bi-house',
      path: '/dashboard',
    },
    {
      title: 'Ventes',
      icon: 'bi-cart-check',
      children: [
        { title: 'Factures', path: '/dashboard/sales/invoices', icon: '📄' },
        { title: 'Devis', path: '/dashboard/sales/quotes', icon: '📋' },
        { title: 'Clients', path: '/dashboard/sales/customers', icon: '👥' },
      ],
    },
    {
      title: 'Achats',
      icon: 'bi-basket',
      children: [
        { title: 'Commandes', path: '/dashboard/purchases/orders', icon: '📦' },
        { title: 'Fournisseurs', path: '/dashboard/purchases/suppliers', icon: '🏭' },
      ],
    },
    {
      title: 'Produits',
      icon: 'bi-box-seam',
      path: '/dashboard/inventory/products',
    },
    {
      title: 'Stock',
      icon: 'bi-boxes',
      children: [
        { title: 'Mouvements', path: '/dashboard/inventory/movements', icon: '↔️' },
        { title: 'Inventaire', path: '/dashboard/inventory/stock', icon: '📊' },
      ],
    },
    {
      title: 'Comptabilité',
      icon: 'bi-calculator',
      children: [
        { title: 'Comptes', path: '/dashboard/accounting/accounts', icon: '💰' },
        { title: 'Écritures', path: '/dashboard/accounting/entries', icon: '✍️' },
        { title: 'Grand livre', path: '/dashboard/accounting/ledger', icon: '📖' },
        { title: 'Balance', path: '/dashboard/accounting/balance', icon: '⚖️' },
      ],
    },
    {
      title: 'Paiements',
      icon: 'bi-credit-card',
      path: '/dashboard/treasury/payments',
    },
    {
      title: 'Rapports',
      icon: 'bi-graph-up',
      children: [
        { title: 'Ventes', path: '/dashboard/reports/sales', icon: '📈' },
        { title: 'Achats', path: '/dashboard/reports/purchases', icon: '📉' },
        { title: 'Trésorerie', path: '/dashboard/reports/treasury', icon: '💵' },
        { title: 'Bilan', path: '/dashboard/reports/balance-sheet', icon: '📊' },
      ],
    },
  ];

  // Obtenir le nom complet ou l'email de l'utilisateur
  const getUserName = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser?.name) {
      return currentUser.name;
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    const name = getUserName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Obtenir le rôle de l'utilisateur
  const getUserRole = () => {
    const roleLabels = {
      admin: 'Administrateur',
      accountant: 'Comptable',
      sales: 'Commercial',
      user: 'Utilisateur',
    };
    return roleLabels[currentUser?.role] || roleLabels.user;
  };

  // MenuItem Component
  const MenuItem = ({ item, isChild = false }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.path;
    const isParentActive =
      hasChildren && item.children.some((child) => location.pathname.startsWith(child.path));

    // État local pour l'ouverture du sous-menu
    const [isOpen, setIsOpen] = useState(isParentActive);

    // Ouvrir automatiquement si un enfant est actif
    useEffect(() => {
      if (isParentActive && !sidebarCollapsed) {
        setIsOpen(true);
      }
    }, [isParentActive, sidebarCollapsed]);

    // Gérer les items avec sous-menus
    if (hasChildren) {
      return (
        <li className="sidebar-menu-item">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`sidebar-menu-link ${isParentActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
            data-tooltip={sidebarCollapsed ? item.title : ''}
          >
            <span className="sidebar-menu-icon">
              <i className={item.icon}></i>
            </span>
            <span className="sidebar-menu-text">{item.title}</span>
            <i className="bi bi-chevron-right sidebar-menu-arrow"></i>
          </button>

          {/* Sous-menu */}
          <ul className={`sidebar-submenu ${isOpen ? 'open' : ''}`}>
            {item.children.map((child, index) => (
              <MenuItem key={index} item={child} isChild={true} />
            ))}
          </ul>
        </li>
      );
    }

    // Items simples (sans sous-menus)
    if (isChild) {
      return (
        <li className="sidebar-submenu-item">
          <NavLink
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 1024) {
                dispatch(toggleSidebar());
              }
            }}
            className={({ isActive }) =>
              `sidebar-submenu-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-submenu-emoji">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        </li>
      );
    }

    return (
      <li className="sidebar-menu-item">
        <NavLink
          to={item.path}
          onClick={() => {
            if (window.innerWidth < 1024) {
              dispatch(toggleSidebar());
            }
          }}
          className={({ isActive }) =>
            `sidebar-menu-link ${isActive ? 'active' : ''}`
          }
          data-tooltip={sidebarCollapsed ? item.title : ''}
        >
          <span className="sidebar-menu-icon">
            <i className={item.icon}></i>
          </span>
          <span className="sidebar-menu-text">{item.title}</span>
          {item.badge && (
            <span className="sidebar-menu-badge">{item.badge}</span>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${
          sidebarOpen ? 'mobile-visible' : 'mobile-hidden'
        }`}
      >
        {/* Sidebar header */}
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-header-brand">
            <div className="sidebar-header-icon">E</div>
            <span className="sidebar-header-text">ERP SYSCOHADA</span>
          </NavLink>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="sidebar-toggle-btn"
            aria-label="Fermer le menu"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item, index) => (
              <MenuItem key={index} item={item} />
            ))}
          </ul>

          {/* Divider */}
          <div className="sidebar-divider"></div>

          {/* Section supplémentaire */}
          <div className="sidebar-divider-text">
            <i className="bi bi-gear"></i>
            <span>Paramètres</span>
          </div>

          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <NavLink
                to="/dashboard/settings"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    dispatch(toggleSidebar());
                  }
                }}
                className={({ isActive }) =>
                  `sidebar-menu-link ${isActive ? 'active' : ''}`
                }
                data-tooltip={sidebarCollapsed ? 'Paramètres' : ''}
              >
                <span className="sidebar-menu-icon">
                  <i className="bi bi-gear"></i>
                </span>
                <span className="sidebar-menu-text">Paramètres</span>
              </NavLink>
            </li>
            <li className="sidebar-menu-item">
              <NavLink
                to="/dashboard/help"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    dispatch(toggleSidebar());
                  }
                }}
                className={({ isActive }) =>
                  `sidebar-menu-link ${isActive ? 'active' : ''}`
                }
                data-tooltip={sidebarCollapsed ? 'Aide' : ''}
              >
                <span className="sidebar-menu-icon">
                  <i className="bi bi-question-circle"></i>
                </span>
                <span className="sidebar-menu-text">Aide</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="sidebar-footer">
          {!sidebarCollapsed ? (
            <>
              <div className="sidebar-footer-user">
                <div className="sidebar-footer-avatar">
                  {getUserInitials()}
                </div>
                <div className="sidebar-footer-info">
                  <span className="sidebar-footer-name">{getUserName()}</span>
                  <span className="sidebar-footer-role">{getUserRole()}</span>
                </div>
              </div>
              <div className="sidebar-version">v1.0.0</div>
            </>
          ) : (
            <div className="sidebar-footer-collapsed">
              <div className="sidebar-footer-avatar" data-tooltip={getUserName()}>
                {getUserInitials()}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
