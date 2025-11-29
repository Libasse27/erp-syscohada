# ERP SYSCOHADA

Application de gestion commerciale et comptabilité pour PME sénégalaises - Conforme aux normes SYSCOHADA

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)

## 📋 Description

ERP SYSCOHADA est une solution complète de gestion commerciale et comptabilité spécialement conçue pour les PME sénégalaises. L'application est conforme aux normes comptables SYSCOHADA (Système Comptable Ouest Africain Harmonisé) et intègre les spécificités du marché local, notamment le support des paiements Mobile Money.

### Fonctionnalités principales

- **Gestion commerciale**
  - Facturation (devis, factures, avoirs)
  - Gestion des clients et fournisseurs
  - Gestion des produits et catalogue
  - Suivi des commandes et livraisons

- **Gestion des stocks**
  - Mouvements de stock en temps réel
  - Inventaires
  - Valorisation (FIFO, CUMP, LIFO)
  - Alertes stock minimum

- **Comptabilité SYSCOHADA**
  - Plan comptable conforme
  - Saisie d'écritures comptables
  - Journaux (achats, ventes, banque, caisse)
  - Lettrage et rapprochement bancaire
  - Gestion des immobilisations

- **Trésorerie**
  - Suivi des encaissements et décaissements
  - Rapprochement bancaire
  - Prévisions de trésorerie
  - Support Mobile Money (Orange Money, Wave)

- **Reporting**
  - Balance générale
  - Grand livre
  - Bilan SYSCOHADA
  - Compte de résultat
  - États fiscaux (TVA, DGI)
  - Exports PDF et Excel

- **Dashboard**
  - Vue d'ensemble de l'activité
  - KPI en temps réel
  - Graphiques et statistiques

## 🚀 Stack Technique

### Frontend
- **React 18** - Framework JavaScript
- **Bootstrap 5** - Framework CSS
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - Client HTTP
- **Formik + Yup** - Gestion des formulaires
- **Chart.js** - Graphiques
- **jsPDF** - Génération PDF

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification
- **Joi** - Validation des données
- **PDFKit** - Génération PDF serveur
- **ExcelJS** - Génération Excel

### DevOps
- **Docker** - Containerisation
- **Docker Compose** - Orchestration
- **Nginx** - Reverse proxy
- **PM2** - Process manager (production)

## 📦 Installation

### Prérequis

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0
- Git

### Installation locale (sans Docker)

1. **Cloner le repository**
```bash
git clone <url-du-repo>
cd erp-syscohada
```

2. **Installer les dépendances Backend**
```bash
cd backend
npm install
cp .env.example .env
# Éditer le fichier .env avec vos configurations
```

3. **Installer les dépendances Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
# Éditer le fichier .env
```

4. **Démarrer MongoDB**
```bash
# Sous Windows (avec MongoDB installé)
mongod

# Sous Linux/Mac
sudo systemctl start mongod
```

5. **Démarrer le Backend**
```bash
cd backend
npm run dev
```

6. **Démarrer le Frontend**
```bash
cd frontend
npm start
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000

### Installation avec Docker

1. **Cloner le repository**
```bash
git clone <url-du-repo>
cd erp-syscohada
```

2. **Créer le fichier .env pour Docker**
```bash
cp docker/.env.example docker/.env
# Éditer le fichier docker/.env
```

3. **Démarrer avec Docker Compose**

**Mode développement :**
```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

**Mode production :**
```bash
docker-compose -f docker/docker-compose.yml up -d
```

4. **Vérifier les conteneurs**
```bash
docker ps
```

5. **Voir les logs**
```bash
docker-compose -f docker/docker-compose.yml logs -f
```

## 📚 Documentation

- [Installation détaillée](docs/INSTALLATION.md)
- [Guide utilisateur](docs/USER_GUIDE.md)
- [Documentation API](docs/API_DOCUMENTATION.md)
- [Architecture système](docs/ARCHITECTURE.md)
- [Guide SYSCOHADA](docs/SYSCOHADA_GUIDE.md)
- [Guide de déploiement](docs/DEPLOYMENT.md)

## 🏗️ Structure du projet

```
erp-syscohada/
├── backend/                 # Backend Node.js/Express
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── models/         # Modèles Mongoose
│   │   ├── controllers/    # Contrôleurs
│   │   ├── routes/         # Routes API
│   │   ├── middlewares/    # Middlewares
│   │   ├── services/       # Services métier
│   │   ├── utils/          # Utilitaires
│   │   └── validators/     # Validation
│   ├── tests/              # Tests
│   └── server.js           # Point d'entrée
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── pages/          # Pages
│   │   ├── services/       # Services API
│   │   ├── store/          # Redux store
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilitaires
│   └── public/             # Assets statiques
├── docker/                 # Configuration Docker
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── docker-compose.yml
│   └── nginx/              # Config Nginx
├── docs/                   # Documentation
└── README.md
```

## 🔧 Scripts disponibles

### Backend
```bash
npm start          # Démarrer en production
npm run dev        # Démarrer en développement (nodemon)
npm test           # Lancer les tests
npm run lint       # Linter le code
```

### Frontend
```bash
npm start          # Démarrer le serveur de dev
npm run build      # Build de production
npm test           # Lancer les tests
npm run lint       # Linter le code
```

## 🧪 Tests

### Lancer les tests Backend
```bash
cd backend
npm test
```

### Lancer les tests Frontend
```bash
cd frontend
npm test
```

## 🚀 Déploiement

Voir le [Guide de déploiement](docs/DEPLOYMENT.md) pour les instructions détaillées.

### Déploiement rapide avec Docker

```bash
# Production
docker-compose -f docker/docker-compose.yml up -d

# Vérifier le statut
docker-compose -f docker/docker-compose.yml ps

# Arrêter
docker-compose -f docker/docker-compose.yml down
```

## 🔐 Sécurité

- Authentification JWT (Access + Refresh tokens)
- Hash des mots de passe avec bcrypt
- Protection CSRF
- Rate limiting
- Validation stricte des entrées
- Headers sécurisés (Helmet)
- Audit trail complet

## 🌍 Spécificités locales (Sénégal)

- **Conformité DGI** : Mentions légales obligatoires sur factures
- **SYSCOHADA** : Plan comptable et états financiers conformes
- **Mobile Money** : Intégration Orange Money, Wave, Free Money
- **TVA 18%** : Calcul automatique
- **Devise XOF** : Franc CFA avec formatage local
- **NINEA / RC** : Gestion des identifiants fiscaux

## 👥 Rôles et permissions

- **Admin** : Accès complet
- **Comptable** : Comptabilité, reporting
- **Commercial** : Ventes, clients, produits
- **Utilisateur** : Lecture seule

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md)

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Changelog

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des versions.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Votre Nom**
- Projet de fin d'étude GOMYCODE
- Email : votre-email@example.com
- GitHub : [@votre-username](https://github.com/votre-username)

## 🙏 Remerciements

- GOMYCODE pour la formation
- La communauté open source
- Les utilisateurs testeurs

## 📞 Support

Pour toute question ou problème :
- Email : support@erp-syscohada.com
- Documentation : [docs/](docs/)
- Issues : GitHub Issues

---

Fait avec ❤️ pour les PME sénégalaises
