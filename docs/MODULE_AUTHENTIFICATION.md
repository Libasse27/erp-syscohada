# Module d'Authentification - ERP SYSCOHADA

## Vue d'ensemble

Le module d'authentification est complètement implémenté et fonctionnel. Il gère l'inscription, la connexion, la déconnexion et la gestion des sessions utilisateur avec JWT.

## Architecture

### Backend (Node.js + Express + MongoDB)

#### 1. Modèle User ([backend/src/models/User.js](../backend/src/models/User.js))

**Champs principaux:**
- `firstName`, `lastName` - Informations personnelles
- `email` - Identifiant unique (validé par regex)
- `password` - Hash avec bcrypt (10 rounds de salt)
- `role` - Rôles: admin, accountant, sales, user
- `permissions` - Array de permissions spécifiques
- `company` - Référence à l'entreprise
- `phone` - Numéro de téléphone (format sénégalais)
- `isActive` - Statut du compte
- `refreshToken` - Token de rafraîchissement

**Méthodes:**
- `comparePassword(candidatePassword)` - Vérification du mot de passe
- `toPublicJSON()` - Retourne les données sans informations sensibles

**Index:**
- email (unique)
- role
- company
- isActive

#### 2. Validators ([backend/src/validators/authValidator.js](../backend/src/validators/authValidator.js))

Validation avec Joi pour:
- Inscription (registerSchema)
- Connexion (loginSchema)
- Changement de mot de passe (changePasswordSchema)
- Mise à jour du profil (updateProfileSchema)
- Réinitialisation du mot de passe (forgotPasswordSchema, resetPasswordSchema)

#### 3. Controller ([backend/src/controllers/authController.js](../backend/src/controllers/authController.js))

**Endpoints implémentés:**
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Rafraîchissement du token
- `GET /api/auth/me` - Profil utilisateur (protégé)
- `PUT /api/auth/profile` - Mise à jour du profil (protégé)
- `PUT /api/auth/change-password` - Changement de mot de passe (protégé)
- `POST /api/auth/forgot-password` - Demande de réinitialisation
- `POST /api/auth/reset-password` - Réinitialisation du mot de passe

**Tokens:**
- Access Token: 15 minutes (JWT)
- Refresh Token: 7 jours (Cookie HttpOnly)

#### 4. Middleware ([backend/src/middlewares/authMiddleware.js](../backend/src/middlewares/authMiddleware.js))

**Fonctions:**
- `protect` - Vérifie le token JWT et attache l'utilisateur à la requête
- `restrictTo(...roles)` - Restriction par rôle
- `checkPermission(permission)` - Vérification de permission spécifique
- `isAdmin` - Accès admin uniquement
- `isOwner(resourceUserId)` - Vérification de propriété de ressource

#### 5. Routes ([backend/src/routes/authRoutes.js](../backend/src/routes/authRoutes.js))

Routes publiques et protégées configurées avec le middleware `protect`.

### Frontend (React + Redux Toolkit + Vite)

#### 1. Redux Slice ([frontend/src/store/slices/authSlice.js](../frontend/src/store/slices/authSlice.js))

**État:**
- `user` - Informations utilisateur
- `isAuthenticated` - Statut d'authentification
- `isLoading` - État de chargement
- `error` - Messages d'erreur

**Actions asynchrones:**
- `register` - Inscription
- `login` - Connexion
- `logout` - Déconnexion
- `getMe` - Récupération du profil
- `updateProfile` - Mise à jour du profil
- `changePassword` - Changement de mot de passe
- `forgotPassword` - Mot de passe oublié
- `resetPassword` - Réinitialisation

**Actions synchrones:**
- `clearError` - Effacer les erreurs
- `resetAuth` - Réinitialiser l'état

#### 2. Service API ([frontend/src/services/authService.js](../frontend/src/services/authService.js))

Service pour tous les appels API d'authentification. Gère:
- Stockage du token dans localStorage
- Appels API vers le backend
- Vérification de l'authentification

#### 3. Configuration Axios ([frontend/src/services/api.js](../frontend/src/services/api.js))

**Intercepteurs:**
- Requête: Ajoute le token Bearer à chaque requête
- Réponse: Gère le rafraîchissement automatique du token en cas de 401
- Gestion des erreurs avec toasts

#### 4. Pages

**Login ([frontend/src/pages/Auth/Login.jsx](../frontend/src/pages/Auth/Login.jsx))**
- Formulaire avec Formik + Yup
- Validation côté client
- Affichage/masquage du mot de passe
- Redirection après connexion

