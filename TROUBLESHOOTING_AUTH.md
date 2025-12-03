# Guide de dépannage - Erreurs d'authentification

## Problème: "Token invalide" après rafraîchissement

### Symptômes
- Erreurs répétitives "Token invalide" dans les logs backend
- Requêtes API retournent 401
- Le rafraîchissement du token réussit mais les requêtes suivantes échouent encore

### Causes
1. **Cache du navigateur**: Le navigateur utilise l'ancien code JavaScript qui n'a pas la logique de file d'attente pour les tokens
2. **Token expiré dans localStorage**: Un ancien token invalide est stocké dans le navigateur
3. **Race condition**: Plusieurs requêtes tentent simultanément de rafraîchir le token

### Solutions

#### Solution 1: Rafraîchir le navigateur (RECOMMANDÉ)
1. Ouvrir la console développeur (F12)
2. Vider le cache et les données du site :
   - Chrome/Edge: Outils de développement → Application → Storage → Clear site data
   - Firefox: F12 → Storage → Cookies/Local Storage → Delete all
3. Effectuer un hard refresh : **Ctrl + F5** (ou Cmd + Shift + R sur Mac)
4. Se reconnecter à l'application

#### Solution 2: Nettoyer le localStorage manuellement
1. Ouvrir la console développeur (F12)
2. Onglet Console
3. Exécuter les commandes suivantes:
```javascript
// Supprimer tous les tokens
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.clear();

// Recharger la page
location.reload();
```
4. Se reconnecter

#### Solution 3: Navigation privée
1. Fermer tous les onglets de l'application
2. Ouvrir une fenêtre de navigation privée/incognito
3. Accéder à http://localhost:3000
4. Se connecter normalement

### Vérification après correction
Après avoir appliqué une des solutions ci-dessus, vous devriez voir dans les logs backend:
- ✅ Un seul message "Access token rafraîchi" par session
- ✅ Aucune erreur "Token invalide" après le rafraîchissement
- ✅ Requêtes API retournent 200 (succès)

### Prévention
Pour éviter ce problème à l'avenir:
1. Toujours utiliser Ctrl+F5 pour rafraîchir après une mise à jour du code
2. Vider régulièrement le cache du navigateur pendant le développement
3. Utiliser la navigation privée pour tester l'authentification
4. Ne pas garder plusieurs onglets de l'application ouverts simultanément

### Détails techniques
Le système d'authentification utilise:
- **Access Token**: JWT court terme (15 minutes) stocké dans localStorage
- **Refresh Token**: JWT long terme (7 jours) stocké dans httpOnly cookie
- **File d'attente**: Toutes les requêtes simultanées attendent le même rafraîchissement

La logique de rafraîchissement:
1. Requête reçoit 401 (token expiré)
2. Si rafraîchissement déjà en cours → mettre en file d'attente
3. Sinon → rafraîchir le token
4. Toutes les requêtes en attente utilisent le nouveau token
5. Retry de toutes les requêtes avec le nouveau token

## Contact Support
Si le problème persiste après avoir essayé toutes les solutions:
1. Vérifier que le backend fonctionne : http://localhost:5000/health
2. Vérifier les logs backend pour les erreurs
3. Consulter la documentation d'authentification dans `/backend/src/middlewares/authMiddleware.js`
