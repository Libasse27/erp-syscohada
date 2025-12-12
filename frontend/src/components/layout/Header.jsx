/**
 * Header - Barre de navigation supérieure
 * Affiche le logo, la recherche, les notifications, le thème et le profil utilisateur
 */

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  toggleSidebar,
  toggleTheme,
  toggleSearch,
  selectTheme,
  selectSearchOpen,
} from '../../store/slices/uiSlice';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const searchOpen = useSelector(selectSearchOpen);
  const currentUser = useSelector(selectCurrentUser);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left side - Menu toggle and Logo */}
        <div className="header-left">
          {/* Mobile menu toggle */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="sidebar-toggle"
            aria-label="Toggle menu"
          >
            <i className="bi bi-list"></i>
          </button>

          {/* Logo */}
          <Link to="/dashboard" className="header-logo">
            <div className="header-logo-icon">E</div>
            <span className="header-logo-text">ERP SYSCOHADA</span>
          </Link>
        </div>

        {/* Right side - Search, Notifications, Theme, Profile */}
        <div className="header-right">
          {/* Search button */}
          <button
            onClick={() => dispatch(toggleSearch())}
            className="header-action-btn"
            aria-label="Search"
            title="Rechercher"
          >
            <i className="bi bi-search"></i>
          </button>

          {/* Notifications */}
          <button
            className="header-action-btn"
            aria-label="Notifications"
            title="Notifications"
          >
            <i className="bi bi-bell"></i>
            {/* Notification badge */}
            <span className="header-badge">3</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="header-action-btn"
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          >
            {theme === 'light' ? (
              <i className="bi bi-moon"></i>
            ) : (
              <i className="bi bi-sun"></i>
            )}
          </button>

          {/* Divider */}
          <div className="header-divider"></div>

          {/* User profile dropdown */}
          <div className="header-profile" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="header-profile-btn">
              <div className="header-avatar">
                <span>{getUserInitials()}</span>
                <span className="header-avatar-status"></span>
              </div>
              <div className="header-profile-info">
                <span className="header-profile-name">{getUserName()}</span>
                <span className="header-profile-role">{getUserRole()}</span>
              </div>
              <i className={`bi bi-chevron-down header-profile-arrow ${dropdownOpen ? 'rotate' : ''}`}></i>
            </button>

            {/* Dropdown menu */}
            <div className={`header-dropdown ${dropdownOpen ? 'active' : ''}`}>
              {/* User info section */}
              <div className="header-dropdown-header">
                <div className="header-dropdown-user">
                  <div className="header-avatar">
                    <span>{getUserInitials()}</span>
                  </div>
                  <div className="header-dropdown-user-info">
                    <div className="header-dropdown-user-name">{getUserName()}</div>
                    <div className="header-dropdown-user-email">{currentUser?.email}</div>
                  </div>
                </div>
                <span className="header-dropdown-badge">
                  <i className="bi bi-shield-check"></i>
                  {getUserRole()}
                </span>
              </div>

              {/* Menu items */}
              <ul className="header-dropdown-menu">
                <li className="header-dropdown-item">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="header-dropdown-link"
                  >
                    <i className="bi bi-person"></i>
                    <span>Mon profil</span>
                  </Link>
                </li>
                <li className="header-dropdown-item">
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="header-dropdown-link"
                  >
                    <i className="bi bi-gear"></i>
                    <span>Paramètres</span>
                  </Link>
                </li>
                <li className="header-dropdown-item">
                  <Link
                    to="/help"
                    onClick={() => setDropdownOpen(false)}
                    className="header-dropdown-link"
                  >
                    <i className="bi bi-question-circle"></i>
                    <span>Aide</span>
                  </Link>
                </li>
              </ul>

              <div className="header-dropdown-divider"></div>

              {/* Logout */}
              <ul className="header-dropdown-menu">
                <li className="header-dropdown-item">
                  <button onClick={handleLogout} className="header-dropdown-link danger">
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Déconnexion</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar (expanded) */}
      {searchOpen && (
        <div className="header-search-expanded">
          <div className="header-search-container">
            <div className="header-search-wrapper">
              <i className="bi bi-search header-search-icon"></i>
              <input
                type="text"
                placeholder="Rechercher des factures, clients, produits..."
                className="header-search-input"
                autoFocus
              />
              <button
                onClick={() => dispatch(toggleSearch())}
                className="header-search-close"
                aria-label="Fermer la recherche"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        /* Styles supplémentaires pour la barre de recherche étendue */
        .header-search-expanded {
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          padding: var(--spacing-4);
          animation: slideDown 0.3s ease-out;
        }

        .header-search-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .header-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .header-search-icon {
          position: absolute;
          left: var(--spacing-3);
          color: var(--text-tertiary);
          font-size: var(--font-size-lg);
        }

        .header-search-input {
          width: 100%;
          padding: var(--spacing-3) var(--spacing-12) var(--spacing-3) var(--spacing-10);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-size: var(--font-size-base);
          transition: all var(--transition-speed-fast);
        }

        .header-search-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
        }

        .header-search-close {
          position: absolute;
          right: var(--spacing-3);
          background: none;
          border: none;
          padding: var(--spacing-2);
          cursor: pointer;
          color: var(--text-tertiary);
          border-radius: var(--border-radius-md);
          transition: all var(--transition-speed-fast);
        }

        .header-search-close:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .header-profile-arrow.rotate {
          transform: rotate(180deg);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
            padding-top: var(--spacing-4);
            padding-bottom: var(--spacing-4);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
