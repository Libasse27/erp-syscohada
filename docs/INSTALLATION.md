# Guide d'Installation - ERP SYSCOHADA

Ce guide vous accompagne dans l'installation complète de l'application ERP SYSCOHADA.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation locale](#installation-locale)
3. [Installation avec Docker](#installation-avec-docker)
4. [Configuration](#configuration)
5. [Vérification](#vérification)
6. [Dépannage](#dépannage)

## Prérequis

### Logiciels requis

- **Node.js** >= 18.0.0 ([Télécharger](https://nodejs.org/))
- **MongoDB** >= 6.0 ([Télécharger](https://www.mongodb.com/try/download/community))
- **npm** >= 9.0.0 (inclus avec Node.js)
- **Git** ([Télécharger](https://git-scm.com/))

### Optionnel (pour Docker)
- **Docker** ([Télécharger](https://www.docker.com/))
- **Docker Compose** (inclus avec Docker Desktop)

### Vérification des versions

```bash
node --version    # Doit afficher v18.x.x ou supérieur
npm --version     # Doit afficher 9.x.x ou supérieur
mongod --version  # Doit afficher 6.x.x ou supérieur
git --version
```

## Installation locale

### Étape 1 : Cloner le repository

```bash
# Cloner le projet
git clone <url-du-repository>
cd erp-syscohada
```

### Étape 2 : Installer MongoDB

#### Windows

1. Télécharger MongoDB Community Server
2. Installer avec les options par défaut
3. Démarrer MongoDB :
```bash
# Créer le dossier de données
mkdir C:\data\db

# Démarrer MongoDB
mongod
```

#### Linux (Ubuntu/Debian)

```bash
# Importer la clé publique
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Ajouter le repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Installer MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### macOS

```bash
# Avec Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Démarrer MongoDB
brew services start mongodb-community@7.0
```

### Étape 3 : Configurer le Backend

```bash
# Naviguer vers le dossier backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

Éditer le fichier `.env` :

```env
# Configuration de base
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/erp-syscohada

# JWT Secrets (CHANGER EN PRODUCTION !)
JWT_ACCESS_SECRET=votre_secret_access_token_tres_securise
JWT_REFRESH_SECRET=votre_secret_refresh_token_tres_securise

# Email (optionnel pour commencer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app

# CORS
FRONTEND_URL=http://localhost:3000
```

### Étape 4 : Configurer le Frontend

```bash
# Revenir à la racine et aller dans frontend
cd ../frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

Éditer le fichier `.env` :

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Étape 5 : Créer les dossiers nécessaires

```bash
# Dans le dossier backend
cd ../backend
mkdir -p logs uploads/invoices uploads/products uploads/documents
```

### Étape 6 : Démarrer l'application

Ouvrir **3 terminaux** :

**Terminal 1 - MongoDB** (si pas déjà démarré)
```bash
mongod
```

**Terminal 2 - Backend**
```bash
cd backend
npm run dev
```

Vous devriez voir :
```
🚀 Serveur démarré sur le port 5000
✅ MongoDB connecté: localhost
```

**Terminal 3 - Frontend**
```bash
cd frontend
npm start
```

Le navigateur s'ouvrira automatiquement sur http://localhost:3000

## Installation avec Docker

### Étape 1 : Cloner le repository

```bash
git clone <url-du-repository>
cd erp-syscohada
```

### Étape 2 : Configurer les variables d'environnement

```bash
# Créer le fichier .env pour Docker
cd docker
cp .env.example .env
```

Éditer `docker/.env` :

```env
# JWT Secrets
JWT_ACCESS_SECRET=votre_secret_access_production
JWT_REFRESH_SECRET=votre_secret_refresh_production

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=changeme123
```

### Étape 3 : Lancer avec Docker Compose

**Mode Développement :**

```bash
# Depuis la racine du projet
docker-compose -f docker/docker-compose.dev.yml up -d
```

**Mode Production :**

```bash
docker-compose -f docker/docker-compose.yml up -d
```

### Étape 4 : Vérifier les conteneurs

```bash
# Vérifier que tous les conteneurs sont démarrés
docker ps

# Voir les logs
docker-compose -f docker/docker-compose.yml logs -f

# Logs d'un service spécifique
docker-compose -f docker/docker-compose.yml logs -f backend
```

### Étape 5 : Accéder à l'application

- Frontend : http://localhost:3000
- Backend API : http://localhost:5000
- MongoDB : localhost:27017

### Arrêter les conteneurs

```bash
docker-compose -f docker/docker-compose.yml down

# Avec suppression des volumes (⚠️ supprime les données)
docker-compose -f docker/docker-compose.yml down -v
```

## Configuration

### Configuration Backend avancée

Éditer `backend/.env` pour configurer :

#### Email (Nodemailer avec Gmail)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=mot-de-passe-application-gmail
EMAIL_FROM=noreply@erp-syscohada.com
```

> **Note** : Pour Gmail, créer un "Mot de passe d'application" dans les paramètres de sécurité Google.

#### Cloudinary (Upload d'images)

```env
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

#### Mobile Money

```env
ORANGE_MONEY_API_KEY=votre_cle_api
ORANGE_MONEY_API_SECRET=votre_secret
ORANGE_MONEY_BASE_URL=https://api.orange.com/orange-money-webpay/dev/v1

WAVE_API_KEY=votre_cle_wave
WAVE_API_SECRET=votre_secret_wave
```

### Configuration Frontend avancée

Éditer `frontend/.env` :

```env
# URL de l'API
REACT_APP_API_URL=http://localhost:5000/api

# Environnement
REACT_APP_ENV=development

# Pagination
REACT_APP_ITEMS_PER_PAGE=10

# Upload
REACT_APP_MAX_FILE_SIZE=5242880

# Devise et TVA
REACT_APP_DEFAULT_CURRENCY=XOF
REACT_APP_DEFAULT_VAT_RATE=18
```

## Vérification

### 1. Vérifier la connexion MongoDB

```bash
# Se connecter à MongoDB
mongosh

# Lister les bases de données
show dbs

# Utiliser la base ERP
use erp-syscohada

# Lister les collections (après première utilisation)
show collections
```

### 2. Tester l'API Backend

```bash
# Health check
curl http://localhost:5000/health

# Devrait retourner :
# {"success":true,"message":"Serveur ERP SYSCOHADA opérationnel"}
```

### 3. Tester le Frontend

Ouvrir http://localhost:3000 dans le navigateur.

Vous devriez voir la page d'accueil.

## Dépannage

### Problème : Port déjà utilisé

**Erreur :** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution :**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Ou changer le port dans .env
PORT=5001
```

### Problème : MongoDB ne démarre pas

**Windows :**
```bash
# Vérifier que le dossier de données existe
mkdir C:\data\db

# Démarrer avec le bon chemin
mongod --dbpath C:\data\db
```

**Linux :**
```bash
# Vérifier le statut
sudo systemctl status mongod

# Voir les logs
sudo journalctl -u mongod

# Redémarrer
sudo systemctl restart mongod
```

### Problème : Erreur de connexion MongoDB

**Erreur :** `MongoNetworkError: connect ECONNREFUSED`

**Solution :**

1. Vérifier que MongoDB est démarré
2. Vérifier l'URI dans `.env` : `MONGODB_URI=mongodb://localhost:27017/erp-syscohada`
3. Tester la connexion : `mongosh`

### Problème : npm install échoue

**Erreur :** Erreurs de dépendances

**Solution :**

```bash
# Supprimer les dépendances et réinstaller
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Problème : CORS Error dans le navigateur

**Erreur :** `Access to XMLHttpRequest blocked by CORS policy`

**Solution :**

Vérifier dans `backend/.env` :
```env
FRONTEND_URL=http://localhost:3000
```

Vérifier dans `backend/server.js` que CORS est bien configuré.

### Problème : React ne démarre pas

**Erreur :** Erreurs de compilation

**Solution :**

```bash
cd frontend

# Supprimer node_modules
rm -rf node_modules

# Réinstaller
npm install

# Redémarrer
npm start
```

### Problème : Docker - Conteneurs ne démarrent pas

**Solution :**

```bash
# Voir les logs détaillés
docker-compose -f docker/docker-compose.yml logs

# Reconstruire les images
docker-compose -f docker/docker-compose.yml build --no-cache

# Redémarrer
docker-compose -f docker/docker-compose.yml up -d
```

## Prochaines étapes

Après l'installation :

1. ✅ Vérifier que tout fonctionne
2. 📖 Lire le [Guide utilisateur](USER_GUIDE.md)
3. 🔧 Consulter la [Documentation API](API_DOCUMENTATION.md)
4. 👨‍💻 Commencer le développement !

## Support

En cas de problème :

1. Consulter cette documentation
2. Vérifier les logs (backend/logs/)
3. Ouvrir une issue sur GitHub
4. Contacter le support : support@erp-syscohada.com

---

Bonne installation ! 🚀
