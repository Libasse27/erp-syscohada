# ERP SYSCOHADA - Frontend

Interface utilisateur de l'application ERP SYSCOHADA pour la gestion commerciale et comptabilité des PME sénégalaises.

## 🚀 Stack Technique

- **Framework**: React 18
- **UI Framework**: Bootstrap 5
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Validation**: Formik + Yup
- **Charts**: Chart.js + Recharts
- **Notifications**: React Hot Toast
- **PDF Generation**: jsPDF
- **Excel Export**: xlsx

## 📦 Installation

### Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- Backend API en cours d'exécution

### Étapes d'installation

1. **Naviguer vers le dossier frontend**
```bash
cd frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```
Éditer le fichier `.env` :
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔧 Scripts disponibles

```bash
# Démarrer l'application en développement
npm start

# Créer un build de production
npm run build

# Lancer les tests
npm test

# Linter le code
npm run lint

# Formater le code
npm run format
```

## 📁 Structure du projet

```
frontend/
├── public/               # Fichiers statiques
├── src/
│   ├── components/      # Composants React
│   │   ├── common/      # Composants réutilisables
│   │   ├── layout/      # Layout (Header, Sidebar, Footer)
│   │   ├── forms/       # Formulaires
│   │   ├── modals/      # Modales
│   │   ├── tables/      # Tableaux de données
│   │   └── charts/      # Graphiques
│   ├── pages/           # Pages de l'application
│   │   ├── Dashboard/   # Tableau de bord
│   │   ├── Auth/        # Authentification
│   │   ├── Sales/       # Ventes
│   │   ├── Purchases/   # Achats
│   │   ├── Inventory/   # Stocks
│   │   ├── Accounting/  # Comptabilité
│   │   ├── Treasury/    # Trésorerie
│   │   ├── Reports/     # Rapports
│   │   └── Settings/    # Paramètres
│   ├── services/        # Services API (Axios)
│   ├── store/           # Redux store et slices
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilitaires
│   ├── assets/          # Images, icônes, fonts
│   ├── styles/          # Styles CSS
│   ├── App.jsx          # Composant principal
│   └── index.js         # Point d'entrée
├── .env                 # Variables d'environnement
├── package.json         # Dépendances
└── README.md
```

## 🎨 Composants principaux

### Layout
- **MainLayout** : Structure principale (Header, Sidebar, Footer)
- **Header** : En-tête avec navigation et profil utilisateur
- **Sidebar** : Menu de navigation latéral
- **Footer** : Pied de page

### Composants communs
- **Button** : Boutons personnalisés
- **Input** : Champs de saisie
- **Select** : Listes déroulantes
- **Card** : Cartes d'affichage
- **Modal** : Fenêtres modales
- **Alert** : Alertes et notifications
- **Loader** : Indicateurs de chargement
- **Pagination** : Pagination des listes

### Pages
- **Dashboard** : Vue d'ensemble avec KPI
- **Login/Register** : Authentification
- **Products** : Gestion des produits
- **Customers** : Gestion des clients
- **Invoices** : Facturation
- **Accounting** : Comptabilité SYSCOHADA
- **Reports** : États financiers et rapports

## 🔐 Authentification

L'application utilise JWT avec :
- **Access Token** : Stocké dans localStorage
- **Refresh Token** : Stocké en httpOnly cookie

### Protected Routes
Les routes protégées nécessitent une authentification :
```jsx
<PrivateRoute path="/dashboard" element={<Dashboard />} />
```

## 📊 State Management (Redux)

### Slices disponibles
- **authSlice** : Authentification et utilisateur
- **productSlice** : Gestion des produits
- **invoiceSlice** : Gestion des factures
- **customerSlice** : Gestion des clients
- **uiSlice** : État de l'interface (modales, loading, etc.)

### Exemple d'utilisation
```jsx
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './store/slices/productSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ...
};
```

## 🌐 Services API

### Configuration
Le fichier `services/api.js` configure Axios avec :
- Intercepteurs pour les tokens
- Gestion automatique du refresh token
- Gestion centralisée des erreurs
- Notifications automatiques

### Exemple d'utilisation
```jsx
import api from '../services/api';

// GET
const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

// POST
const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};
```

## 🎨 Styles et Thème

### Bootstrap 5
L'application utilise Bootstrap 5 avec personnalisation :
- Variables CSS custom
- Thème cohérent
- Composants responsive

### Styles personnalisés
Fichier `styles/index.css` contient :
- Variables CSS (couleurs, espacements, etc.)
- Styles globaux
- Utilitaires personnalisés
- Animations

## 📱 Responsive Design

L'application est entièrement responsive :
- Mobile first approach
- Breakpoints Bootstrap
- Adaptation des tableaux et graphiques

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests avec couverture
npm test -- --coverage

# Tests en mode watch
npm test -- --watch
```

## 🚀 Build et Déploiement

### Build de production
```bash
npm run build
```

Le build sera créé dans le dossier `build/`.

### Servir le build localement
```bash
npx serve -s build
```

## 🐛 Debugging

### React DevTools
Installer l'extension React DevTools pour Chrome/Firefox

### Redux DevTools
Activer Redux DevTools pour inspecter le state

### Mode développement
```bash
npm start
```
L'application se recharge automatiquement à chaque modification.

## 📚 Documentation

- [Installation complète](../docs/INSTALLATION.md)
- [Guide utilisateur](../docs/USER_GUIDE.md)
- [Architecture](../docs/ARCHITECTURE.md)

## 🎯 Fonctionnalités principales

### Dashboard
- Statistiques en temps réel
- Graphiques de CA
- Alertes et notifications

### Facturation
- Création de devis/factures
- Génération PDF conforme DGI
- Suivi des paiements

### Comptabilité
- Saisie d'écritures
- Plan comptable SYSCOHADA
- États financiers

### Reporting
- Balance générale
- Bilan
- Compte de résultat
- Exports PDF/Excel

## 🤝 Contribution

Voir [CONTRIBUTING.md](../CONTRIBUTING.md)

## 📄 Licence

MIT

## 👨‍💻 Auteur

Votre Nom - Projet de fin d'étude GOMYCODE
