/**
 * Page Dashboard
 * Tableau de bord principal après connexion
 */

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-md-block bg-dark sidebar vh-100">
          <div className="position-sticky pt-3">
            <div className="text-white p-3">
              <h5 className="mb-0">ERP SYSCOHADA</h5>
              <small className="text-muted">v1.0.0</small>
            </div>
            <ul className="nav flex-column text-white">
              <li className="nav-item">
                <a className="nav-link text-white active" href="#">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white-50" href="#">
                  <i className="bi bi-box me-2"></i>
                  Produits
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white-50" href="#">
                  <i className="bi bi-people me-2"></i>
                  Clients
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white-50" href="#">
                  <i className="bi bi-receipt me-2"></i>
                  Factures
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white-50" href="#">
                  <i className="bi bi-graph-up me-2"></i>
                  Comptabilité
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          {/* Header */}
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Tableau de bord</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {user?.fullName || user?.email}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <span className="dropdown-item-text">
                      <small className="text-muted">
                        Rôle: <span className="badge bg-primary">{user?.role}</span>
                      </small>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-person me-2"></i>
                      Profil
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-gear me-2"></i>
                      Paramètres
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Welcome message */}
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">
              <i className="bi bi-check-circle-fill me-2"></i>
              Bienvenue, {user?.firstName} !
            </h4>
            <p className="mb-0">
              Vous êtes connecté avec succès au système ERP SYSCOHADA.
            </p>
          </div>

          {/* Stats cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-primary">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Ventes du jour</h6>
                      <h3 className="mb-0">0 XOF</h3>
                    </div>
                    <div className="text-primary">
                      <i className="bi bi-cart3 fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-success">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Factures payées</h6>
                      <h3 className="mb-0">0</h3>
                    </div>
                    <div className="text-success">
                      <i className="bi bi-receipt-cutoff fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-warning">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Clients actifs</h6>
                      <h3 className="mb-0">0</h3>
                    </div>
                    <div className="text-warning">
                      <i className="bi bi-people fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-info">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Produits en stock</h6>
                      <h3 className="mb-0">0</h3>
                    </div>
                    <div className="text-info">
                      <i className="bi bi-box-seam fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Informations utilisateur</h5>
            </div>
            <div className="card-body">
              <dl className="row mb-0">
                <dt className="col-sm-3">Nom complet:</dt>
                <dd className="col-sm-9">{user?.fullName}</dd>

                <dt className="col-sm-3">Email:</dt>
                <dd className="col-sm-9">{user?.email}</dd>

                <dt className="col-sm-3">Rôle:</dt>
                <dd className="col-sm-9">
                  <span className="badge bg-primary">{user?.role}</span>
                </dd>

                <dt className="col-sm-3">Téléphone:</dt>
                <dd className="col-sm-9">{user?.phone || 'Non renseigné'}</dd>

                <dt className="col-sm-3">Compte actif:</dt>
                <dd className="col-sm-9">
                  <span className={`badge ${user?.isActive ? 'bg-success' : 'bg-danger'}`}>
                    {user?.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </dd>

                <dt className="col-sm-3">Email vérifié:</dt>
                <dd className="col-sm-9">
                  <span className={`badge ${user?.isEmailVerified ? 'bg-success' : 'bg-warning'}`}>
                    {user?.isEmailVerified ? 'Vérifié' : 'Non vérifié'}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
