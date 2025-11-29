/**
 * Page d'inscription
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { register, clearError } from '../../store/slices/authSlice';

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

      const result = await dispatch(register(userData)).unwrap();
      toast.success('Inscription réussie ! Bienvenue !');
      navigate('/dashboard');
    } catch (err) {
      // L'erreur est déjà gérée par le useEffect ci-dessus
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body p-4 p-md-5">
                {/* Logo et titre */}
                <div className="text-center mb-4">
                  <h1 className="h3 mb-2 fw-bold">ERP SYSCOHADA</h1>
                  <p className="text-muted">Créez votre compte</p>
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
                  {({ errors, touched }) => (
                    <Form>
                      {/* Prénom et Nom */}
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="firstName" className="form-label">
                            Prénom
                          </label>
                          <Field
                            type="text"
                            name="firstName"
                            id="firstName"
                            className={`form-control ${
                              errors.firstName && touched.firstName ? 'is-invalid' : ''
                            }`}
                            placeholder="Prénom"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="lastName" className="form-label">
                            Nom
                          </label>
                          <Field
                            type="text"
                            name="lastName"
                            id="lastName"
                            className={`form-control ${
                              errors.lastName && touched.lastName ? 'is-invalid' : ''
                            }`}
                            placeholder="Nom"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className={`form-control ${
                            errors.email && touched.email ? 'is-invalid' : ''
                          }`}
                          placeholder="exemple@email.com"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Téléphone */}
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                          Téléphone <span className="text-muted">(optionnel)</span>
                        </label>
                        <Field
                          type="tel"
                          name="phone"
                          id="phone"
                          className={`form-control ${
                            errors.phone && touched.phone ? 'is-invalid' : ''
                          }`}
                          placeholder="+221 XX XXX XX XX"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Mot de passe */}
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
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
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
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

                      {/* Confirmation mot de passe */}
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirmer le mot de passe
                        </label>
                        <div className="input-group">
                          <Field
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            id="confirmPassword"
                            className={`form-control ${
                              errors.confirmPassword && touched.confirmPassword
                                ? 'is-invalid'
                                : ''
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i
                              className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}
                            ></i>
                          </button>
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>

                      {/* Accepter les conditions */}
                      <div className="mb-4">
                        <div className="form-check">
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
                            <Link to="/terms" className="text-decoration-none">
                              conditions d'utilisation
                            </Link>{' '}
                            et la{' '}
                            <Link to="/privacy" className="text-decoration-none">
                              politique de confidentialité
                            </Link>
                          </label>
                          <ErrorMessage
                            name="acceptTerms"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      </div>

                      {/* Bouton d'inscription */}
                      <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Inscription...
                          </>
                        ) : (
                          'S\'inscrire'
                        )}
                      </button>

                      {/* Lien vers connexion */}
                      <div className="text-center">
                        <span className="text-muted">Vous avez déjà un compte ? </span>
                        <Link to="/login" className="text-decoration-none">
                          Se connecter
                        </Link>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-muted small">
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
