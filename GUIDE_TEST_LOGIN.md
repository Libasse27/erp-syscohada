# Guide de Test - Flux Login → Dashboard

## 🎯 Objectif

Vérifier que le flux d'authentification complet fonctionne correctement après les corrections apportées.

---

## ⚙️ Prérequis

### 1. Backend démarré
```bash
cd backend
npm run dev
```

Vérifier que le backend démarre sans erreur et affiche:
```
✓ Connected to MongoDB
✓ Server is running on port 5000
```

### 2. Frontend démarré
```bash
cd frontend
npm run dev
```

Vérifier que le frontend démarre et affiche:
```
✓ VITE ready in XXX ms
✓ http://localhost:3000/
```

---

## 🧪 Tests à Effectuer

### Test 1: Nettoyage du cache navigateur

**TRÈS IMPORTANT**: Avant de commencer les tests, videz complètement le cache:

1. **Chrome/Edge**:
   - Ouvrir DevTools (F12)
   - Onglet "Application" ou "Stockage"
   - Clic droit sur "Local Storage" → "Clear"
   - Clic droit sur "Cookies" → "Clear"
   - Ctrl+Shift+Delete → Sélectionner "Cache" et "Cookies" → Effacer

2. **Firefox**:
   - F12 → Onglet "Storage"
   - Clic droit sur "Local Storage" → Supprimer tout
   - Clic droit sur "Cookies" → Supprimer tout
   - Ctrl+Shift+Delete → Effacer le cache

3. **OU utiliser le mode navigation privée / incognito**

---

### Test 2: Inscription d'un nouveau compte

**Étapes**:
1. Accéder à `http://localhost:3000/register`
2. Remplir le formulaire:
   - Prénom: Test
   - Nom: User
   - Email: test@example.com
   - Mot de passe: test123456
   - Téléphone: 0612345678
3. Cliquer sur "S'inscrire"

**Résultats attendus**:
- ✅ Toast de succès "Inscription réussie"
- ✅ Redirection automatique vers `/dashboard`
- ✅ Pas d'erreur 401 dans la console
- ✅ Dans DevTools → Application → Local Storage:
  - Clé `accessToken` présente avec une valeur (JWT)
- ✅ Dans DevTools → Network → Onglet Headers d'une requête API:
  - Header `Authorization: Bearer eyJ...` présent

**Si le test échoue**:
- Vérifier les logs backend (erreurs MongoDB?)
- Vérifier la console frontend (erreurs JavaScript?)
- Vérifier que `accessToken` est bien dans localStorage

---

### Test 3: Connexion avec un compte existant

**Étapes**:
1. Se déconnecter (si connecté)
2. Accéder à `http://localhost:3000/login`
3. Entrer les identifiants:
   - Email: test@example.com
   - Mot de passe: test123456
4. Cliquer sur "Se connecter"

**Résultats attendus**:
- ✅ Toast de succès "Connexion réussie !"
- ✅ Redirection automatique vers `/dashboard`
- ✅ Token sauvegardé dans localStorage
- ✅ Aucune erreur 401 dans les logs backend

**Logs backend attendus**:
```
info: Utilisateur connecté: test@example.com
```

**Logs backend à NE PAS voir**:
```
❌ warn: Token invalide reçu: undefined...
❌ error: Error: Token invalide
```

---

### Test 4: Chargement du Dashboard

**Étapes**:
1. Après connexion réussie, observer le dashboard
2. Ouvrir DevTools → Network
3. Regarder les requêtes API

**Résultats attendus**:
- ✅ Le dashboard se charge sans erreur
- ✅ Les statistiques s'affichent (même si à 0)
- ✅ Toutes les requêtes API retournent 200 OK:
  - `GET /api/dashboard/stats` → 200
  - `GET /api/dashboard/alerts` → 200
  - `GET /api/dashboard/sales-chart?period=month` → 200
  - `GET /api/dashboard/top-products?limit=5` → 200
  - `GET /api/dashboard/top-customers?limit=5` → 200
  - `GET /api/dashboard/recent-activity?limit=10` → 200

**Logs backend attendus**:
```
GET /api/dashboard/stats 200 XX ms
GET /api/dashboard/alerts 200 XX ms
GET /api/dashboard/sales-chart?period=month 200 XX ms
GET /api/dashboard/top-products?limit=5 200 XX ms
GET /api/dashboard/top-customers?limit=5 200 XX ms
GET /api/dashboard/recent-activity?limit=10 200 XX ms
```

**Logs à NE PAS voir**:
```
❌ GET /api/dashboard/stats 401
❌ warn: Token invalide reçu: undefined...
```

---

### Test 5: Vérification du Header

**Étapes**:
1. Sur le dashboard, observer le header en haut
2. Vérifier les informations utilisateur

**Résultats attendus**:
- ✅ Nom de l'utilisateur affiché: "Test User"
- ✅ Badge de rôle visible:
  - 👑 Administrateur (si premier utilisateur)
  - OU 👤 Utilisateur
- ✅ Dropdown fonctionnel au clic sur l'avatar
- ✅ Option "Déconnexion" visible

---

### Test 6: Navigation dans le Dashboard

