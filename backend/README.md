# ERP SYSCOHADA - Backend

Backend de l'application ERP SYSCOHADA pour la gestion commerciale et comptabilité des PME sénégalaises.

## 🚀 Stack Technique

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Base de données**: MongoDB avec Mongoose
- **Authentification**: JWT (Access + Refresh Tokens)
- **Validation**: Joi / Express-validator
- **PDF**: PDFKit
- **Excel**: ExcelJS
- **Email**: Nodemailer
- **Upload**: Multer + Cloudinary
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Installation

### Prérequis

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0

### Étapes d'installation

1. **Cloner le projet** (si ce n'est pas déjà fait)
```bash
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```
Éditer le fichier `.env` avec vos configurations :
- URI MongoDB
- Secrets JWT
- Configurations SMTP (email)
- Clés API Mobile Money
- Cloudinary

4. **Créer les dossiers nécessaires**
```bash
mkdir -p logs uploads/invoices uploads/products uploads/documents
```

## 🔧 Scripts disponibles

```bash
# Démarrer le serveur en développement (avec nodemon)
npm run dev

# Démarrer le serveur en production
npm start

# Lancer les tests
npm test

# Tests en mode watch
npm run test:watch

# Linter le code
npm run lint

# Formater le code
npm run format
```

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/           # Configuration (DB, JWT, etc.)
│   ├── models/           # Modèles Mongoose
│   ├── controllers/      # Contrôleurs (logique métier)
│   ├── routes/           # Routes Express
│   ├── middlewares/      # Middlewares (auth, validation, errors)
│   ├── services/         # Services métier
│   ├── utils/            # Utilitaires et helpers
│   └── validators/       # Schémas de validation
├── tests/                # Tests unitaires et d'intégration
├── logs/                 # Fichiers de logs
├── uploads/              # Fichiers uploadés
├── .env                  # Variables d'environnement
├── .env.example          # Exemple de configuration
├── server.js             # Point d'entrée
└── package.json          # Dépendances
```

## 🔐 Authentification

L'API utilise JWT avec deux types de tokens :

- **Access Token** : Valide 15 minutes, envoyé dans l'en-tête Authorization
- **Refresh Token** : Valide 7 jours, stocké en httpOnly cookie

### Endpoints d'authentification

```
POST /api/auth/register    - Inscription
POST /api/auth/login       - Connexion
POST /api/auth/refresh     - Rafraîchir le token
POST /api/auth/logout      - Déconnexion
POST /api/auth/forgot-password - Mot de passe oublié
POST /api/auth/reset-password  - Réinitialiser le mot de passe
```

## 📊 Modules principaux

### 1. Authentification & Utilisateurs
- Inscription/Connexion JWT
- Gestion des rôles (Admin, Comptable, Commercial, Utilisateur)
- Permissions RBAC

### 2. Produits
- CRUD produits
- Catégorisation
- Gestion des stocks

### 3. Clients & Fournisseurs
- CRUD tiers
- Informations fiscales (NINEA, RC)
- Historique des transactions

### 4. Facturation
- Devis, Factures, Avoirs
- Génération PDF conforme DGI
- Numérotation automatique
- Calcul TVA

### 5. Achats
- Commandes fournisseurs
- Réception marchandises
- Suivi des paiements

### 6. Stocks
- Mouvements de stock
- Inventaires
- Valorisation (FIFO, CUMP)

### 7. Comptabilité SYSCOHADA
- Plan comptable
- Écritures comptables
- Journaux
- États financiers

### 8. Trésorerie
- Paiements
- Rapprochement bancaire
- Mobile Money (Orange Money, Wave)

### 9. Reporting
- Balance générale
- Grand livre
- Bilan
- Compte de résultat
- Exports PDF/Excel

## 🌍 API Endpoints

| Module | Méthode | Endpoint | Description |
|--------|---------|----------|-------------|
| Auth | POST | `/api/auth/login` | Connexion |
| Auth | POST | `/api/auth/register` | Inscription |
| Products | GET | `/api/products` | Liste des produits |
| Products | POST | `/api/products` | Créer un produit |
| Invoices | GET | `/api/invoices` | Liste des factures |
| Invoices | POST | `/api/invoices` | Créer une facture |

*(Documentation complète disponible dans `/docs/API_DOCUMENTATION.md`)*

## 🔒 Sécurité

- **Helmet** : Protection des en-têtes HTTP
- **CORS** : Contrôle d'accès cross-origin
- **Rate Limiting** : Limitation du nombre de requêtes
- **Validation** : Validation stricte des entrées
- **Bcrypt** : Hash des mots de passe (10 salt rounds)
- **JWT** : Authentification stateless
- **Sanitization** : Protection contre les injections

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests avec couverture
npm test -- --coverage

# Tests en mode watch
npm run test:watch
```

## 📝 Logs

Les logs sont enregistrés dans le dossier `logs/` :

- `error.log` : Erreurs uniquement
- `combined.log` : Tous les logs

En développement, les logs sont aussi affichés dans la console.

## 🐛 Debugging

Pour activer le mode debug :

```bash
NODE_ENV=development LOG_LEVEL=debug npm run dev
```

## 🚀 Déploiement

Voir le fichier [DEPLOYMENT.md](../docs/DEPLOYMENT.md) pour les instructions de déploiement.

## 📚 Documentation

- [Installation](../docs/INSTALLATION.md)
- [API Documentation](../docs/API_DOCUMENTATION.md)
- [Guide SYSCOHADA](../docs/SYSCOHADA_GUIDE.md)
- [Architecture](../docs/ARCHITECTURE.md)

## 🤝 Contribution

Voir [CONTRIBUTING.md](../CONTRIBUTING.md)

## 📄 Licence

MIT

## 👨‍💻 Auteur

Votre Nom - Projet de fin d'étude GOMYCODE

## 🆘 Support

Pour toute question ou problème :
- Email : support@erp-syscohada.com
- GitHub Issues : [Lien vers le repo]
