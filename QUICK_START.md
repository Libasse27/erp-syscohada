# 🚀 Quick Start - ERP SYSCOHADA

Guide de démarrage rapide pour lancer l'application en 5 minutes.

## ⚡ Démarrage rapide (sans Docker)

### 1. Prérequis installés
Vérifier que vous avez :
- ✅ Node.js >= 18.0.0
- ✅ MongoDB >= 6.0
- ✅ npm >= 9.0.0

### 2. Installation en 4 étapes

**Étape 1 : Backend**
```bash
cd backend
npm install
cp .env.example .env
```

**Étape 2 : Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
```

**Étape 3 : Démarrer MongoDB**
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

**Étape 4 : Lancer l'application**

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm start
```

### 3. Accéder à l'application

- 🌐 Frontend : http://localhost:3000
- 🔌 Backend API : http://localhost:5000
- 📊 MongoDB : localhost:27017

---

## 🐳 Démarrage avec Docker (encore plus rapide !)

### 1. Prérequis
- ✅ Docker Desktop installé

### 2. Une seule commande

**Mode développement :**
```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

**Mode production :**
```bash
docker-compose -f docker/docker-compose.yml up -d
```

### 3. Vérifier

```bash
# Voir les conteneurs
docker ps

# Voir les logs
docker-compose -f docker/docker-compose.yml logs -f
```

### 4. Arrêter

```bash
docker-compose -f docker/docker-compose.yml down
```

---

## 📝 Configuration minimale

### Backend (.env)

Éditer `backend/.env` :

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/erp-syscohada
JWT_ACCESS_SECRET=change_me_in_production
JWT_REFRESH_SECRET=change_me_in_production
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

Éditer `frontend/.env` :

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## ✅ Vérification

### 1. Tester l'API Backend

```bash
curl http://localhost:5000/health
```

Devrait retourner :
```json
{
  "success": true,
  "message": "Serveur ERP SYSCOHADA opérationnel"
}
```

### 2. Tester le Frontend

Ouvrir http://localhost:3000 dans le navigateur.

Vous devriez voir la page d'accueil.

### 3. Tester MongoDB

```bash
mongosh
```

Puis :
```javascript
show dbs
use erp-syscohada
```

---

## 🎯 Prochaines étapes

Maintenant que l'application fonctionne :

### 1. Développer les modules

**Ordre recommandé :**
1. ✅ Module Authentification (Users, Login, JWT)
2. ✅ Module Produits (CRUD produits)
3. ✅ Module Clients/Fournisseurs
4. ✅ Module Facturation
5. ✅ Module Stocks
6. ✅ Module Comptabilité SYSCOHADA
7. ✅ Module Trésorerie
8. ✅ Module Reporting

### 2. Commencer par l'authentification

Créer le modèle User :
```bash
# Créer le fichier
touch backend/src/models/User.js
```

Puis développer :
- Modèle User avec Mongoose
- Controller d'authentification
- Routes d'authentification
- Middleware de vérification JWT
- Tests

### 3. Continuer avec le frontend

Créer les pages :
- Page de login
- Page de dashboard
- Composants réutilisables

### 4. Lire la documentation

- 📖 [README principal](README.md)
- 📚 [Guide d'installation détaillé](docs/INSTALLATION.md)
- 🤝 [Guide de contribution](CONTRIBUTING.md)

---

## 🛠️ Commandes utiles

### Backend

```bash
npm run dev      # Démarrage avec nodemon (auto-reload)
npm start        # Démarrage production
npm test         # Lancer les tests
npm run lint     # Vérifier le code
```

### Frontend

```bash
npm start        # Démarrage développement
npm run build    # Build de production
npm test         # Lancer les tests
npm run lint     # Vérifier le code
```

### Docker

```bash
# Démarrer
docker-compose -f docker/docker-compose.yml up -d

# Arrêter
docker-compose -f docker/docker-compose.yml down

# Voir les logs
docker-compose -f docker/docker-compose.yml logs -f

# Rebuild
docker-compose -f docker/docker-compose.yml build --no-cache
```

---

## 🐛 Problèmes courants

### Port déjà utilisé

**Erreur :** `EADDRINUSE: address already in use :::5000`

**Solution :**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### MongoDB ne démarre pas

**Solution :**
```bash
# Vérifier le statut
sudo systemctl status mongod

# Redémarrer
sudo systemctl restart mongod

# Voir les logs
sudo journalctl -u mongod
```

### npm install échoue

**Solution :**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📞 Besoin d'aide ?

- 📖 Lire la [documentation complète](docs/INSTALLATION.md)
- 🐛 Ouvrir une [issue sur GitHub](../../issues)
- 💬 Contacter : support@erp-syscohada.com

---

## 🎉 Félicitations !

Vous êtes prêt à développer votre application ERP SYSCOHADA ! 🚀

**Bon développement !** 💻

---

*Projet de fin d'étude GOMYCODE - ERP SYSCOHADA pour PME sénégalaises*