**Étapes**:
1. Cliquer sur différents onglets de la sidebar:
   - Ventes
   - Achats
   - Stock
   - Comptabilité
   - Trésorerie
   - Rapports
   - Paramètres

**Résultats attendus**:
- ✅ Aucune erreur 401
- ✅ Navigation fluide
- ✅ Token toujours présent dans les requêtes

---

### Test 7: Rafraîchissement de la page

**Étapes**:
1. Sur le dashboard, appuyer sur F5 (rafraîchir)
2. Observer le comportement

**Résultats attendus**:
- ✅ Reste connecté (ne redirige pas vers /login)
- ✅ Dashboard se recharge correctement
- ✅ Token récupéré depuis localStorage
- ✅ Requête `GET /api/auth/me` réussit (200 OK)

---

### Test 8: Déconnexion

**Étapes**:
1. Cliquer sur le dropdown utilisateur (header)
2. Cliquer sur "Déconnexion"

**Résultats attendus**:
- ✅ Toast "Déconnexion réussie"
- ✅ Redirection vers `/login`
- ✅ Token supprimé de localStorage
- ✅ Requête `POST /api/auth/logout` réussit (200 OK)

**Logs backend attendus**:
```
info: Utilisateur déconnecté: test@example.com
POST /api/auth/logout 200 XX ms
```

---

### Test 9: Expiration du token (Optionnel)

**Étapes**:
1. Se connecter
2. Attendre 15 minutes (durée d'expiration du access token)
3. Faire une action (navigation, refresh)

**Résultats attendus**:
- ✅ Requête automatique `POST /api/auth/refresh` (200 OK)
- ✅ Nouveau token sauvegardé
- ✅ Pas de redirection vers /login
- ✅ L'action se poursuit normalement

**Logs backend attendus**:
```
info: Access token rafraîchi pour: test@example.com
POST /api/auth/refresh 200 XX ms
```

---

## 🐛 Problèmes Courants et Solutions

### Problème 1: Token undefined

**Symptômes**:
```
warn: Token invalide reçu: undefined...
GET /api/dashboard/stats 401
```

**Solutions**:
1. ✅ **Vider le cache navigateur** (le plus probable)
2. Vérifier que les corrections ont bien été appliquées:
   - `frontend/src/services/authService.js` ligne 35
   - `frontend/src/store/slices/authSlice.js` ligne 42

---

### Problème 2: Requêtes dashboard échouent

**Symptômes**:
```
GET /api/dashboard/stats 401
GET /api/dashboard/alerts 401
```

**Solutions**:
1. Vérifier que le token est dans localStorage
2. Vérifier que le header Authorization est envoyé
3. Redémarrer le frontend (Ctrl+C puis `npm run dev`)

---

### Problème 3: Backend renvoie "Refresh token manquant"

**Symptômes**:
```
error: Error: Refresh token manquant
POST /api/auth/refresh 401
```

**Solutions**:
1. Vérifier que les cookies sont activés dans le navigateur
2. Le refresh token est un cookie httpOnly, il faut que le backend soit sur le même domaine
3. Vérifier `withCredentials: true` dans `frontend/src/services/api.js`

---

## ✅ Checklist Finale

Après avoir effectué tous les tests, vérifier:

- [ ] ✅ Inscription fonctionne
- [ ] ✅ Connexion fonctionne
- [ ] ✅ Token sauvegardé dans localStorage
- [ ] ✅ Dashboard se charge sans erreur 401
- [ ] ✅ Toutes les requêtes API retournent 200
- [ ] ✅ Header affiche les bonnes informations
- [ ] ✅ Navigation fonctionne
- [ ] ✅ Rafraîchissement de page fonctionne
- [ ] ✅ Déconnexion fonctionne
- [ ] ✅ Pas de logs "Token invalide reçu: undefined"

---

## 📊 Logs Backend Attendus (Exemple Complet)

Voici à quoi doivent ressembler les logs backend lors d'une session complète:

```
info: Utilisateur connecté: test@example.com
POST /api/auth/login 200 75 ms
GET /api/auth/me 200 45 ms
GET /api/dashboard/stats 200 120 ms
GET /api/dashboard/alerts 200 85 ms
GET /api/dashboard/sales-chart?period=month 200 95 ms
GET /api/dashboard/top-products?limit=5 200 110 ms
GET /api/dashboard/top-customers?limit=5 200 130 ms
GET /api/dashboard/recent-activity?limit=10 200 90 ms
info: Utilisateur déconnecté: test@example.com
POST /api/auth/logout 200 50 ms
```

**Aucune erreur 401 ne doit apparaître!**

---

## 🎉 Succès

Si tous les tests passent, le flux Login → Dashboard est **100% fonctionnel** !

Vous pouvez maintenant:
- Utiliser l'application normalement
- Ajouter des données (clients, produits, factures)
- Tester les autres modules (Ventes, Achats, Stock, etc.)

---

## 📞 Support

Si vous rencontrez des problèmes non documentés ici, vérifiez:
1. Les logs backend dans la console
2. La console DevTools du navigateur
3. L'onglet Network pour voir les requêtes qui échouent
4. Le fichier [CORRECTIONS_LOGIN_DASHBOARD.md](CORRECTIONS_LOGIN_DASHBOARD.md)
