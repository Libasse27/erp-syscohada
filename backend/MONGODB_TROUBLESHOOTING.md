# Résolution des Problèmes MongoDB Atlas

## Erreur SSL/TLS Rencontrée

```
MongoServerSelectionError: 603C0000:error:0A000438:SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

## Solutions

### Solution 1: Mise à jour de la chaîne de connexion (RECOMMANDÉ)

La chaîne de connexion a été mise à jour avec les paramètres SSL/TLS appropriés :

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.z8yatzi.mongodb.net/erp-syscohada?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=false
```

### Solution 2: Vérifier les paramètres MongoDB Atlas

1. **Accès réseau** :
   - Connectez-vous à MongoDB Atlas
   - Allez dans "Network Access"
   - Ajoutez votre adresse IP actuelle ou `0.0.0.0/0` (pour tous les IPs - dev uniquement)

2. **Utilisateur de base de données** :
   - Vérifiez que l'utilisateur `libassedia_db_user` existe
   - Vérifiez que le mot de passe est correct
   - L'utilisateur doit avoir les permissions "readWrite" sur la base `erp-syscohada`

3. **Version du driver MongoDB** :
   - Assurez-vous d'utiliser `mongodb` >= 4.0 et `mongoose` >= 6.0
   - Vérifiez dans `package.json`

### Solution 3: Utiliser MongoDB local (Alternative de développement)

Si MongoDB Atlas continue de poser problème, utilisez MongoDB local :

#### Installation MongoDB Community Edition (Windows)

1. Téléchargez MongoDB Community Server : https://www.mongodb.com/try/download/community
2. Installez avec les paramètres par défaut
3. MongoDB démarrera automatiquement comme service Windows

#### Configuration pour MongoDB local

```env
# Dans backend/.env
MONGODB_URI=mongodb://localhost:27017/erp-syscohada
```

#### Vérifier que MongoDB fonctionne

```bash
# Vérifier le service
mongosh

# Ou avec PowerShell
Get-Service MongoDB

# Démarrer MongoDB si arrêté
Start-Service MongoDB
```

### Solution 4: Mettre à jour les dépendances

```bash
cd backend
npm update mongodb mongoose
```

### Solution 5: Désactiver temporairement la validation SSL (DEV uniquement)

**⚠️ UNIQUEMENT POUR LE DÉVELOPPEMENT - NE JAMAIS UTILISER EN PRODUCTION**

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.z8yatzi.mongodb.net/erp-syscohada?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true
```

## Vérification de la connexion

Pour tester la connexion MongoDB :

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
✅ MongoDB connecté: cluster0-shard-00-00.z8yatzi.mongodb.net
📦 Base de données: erp-syscohada
```

## Erreurs Courantes et Solutions

### 1. "Authentication failed"
- Vérifiez le nom d'utilisateur et le mot de passe
- Vérifiez que l'utilisateur a les bonnes permissions
- Le mot de passe ne doit pas contenir de caractères spéciaux non encodés

### 2. "IP not whitelisted"
- Ajoutez votre IP dans MongoDB Atlas Network Access
- Ou ajoutez `0.0.0.0/0` pour autoriser toutes les IPs (dev uniquement)

### 3. "Connection timeout"
- Vérifiez votre connexion internet
- Augmentez `serverSelectionTimeoutMS` dans `database.js`
- Vérifiez le pare-feu Windows/Antivirus

### 4. "Database name is missing"
- Vérifiez que la chaîne de connexion contient `/erp-syscohada`

## Options de Configuration MongoDB

Les options dans `backend/src/config/database.js` :

```javascript
const options = {
  maxPoolSize: 10,                    // Nombre max de connexions
  serverSelectionTimeoutMS: 10000,    // Timeout de sélection du serveur (10s)
  socketTimeoutMS: 45000,             // Timeout de socket (45s)
  family: 4,                          // Forcer IPv4
  retryWrites: true,                  // Réessayer les écritures
  retryReads: true,                   // Réessayer les lectures
  tls: true,                          // Activer TLS/SSL
  tlsAllowInvalidCertificates: false, // Valider les certificats
  tlsAllowInvalidHostnames: false,    // Valider les noms d'hôtes
};
```

## Support

Si le problème persiste :
1. Vérifiez les logs dans `backend/logs/`
2. Testez la connexion avec MongoDB Compass
3. Contactez le support MongoDB Atlas
4. Utilisez MongoDB local pour le développement

## Versions Recommandées

- Node.js: >= 18.0.0
- MongoDB: >= 6.0
- Mongoose: >= 7.0
- mongodb driver: >= 5.0

Vérifiez vos versions :
```bash
node --version
npm list mongodb mongoose
```
