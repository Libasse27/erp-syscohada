/**
 * Footer - Pied de page de l'application
 * Liens rapides, contact, réseaux sociaux et informations légales
 */

import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: 'Tableau de bord', path: '/dashboard', icon: '📊' },
    { title: 'Documentation', path: '/documentation', icon: '📚' },
    { title: 'Support', path: '/support', icon: '🛟' },
    { title: 'À propos', path: '/about', icon: 'ℹ️' },
  ];

  const legalLinks = [
    { title: 'Confidentialité', path: '/privacy' },
    { title: 'Conditions', path: '/terms' },
    { title: 'Cookies', path: '/cookies' },
  ];

  const contactInfo = [
    {
      icon: 'bi-envelope',
      label: 'Email',
      value: 'contact@erp-syscohada.com',
      href: 'mailto:contact@erp-syscohada.com',
    },
    {
      icon: 'bi-telephone',
      label: 'Téléphone',
      value: '+221 XX XXX XX XX',
      href: 'tel:+221XXXXXXXXX',
    },
    {
      icon: 'bi-geo-alt',
      label: 'Localisation',
      value: 'Dakar, Sénégal',
    },
  ];

  return (
    <footer className="footer">
      {/* Footer principal avec 4 colonnes */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Colonne 1 : À propos */}
            <div className="footer-column">
              <a href="/dashboard" className="footer-logo">
                <div className="footer-logo-icon">E</div>
                <span className="footer-logo-text">ERP SYSCOHADA</span>
              </a>
              <p className="footer-description">
                Solution de gestion intégrée conforme aux normes comptables SYSCOHADA pour
                l'Afrique de l'Ouest.
              </p>
              <div className="footer-social">
                <a
                  href="#"
                  className="footer-social-link facebook"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="#"
                  className="footer-social-link twitter"
                  aria-label="Twitter"
                  title="Twitter"
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a
                  href="#"
                  className="footer-social-link linkedin"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
                <a
                  href="#"
                  className="footer-social-link github"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <i className="bi bi-github"></i>
                </a>
              </div>
            </div>

            {/* Colonne 2 : Liens rapides */}
            <div className="footer-column">
              <h3 className="footer-column-title">
                <i className="bi bi-link-45deg"></i>
                Liens rapides
              </h3>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index} className="footer-link-item">
                    <Link to={link.path} className="footer-link">
                      <span className="footer-link-emoji">{link.icon}</span>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 : Contact */}
            <div className="footer-column">
              <h3 className="footer-column-title">
                <i className="bi bi-telephone"></i>
                Contact
              </h3>
              <ul className="footer-contact">
                {contactInfo.map((contact, index) => (
                  <li key={index} className="footer-contact-item">
                    <div className="footer-contact-icon">
                      <i className={contact.icon}></i>
                    </div>
                    <div className="footer-contact-text">
                      <span className="footer-contact-label">{contact.label}</span>
                      {contact.href ? (
                        <a href={contact.href} className="footer-contact-value">
                          {contact.value}
                        </a>
                      ) : (
                        <span className="footer-contact-value">{contact.value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 4 : Newsletter */}
            <div className="footer-column">
              <h3 className="footer-column-title">
                <i className="bi bi-envelope-heart"></i>
                Newsletter
              </h3>
              <div className="footer-newsletter">
                <p className="footer-newsletter-text">
                  Restez informé des dernières nouveautés et mises à jour.
                </p>
                <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="footer-newsletter-input"
                    required
                  />
                  <button type="submit" className="footer-newsletter-btn">
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom (Copyright) */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © {currentYear} <a href="/">ERP SYSCOHADA</a>. Tous droits réservés.
          </p>
          <span className="footer-badge">
            <i className="bi bi-heart-fill"></i>
            Made with love in Africa
          </span>
          <ul className="footer-legal">
            {legalLinks.map((link, index) => (
              <li key={index} className="footer-legal-item">
                <Link to={link.path} className="footer-legal-link">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Barre d'informations supplémentaires */}
      <div className="footer-info-bar">
        <div className="footer-info-content">
          <div className="footer-info-item">
            <i className="bi bi-check-circle-fill"></i>
            <span>Conforme SYSCOHADA</span>
          </div>
          <div className="footer-info-item">
            <i className="bi bi-shield-check"></i>
            <span>Données sécurisées</span>
          </div>
          <div className="footer-info-item">
            <i className="bi bi-headset"></i>
            <span>Support 24/7</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