**Register ([frontend/src/pages/Auth/Register.jsx](../frontend/src/pages/Auth/Register.jsx))**
- Formulaire complet d'inscription
- Validation des mots de passe
- Validation du téléphone (format sénégalais)
- Acceptation des conditions

**Dashboard ([frontend/src/pages/Dashboard/Dashboard.jsx](../frontend/src/pages/Dashboard/Dashboard.jsx))**
- Page protégée par authentification
- Affichage des informations utilisateur
- Statistiques (en préparation)
- Sidebar de navigation

#### 5. Composants et Hooks

**useAuth ([frontend/src/hooks/useAuth.js](../frontend/src/hooks/useAuth.js))**
- Hook personnalisé pour l'authentification
- Vérification automatique au chargement
- Helpers: `isAdmin`, `isAccountant`, `hasPermission()`

**PrivateRoute ([frontend/src/components/PrivateRoute.jsx](../frontend/src/components/PrivateRoute.jsx))**
- Protection des routes
- Vérification du rôle
- Vérification des permissions
- Redirection vers login si non authentifié

## Flux d'authentification

### Inscription
1. Utilisateur remplit le formulaire
2. Validation côté client (Formik + Yup)
3. Envoi au backend
4. Validation côté serveur (Joi)
5. Hash du mot de passe (bcrypt)
6. Création de l'utilisateur
7. Génération des tokens
8. Retour du token + données utilisateur
9. Stockage du token et redirection

### Connexion
1. Utilisateur entre email/password
2. Validation côté client
3. Vérification dans la base de données
4. Comparaison du mot de passe
5. Génération des tokens
6. Stockage et redirection vers dashboard

### Rafraîchissement de token
1. Token expiré détecté (401)
2. Intercepteur Axios déclenché
3. Appel automatique à `/auth/refresh`
4. Nouveau token stocké
5. Requête originale rejouée

### Déconnexion
1. Appel à `/auth/logout`
2. Suppression du refresh token côté serveur
3. Suppression du token localStorage
4. Réinitialisation de l'état Redux
5. Redirection vers login

## Sécurité

✅ **Implémenté:**
- Hashing des mots de passe avec bcrypt (10 rounds)
- Tokens JWT signés
- Refresh tokens en HttpOnly cookies
- Validation stricte des entrées (Joi + Yup)
- Protection CSRF
- CORS configuré
- Headers de sécurité (Helmet)
- Logs d'activité

⚠️ **À implémenter:**
- Rate limiting sur les endpoints de connexion
- Email de vérification
- 2FA (authentification à deux facteurs)
- Historique de connexion
- Détection de connexions suspectes

## Variables d'environnement

### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

## Démarrage

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend disponible sur: http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm start
```
Frontend disponible sur: http://localhost:3000

## Tests manuels

### Test d'inscription
1. Accéder à http://localhost:3000/register
2. Remplir le formulaire
3. Vérifier la redirection vers dashboard
4. Vérifier les données dans MongoDB

### Test de connexion
1. Accéder à http://localhost:3000/login
2. Se connecter avec les identifiants créés
3. Vérifier l'accès au dashboard

### Test de protection de route
1. Se déconnecter
2. Tenter d'accéder à http://localhost:3000/dashboard
3. Vérifier la redirection vers login

### Test de rafraîchissement
1. Se connecter
2. Attendre 15 minutes (expiration du access token)
3. Effectuer une action nécessitant une requête API
4. Vérifier le rafraîchissement automatique

## Endpoints API

| Méthode | Endpoint | Protection | Description |
|---------|----------|------------|-------------|
| POST | `/api/auth/register` | Non | Inscription |
| POST | `/api/auth/login` | Non | Connexion |
| POST | `/api/auth/refresh` | Non | Rafraîchir token |
| POST | `/api/auth/forgot-password` | Non | Demander reset |
| POST | `/api/auth/reset-password` | Non | Réinitialiser |
| POST | `/api/auth/logout` | Oui | Déconnexion |
| GET | `/api/auth/me` | Oui | Profil |
| PUT | `/api/auth/profile` | Oui | Mettre à jour profil |
| PUT | `/api/auth/change-password` | Oui | Changer mot de passe |

## État du module

✅ **Terminé** - Le module d'authentification est complètement fonctionnel et prêt pour la production (avec les améliorations de sécurité recommandées).

## Prochaines étapes

1. Implémenter le système d'envoi d'emails (vérification, reset password)
2. Ajouter rate limiting
3. Développer les autres modules (Produits, Clients, Factures, etc.)
4. Tests unitaires et d'intégration
