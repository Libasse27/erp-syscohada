/**
 * Page de connexion
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { login, clearError } from '../../store/slices/authSlice';

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
      const result = await dispatch(login(values)).unwrap();
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (err) {
      // L'erreur est déjà gérée par le useEffect ci-dessus
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-4 p-md-5">
                {/* Logo et titre */}
                <div className="text-center mb-4">
                  <h1 className="h3 mb-2 fw-bold">ERP SYSCOHADA</h1>
                  <p className="text-muted">Connectez-vous à votre compte</p>
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
                  {({ errors, touched }) => (
                    <Form>
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

                      {/* Se souvenir de moi et mot de passe oublié */}
                      <div className="d-flex justify-content-between align-items-center mb-4">
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
                        <Link to="/forgot-password" className="text-decoration-none small">
                          Mot de passe oublié ?
                        </Link>
                      </div>

                      {/* Bouton de connexion */}
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
                            Connexion...
                          </>
                        ) : (
                          'Se connecter'
                        )}
                      </button>

                      {/* Lien vers inscription */}
                      <div className="text-center">
                        <span className="text-muted">Vous n'avez pas de compte ? </span>
                        <Link to="/register" className="text-decoration-none">
                          S'inscrire
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

export default Login;
