/**
 * Page d'inscription - ERP SYSCOHADA
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { register, clearError } from '../../store/slices/authSlice';
import './Register.scss';

// Schéma de validation
const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .required('Le prénom est requis'),
  lastName: Yup.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .required('Le nom est requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('L\'email est requis'),
  phone: Yup.string()
    .matches(
      /^(\+221|00221)?[0-9]{9}$/,
      'Numéro de téléphone invalide (format sénégalais)'
    ),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    )
    .required('Le mot de passe est requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
    .required('Veuillez confirmer votre mot de passe'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'Vous devez accepter les conditions d\'utilisation'),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      // Supprimer confirmPassword avant d'envoyer au backend
      const { confirmPassword, acceptTerms, ...userData } = values;

      await dispatch(register(userData)).unwrap();
      toast.success('Inscription réussie ! Bienvenue !');
      navigate('/dashboard');
    } catch (err) {
      // L'erreur est déjà gérée par le useEffect ci-dessus
    }
  };

  // Calculer la force du mot de passe
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 1, label: 'Très faible', color: 'danger' },
      { strength: 2, label: 'Faible', color: 'warning' },
      { strength: 3, label: 'Moyen', color: 'info' },
      { strength: 4, label: 'Fort', color: 'success' },
      { strength: 5, label: 'Très fort', color: 'success' },
    ];

    return levels[strength - 1] || { strength: 0, label: '', color: '' };
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* En-tête avec navigation de retour */}
        <div className="register-header">
          <Link to="/login" className="back-link">
            <i className="bi bi-arrow-left me-2"></i>
            Retour à la connexion
          </Link>
        </div>

        <div className="register-content">
          {/* Panneau gauche - Informations */}
          <div className="register-info-panel">
            <div className="info-content">
              {/* Logo et titre */}
              <div className="info-header">
                <div className="logo-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="logo-svg">
                    <defs>
                      <linearGradient id="regLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#f4b944', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="48" fill="url(#regLogoGrad)" stroke="#ffffff" strokeWidth="2"/>
                    <text x="50" y="62" fontFamily="Inter, Arial, sans-serif" fontSize="36" fontWeight="700" fill="#0c4da2" textAnchor="middle">ERP</text>
                    <rect x="20" y="70" width="60" height="4" fill="#0c4da2" rx="2"/>
                  </svg>
                </div>
                <h1 className="info-title">Rejoignez ERP SYSCOHADA</h1>
                <p className="info-subtitle">Créez votre compte et commencez à gérer votre entreprise</p>
              </div>

              {/* Avantages */}
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>Gratuit pour démarrer</h4>
                    <p>Essayez toutes les fonctionnalités sans engagement</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>Configuration rapide</h4>
                    <p>Votre entreprise opérationnelle en quelques minutes</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>Support dédié</h4>
                    <p>Assistance technique en français, disponible 24/7</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="benefit-text">
                    <h4>Données sécurisées</h4>
                    <p>Chiffrement et sauvegardes automatiques inclus</p>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="stats-section">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Entreprises</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">2000+</div>
                  <div className="stat-label">Utilisateurs</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Panneau droit - Formulaire */}
          <div className="register-form-panel">
            <div className="form-wrapper">
              {/* En-tête du formulaire */}
              <div className="form-header">
                <h2 className="form-title">Créer votre compte</h2>
                <p className="form-subtitle">Remplissez vos informations pour commencer</p>
              </div>

              {/* Formulaire */}
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirmPassword: '',
                  acceptTerms: false,
                }}
                validationSchema={registerSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values }) => {
                  const passwordStrength = getPasswordStrength(values.password);

                  return (
                    <Form className="register-form">
                      {/* Prénom et Nom */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="firstName" className="form-label">
                              <i className="bi bi-person me-2"></i>
                              Prénom
                            </label>
                            <Field
                              type="text"
                              name="firstName"
                              id="firstName"
                              className={`form-control ${
                                errors.firstName && touched.firstName ? 'is-invalid' : ''
                              } ${!errors.firstName && touched.firstName ? 'is-valid' : ''}`}
                              placeholder="Votre prénom"
                              autoComplete="given-name"
                            />
                            <ErrorMessage
                              name="firstName"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="lastName" className="form-label">
                              <i className="bi bi-person me-2"></i>
                              Nom
                            </label>
                            <Field
                              type="text"
                              name="lastName"
                              id="lastName"
                              className={`form-control ${
                                errors.lastName && touched.lastName ? 'is-invalid' : ''
                              } ${!errors.lastName && touched.lastName ? 'is-valid' : ''}`}
                              placeholder="Votre nom"
                              autoComplete="family-name"
                            />
                            <ErrorMessage
                              name="lastName"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          <i className="bi bi-envelope me-2"></i>
                          Adresse email
                        </label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className={`form-control ${
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

                      {/* Téléphone */}
                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                          <i className="bi bi-phone me-2"></i>
                          Téléphone <span className="text-muted">(optionnel)</span>
                        </label>
                        <Field
                          type="tel"
                          name="phone"
                          id="phone"
                          className={`form-control ${
                            errors.phone && touched.phone ? 'is-invalid' : ''
                          } ${!errors.phone && touched.phone && values.phone ? 'is-valid' : ''}`}
                          placeholder="+221 XX XXX XX XX"
                          autoComplete="tel"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Mot de passe */}
                      <div className="form-group">
                        <label htmlFor="password" className="form-label">
                          <i className="bi bi-lock me-2"></i>
                          Mot de passe
                        </label>
                        <div className="input-group">
                          <Field
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            className={`form-control ${
                              errors.password && touched.password ? 'is-invalid' : ''
                            }`}
                            placeholder="Créez un mot de passe sécurisé"
                            autoComplete="new-password"
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
                        {/* Indicateur de force du mot de passe */}
                        {values.password && (
                          <div className="password-strength mt-2">
                            <div className="strength-bar">
                              <div
                                className={`strength-fill strength-${passwordStrength.color}`}
                                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                              ></div>
                            </div>
                            <small className={`text-${passwordStrength.color}`}>
                              Force: {passwordStrength.label}
                            </small>
                          </div>
                        )}
                      </div>

                      {/* Confirmation mot de passe */}
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                          <i className="bi bi-lock-fill me-2"></i>
                          Confirmer le mot de passe
                        </label>
                        <div className="input-group">
                          <Field
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            id="confirmPassword"
                            className={`form-control ${
                              errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''
                            } ${!errors.confirmPassword && touched.confirmPassword && values.confirmPassword ? 'is-valid' : ''}`}
                            placeholder="Confirmez votre mot de passe"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                          >
                            <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                          </button>
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>

                      {/* Accepter les conditions */}
                      <div className="form-group">
                        <div className="form-check custom-checkbox">
                          <Field
                            type="checkbox"
                            name="acceptTerms"
                            id="acceptTerms"
                            className={`form-check-input ${
                              errors.acceptTerms && touched.acceptTerms ? 'is-invalid' : ''
                            }`}
                          />
                          <label htmlFor="acceptTerms" className="form-check-label">
                            J'accepte les{' '}
                            <Link to="/terms" className="text-link" target="_blank">
                              conditions d'utilisation
                            </Link>{' '}
                            et la{' '}
                            <Link to="/privacy" className="text-link" target="_blank">
                              politique de confidentialité
                            </Link>
                          </label>
                          <ErrorMessage
                            name="acceptTerms"
                            component="div"
                            className="invalid-feedback d-block"
                          />
                        </div>
                      </div>

                      {/* Bouton d'inscription */}
                      <button
                        type="submit"
                        className="btn btn-primary w-100 register-button"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Création du compte...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-plus me-2"></i>
                            Créer mon compte
                          </>
                        )}
                      </button>

                      {/* Lien vers connexion */}
                      <div className="login-link">
                        <span>Vous avez déjà un compte ?</span>
                        <Link to="/login" className="signin-link">
                          Se connecter
                        </Link>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>

            {/* Copyright */}
            <div className="copyright">
              <p className="mb-0">
                &copy; {new Date().getFullYear()} ERP SYSCOHADA. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
