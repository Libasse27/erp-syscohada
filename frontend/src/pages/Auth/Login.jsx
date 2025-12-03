/**
 * Page de connexion - Page de garde du projet ERP SYSCOHADA
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { login, clearError } from '../../store/slices/authSlice';
import './Login.scss';

// Schéma de validation
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalide')
    .required('L\'email est requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Afficher les erreurs
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Soumission du formulaire
  const handleSubmit = async (values) => {
    try {
      await dispatch(login(values)).unwrap();
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (err) {
      // L'erreur est déjà gérée par le useEffect ci-dessus
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Panneau gauche - Présentation */}
        <div className="login-presentation">
          <div className="presentation-content">
            {/* Logo et titre principal */}
            <div className="presentation-header">
              <div className="logo-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="logo-svg">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#f4b944', stopOpacity: 1}} />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="48" fill="url(#logoGrad)" stroke="#ffffff" strokeWidth="2"/>
                  <text x="50" y="62" fontFamily="Inter, Arial, sans-serif" fontSize="36" fontWeight="700" fill="#0c4da2" textAnchor="middle">ERP</text>
                  <rect x="20" y="70" width="60" height="4" fill="#0c4da2" rx="2"/>
                </svg>
              </div>
              <h1 className="presentation-title">ERP SYSCOHADA</h1>
              <p className="presentation-subtitle">Solution de Gestion Intégrée</p>
            </div>

            {/* Fonctionnalités clés */}
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <div className="feature-content">
                  <h3>Gestion Commerciale</h3>
                  <p>Devis, factures, avoirs et suivi clients en temps réel</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-calculator"></i>
                </div>
                <div className="feature-content">
                  <h3>Comptabilité SYSCOHADA</h3>
                  <p>Conforme aux normes comptables ouest-africaines</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-box-seam"></i>
                </div>
                <div className="feature-content">
                  <h3>Gestion des Stocks</h3>
                  <p>Inventaire, mouvements et alertes de réapprovisionnement</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-people"></i>
                </div>
                <div className="feature-content">
                  <h3>Multi-utilisateurs</h3>
                  <p>Gestion des rôles et permissions par entreprise</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div className="feature-content">
                  <h3>Sécurité Renforcée</h3>
                  <p>Authentification JWT et protection des données</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="bi bi-graph-up"></i>
                </div>
                <div className="feature-content">
                  <h3>Tableaux de Bord</h3>
                  <p>Visualisation et analyse de vos données en temps réel</p>
                </div>
              </div>
            </div>

            {/* Footer de présentation */}
            <div className="presentation-footer">
              <p className="text-white-50">
                <i className="bi bi-award me-2"></i>
                Projet de Fin d'Études - GoMyCode
              </p>
            </div>
          </div>
        </div>

        {/* Panneau droit - Formulaire de connexion */}
        <div className="login-form-panel">
          <div className="form-container">
            {/* En-tête du formulaire */}
            <div className="form-header">
              <h2 className="form-title">Bienvenue</h2>
              <p className="form-subtitle">Connectez-vous pour accéder à votre tableau de bord</p>
            </div>

            {/* Formulaire */}
            <Formik
              initialValues={{
                email: '',
                password: '',
                rememberMe: false,
              }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isValid, dirty }) => (
                <Form className="login-form">
                  {/* Champ Email */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope me-2"></i>
                      Adresse email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className={`form-control form-control-lg ${
                        errors.email && touched.email ? 'is-invalid' : ''
                      } ${!errors.email && touched.email ? 'is-valid' : ''}`}
                      placeholder="exemple@entreprise.sn"
                      autoComplete="email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  {/* Champ Mot de passe */}
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-2"></i>
                      Mot de passe
                    </label>
                    <div className="input-group input-group-lg">
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="password"
                        className={`form-control ${
                          errors.password && touched.password ? 'is-invalid' : ''
                        } ${!errors.password && touched.password ? 'is-valid' : ''}`}
                        placeholder="Entrez votre mot de passe"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  {/* Options supplémentaires */}
                  <div className="form-options">
                    <div className="form-check">
                      <Field
                        type="checkbox"
                        name="rememberMe"
                        id="rememberMe"
                        className="form-check-input"
                      />
                      <label htmlFor="rememberMe" className="form-check-label">
                        Se souvenir de moi
                      </label>
                    </div>
                    <Link to="/forgot-password" className="forgot-password-link">
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  {/* Bouton de connexion */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 login-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Connexion en cours...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Se connecter
                      </>
                    )}
                  </button>

                  {/* Lien vers inscription */}
                  <div className="signup-link">
                    <span>Vous n'avez pas de compte ?</span>
                    <Link to="/register" className="register-link">
                      Créer un compte
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>

            {/* Démo et support */}
            <div className="form-footer">
              <div className="demo-info">
                <div className="demo-badge">
                  <i className="bi bi-info-circle me-2"></i>
                  <span>Compte démo disponible</span>
                </div>
                <small className="text-muted d-block mt-2">
                  Email: demo@syscohada.sn | Mot de passe: demo123456
                </small>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="copyright">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} ERP SYSCOHADA. Tous droits réservés.
            </p>
            <p className="text-muted small mb-0">
              Développé avec <i className="bi bi-heart-fill text-danger"></i> pour les PME africaines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
