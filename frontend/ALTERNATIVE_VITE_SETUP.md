# Alternative : Utiliser Vite au lieu de Create React App

Si les problèmes avec `react-scripts` persistent, vous pouvez migrer vers **Vite**, une alternative moderne, plus rapide et avec moins de problèmes de dépendances.

## 🚀 Pourquoi Vite ?

- ✅ **Plus rapide** : Démarrage instantané
- ✅ **Moins de bugs** : Pas de problèmes de dépendances
- ✅ **Plus moderne** : Support natif ESM
- ✅ **Mieux maintenu** : Plus activement développé
- ✅ **Hot Module Replacement** : Rechargement ultra rapide

## 📦 Migration vers Vite (si react-scripts ne fonctionne pas)

### Option 1 : Nouveau projet avec Vite

```bash
# Dans le dossier erp-syscohada
cd ..
npx create-vite@latest frontend-vite --template react
cd frontend-vite

# Installer les dépendances
npm install

# Installer Bootstrap et autres packages
npm install bootstrap bootstrap-icons react-bootstrap
npm install react-router-dom @reduxjs/toolkit react-redux
npm install axios formik yup react-hot-toast react-icons
```

### Option 2 : Convertir le projet actuel

#### 1. Supprimer react-scripts

```bash
cd frontend
npm uninstall react-scripts
```

#### 2. Installer Vite

```bash
npm install --save-dev vite @vitejs/plugin-react
```

#### 3. Créer `vite.config.js`

Créer le fichier `vite.config.js` à la racine de `frontend/` :

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
})
```

#### 4. Modifier `package.json`

Remplacer les scripts :

```json
{
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### 5. Déplacer `index.html`

```bash
# Déplacer index.html de public/ vers la racine frontend/
mv public/index.html ./
```

#### 6. Modifier `index.html`

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ERP SYSCOHADA</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
```

#### 7. Modifier `src/index.js`

Changer l'extension en `.jsx` ou garder `.js` :

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from './store/store'
import App from './App'

// Import des styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
```

#### 8. Démarrer avec Vite

```bash
npm run dev
# OU
npm start
```

## 📝 Différences avec Create React App

| Fonctionnalité | Create React App | Vite |
|----------------|------------------|------|
| Commande start | `npm start` | `npm run dev` |
| Port par défaut | 3000 | 5173 (configurable) |
| Variables d'env | `REACT_APP_*` | `VITE_*` |
| index.html | Dans `public/` | À la racine |
| Import assets | Automatique | `import.meta.url` |

## 🔧 Variables d'environnement

Avec Vite, renommer les variables dans `.env` :

```env
# Avant (CRA)
REACT_APP_API_URL=http://localhost:5000/api

# Après (Vite)
VITE_API_URL=http://localhost:5000/api
```

Puis dans le code :

```javascript
// Avant
const apiUrl = process.env.REACT_APP_API_URL

// Après
const apiUrl = import.meta.env.VITE_API_URL
```

## 📦 package.json complet pour Vite

```json
{
  "name": "erp-syscohada-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "axios": "^1.6.2",
    "bootstrap": "^5.3.2",
    "react-bootstrap": "^2.9.1",
    "bootstrap-icons": "^1.11.2",
    "formik": "^2.4.5",
    "yup": "^1.3.3",
    "react-hot-toast": "^2.4.1",
    "react-icons": "^4.12.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

## ✅ Avantages de Vite

1. **Pas de problèmes de dépendances** comme avec react-scripts
2. **Démarrage instantané** (< 1 seconde)
3. **Hot reload ultra rapide**
4. **Build plus rapide**
5. **Configuration simple**

## 🎯 Recommandation

Si `react-scripts` continue de poser problème même après plusieurs tentatives, **migrez vers Vite**. C'est l'outil moderne recommandé pour les nouveaux projets React.

---

**Note** : Vite est utilisé par de nombreuses entreprises et est maintenu activement. C'est le futur de React, tandis que Create React App n'est plus vraiment maintenu.
