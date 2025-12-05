# Documentation des Styles - Composants Layout

## 📋 Vue d'ensemble

Ce document décrit les styles CSS créés pour les composants de layout (Header, Sidebar, Footer) en conformité avec le design du dashboard.

## 🎨 Fichiers Créés

### 1. **header.css** - Barre de navigation supérieure

**Chemin**: `frontend/src/styles/header.css`

**Variables CSS utilisées**:
```css
--header-height: 70px
--header-bg: var(--bg-primary)
--header-border: var(--border-color)
--header-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
--header-z-index: 1000
```

**Classes principales**:

| Classe | Description |
|--------|-------------|
| `.header` | Conteneur principal du header (fixed top) |
| `.header-container` | Container flex pour le contenu |
| `.header-left` | Section gauche (logo + toggle) |
| `.header-center` | Section centrale (breadcrumb) |
| `.header-right` | Section droite (actions + profil) |
| `.header-logo` | Logo et texte de l'application |
| `.header-action-btn` | Boutons d'action (notifications, etc.) |
| `.header-badge` | Badge de notification |
| `.header-profile` | Bouton profil utilisateur |
| `.header-avatar` | Avatar circulaire |
| `.header-dropdown` | Menu dropdown profil |

**Fonctionnalités**:
- ✅ Fixed en haut de page
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Dropdown profil avec animation
- ✅ Badges de notification
- ✅ Status en ligne (point vert)
- ✅ Breadcrumb (masqué sur mobile)
- ✅ Dark mode support
- ✅ Tooltips en mode collapsed

**Exemple d'utilisation**:
```html
<header class="header">
  <div class="header-container">
    <!-- Gauche -->
    <div class="header-left">
      <button class="sidebar-toggle">
        <i class="bi bi-list"></i>
      </button>
      <a href="/" class="header-logo">
        <div class="header-logo-icon">ERP</div>
        <span class="header-logo-text">SYSCOHADA</span>
      </a>
    </div>

    <!-- Droite -->
    <div class="header-right">
      <button class="header-action-btn">
        <i class="bi bi-bell"></i>
        <span class="header-badge">3</span>
      </button>

      <div class="header-profile">
        <button class="header-profile-btn">
          <div class="header-avatar">
            JD
            <span class="header-avatar-status"></span>
          </div>
          <div class="header-profile-info">
            <span class="header-profile-name">John Doe</span>
            <span class="header-profile-role">Administrateur</span>
          </div>
          <i class="bi bi-chevron-down header-profile-arrow"></i>
        </button>

        <div class="header-dropdown">
          <!-- Contenu dropdown -->
        </div>
      </div>
    </div>
  </div>
</header>
```

---

### 2. **sidebar.css** - Menu latéral

**Chemin**: `frontend/src/styles/sidebar.css`

**Variables CSS utilisées**:
```css
--sidebar-width: 260px
--sidebar-width-collapsed: 70px
--sidebar-bg: var(--bg-primary)
--sidebar-border: var(--border-color)
--sidebar-shadow: 2px 0 8px rgba(0, 0, 0, 0.08)
--sidebar-z-index: 999
```

**Classes principales**:

| Classe | Description |
|--------|-------------|
| `.sidebar` | Conteneur principal de la sidebar (fixed left) |
| `.sidebar.collapsed` | État collapsed (70px de largeur) |
| `.sidebar.mobile-hidden` | Masqué sur mobile |
| `.sidebar.mobile-visible` | Visible sur mobile (overlay) |
| `.sidebar-overlay` | Overlay sombre pour mobile |
| `.sidebar-header` | En-tête avec logo |
| `.sidebar-nav` | Zone de navigation scrollable |
| `.sidebar-menu` | Liste du menu principal |
| `.sidebar-menu-link` | Lien de menu |
| `.sidebar-menu-link.active` | Lien actif (avec barre gauche) |
| `.sidebar-submenu` | Sous-menu (max-height animé) |
| `.sidebar-submenu.open` | Sous-menu ouvert |
| `.sidebar-footer` | Footer avec info utilisateur |

**Fonctionnalités**:
- ✅ Fixed à gauche sous le header
- ✅ Mode collapsed (70px)
- ✅ Sub-menus avec animation
- ✅ Active state avec barre indicatrice
- ✅ Custom scrollbar
- ✅ Mobile overlay avec backdrop
- ✅ Tooltips en mode collapsed
- ✅ Dark mode support
- ✅ Gradient header
- ✅ Auto-open sub-menu si enfant actif

**Exemple d'utilisation**:
```html
<aside class="sidebar">
  <!-- Header -->
  <div class="sidebar-header">
    <a href="/" class="sidebar-header-brand">
      <div class="sidebar-header-icon">
        <i class="bi bi-grid"></i>
      </div>
      <span class="sidebar-header-text">ERP SYSCOHADA</span>
    </a>
    <button class="sidebar-toggle-btn">
      <i class="bi bi-chevron-left"></i>
    </button>
  </div>

  <!-- Navigation -->
  <nav class="sidebar-nav">
    <ul class="sidebar-menu">
      <li class="sidebar-menu-item">
        <a href="/dashboard" class="sidebar-menu-link active" data-tooltip="Dashboard">
          <i class="bi bi-speedometer2 sidebar-menu-icon"></i>
          <span class="sidebar-menu-text">Dashboard</span>
        </a>
      </li>

      <!-- Avec sub-menu -->
      <li class="sidebar-menu-item">
        <a href="#" class="sidebar-menu-link open" data-tooltip="Ventes">
          <i class="bi bi-cart sidebar-menu-icon"></i>
          <span class="sidebar-menu-text">Ventes</span>
          <i class="bi bi-chevron-right sidebar-menu-arrow"></i>
        </a>
        <ul class="sidebar-submenu open">
          <li class="sidebar-submenu-item">
            <a href="/sales/customers" class="sidebar-submenu-link">
              <span class="sidebar-submenu-emoji">👥</span>
              <span>Clients</span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>

  <!-- Footer -->
  <div class="sidebar-footer">
    <div class="sidebar-footer-user">
      <div class="sidebar-footer-avatar">JD</div>
      <div class="sidebar-footer-info">
        <span class="sidebar-footer-name">John Doe</span>
        <span class="sidebar-footer-role">
          <span class="sidebar-footer-badge">Admin</span>
        </span>
      </div>
    </div>
  </div>
</aside>

<!-- Overlay mobile -->
<div class="sidebar-overlay"></div>
```

---

### 3. **footer.css** - Pied de page

**Chemin**: `frontend/src/styles/footer.css`

**Variables CSS utilisées**:
```css
--footer-bg: var(--bg-primary)
--footer-border: var(--border-color)
--footer-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05)
```

**Classes principales**:

| Classe | Description |
|--------|-------------|
| `.footer` | Conteneur principal (adapte margin avec sidebar) |
| `.footer-main` | Section principale (4 colonnes) |
| `.footer-grid` | Grille responsive (1/2/4 colonnes) |
| `.footer-column` | Colonne de contenu |
| `.footer-logo` | Logo dans le footer |
| `.footer-links` | Liste de liens |
| `.footer-contact` | Informations de contact |
| `.footer-social` | Liens réseaux sociaux |
| `.footer-newsletter` | Formulaire newsletter |
| `.footer-bottom` | Barre copyright |
| `.footer-legal` | Liens légaux |
| `.footer-badge` | Badge "Made with ❤️" |
| `.footer-info-bar` | Barre d'infos supplémentaires |

**Fonctionnalités**:
- ✅ Grille responsive (1/2/4 colonnes)
- ✅ 4 sections: À propos, Liens rapides, Contact, Newsletter
- ✅ Icônes colorées pour réseaux sociaux
- ✅ Formulaire newsletter
- ✅ Animations au hover
- ✅ Badge "Made with ❤️ in Africa"
- ✅ Liens légaux avec animation underline
- ✅ Dark mode support
- ✅ S'adapte à la sidebar (margin-left)

**Exemple d'utilisation**:
```html
<footer class="footer">
  <!-- Section principale -->
  <div class="footer-main">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Colonne 1: À propos -->
        <div class="footer-column">
          <a href="/" class="footer-logo">
            <div class="footer-logo-icon">ERP</div>
            <span class="footer-logo-text">SYSCOHADA</span>
          </a>
          <p class="footer-description">
            Solution complète de gestion pour les entreprises africaines...
          </p>
          <div class="footer-social">
            <a href="#" class="footer-social-link facebook">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="#" class="footer-social-link twitter">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="#" class="footer-social-link linkedin">
              <i class="bi bi-linkedin"></i>
            </a>
          </div>
        </div>

        <!-- Colonne 2: Liens rapides -->
        <div class="footer-column">
          <h4 class="footer-column-title">
            <i class="bi bi-link"></i>
            Liens rapides
          </h4>
          <ul class="footer-links">
            <li class="footer-link-item">
              <a href="/dashboard" class="footer-link">
                <span class="footer-link-emoji">📊</span>
                <span>Dashboard</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Colonne 3: Contact -->
        <div class="footer-column">
          <h4 class="footer-column-title">
            <i class="bi bi-envelope"></i>
            Contact
          </h4>
          <ul class="footer-contact">
            <li class="footer-contact-item">
              <div class="footer-contact-icon">
                <i class="bi bi-geo-alt"></i>
              </div>
              <div class="footer-contact-text">
                <span class="footer-contact-label">Adresse</span>
                <span class="footer-contact-value">Dakar, Sénégal</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Colonne 4: Newsletter -->
        <div class="footer-column">
          <h4 class="footer-column-title">
            <i class="bi bi-newspaper"></i>
            Newsletter
          </h4>
          <p class="footer-newsletter-text">
            Abonnez-vous pour recevoir nos actualités
          </p>
          <form class="footer-newsletter-form">
            <input
              type="email"
              class="footer-newsletter-input"
              placeholder="Votre email"
            />
            <button type="submit" class="footer-newsletter-btn">
              S'abonner
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Barre d'informations -->
  <div class="footer-info-bar">
    <div class="footer-info-content">
      <div class="footer-info-item">
        <i class="bi bi-shield-check"></i>
        <span>Conforme SYSCOHADA</span>
      </div>
      <div class="footer-info-item">
        <i class="bi bi-lock"></i>
        <span>Données sécurisées</span>
      </div>
      <div class="footer-info-item">
        <i class="bi bi-headset"></i>
        <span>Support 24/7</span>
      </div>
    </div>
  </div>

  <!-- Copyright -->
  <div class="footer-bottom">
    <div class="footer-bottom-content">
      <p class="footer-copyright">
        &copy; 2024 ERP SYSCOHADA. Tous droits réservés.
      </p>

      <div class="footer-badge">
        Made with <i class="bi bi-heart-fill"></i> in Africa
      </div>

      <ul class="footer-legal">
        <li class="footer-legal-item">
          <a href="/privacy" class="footer-legal-link">Confidentialité</a>
        </li>
        <li class="footer-legal-item">
          <a href="/terms" class="footer-legal-link">CGU</a>
        </li>
      </ul>
    </div>
  </div>
</footer>
```

---

## 🎯 Intégration avec le Dashboard

### Variables CSS Communes

Tous les composants utilisent les mêmes variables CSS définies dans `variables.css`:

```css
/* Couleurs */
--bg-primary, --bg-secondary, --bg-tertiary
--text-primary, --text-secondary, --text-tertiary
--color-primary, --color-primary-dark, --color-primary-light
--border-color

/* Espacements */
--spacing-1 à --spacing-32

/* Typographie */
--font-size-xs à --font-size-7xl
--font-weight-normal à --font-weight-black

/* Effets */
--shadow-sm, --shadow-md, --shadow-lg
--border-radius-sm, --border-radius-md, --border-radius-lg, --border-radius-full

/* Transitions */
--transition-speed-fast, --transition-speed-base
--transition-timing
```

### Layout Global

```
┌─────────────────────────────────────────┐
│           HEADER (fixed top)            │ 70px
├──────────┬──────────────────────────────┤
│          │                              │
│          │                              │
│ SIDEBAR  │        MAIN CONTENT          │
│ (fixed)  │    (margin-left: 260px)      │
│ 260px    │                              │
│          │                              │
│          ├──────────────────────────────┤
│          │         FOOTER               │
│          │   (margin-left: 260px)       │
└──────────┴──────────────────────────────┘
```

**En mode collapsed**:
- Sidebar: 70px
- Main content: margin-left: 70px
- Footer: margin-left: 70px

**Sur mobile** (< 768px):
- Sidebar: overlay (0px, puis 280px)
- Main content: margin-left: 0
- Footer: margin-left: 0

---

## 📱 Responsive Breakpoints

| Device | Breakpoint | Sidebar | Header | Footer |
|--------|-----------|---------|--------|--------|
| Mobile | < 768px | Overlay 280px | Collapsed info | 1 colonne |
| Tablette | 768px - 1023px | Fixed 220px | Info visible | 2 colonnes |
| Desktop | ≥ 1024px | Fixed 260px | Full | 4 colonnes |

---

## 🌙 Dark Mode

Tous les composants supportent le dark mode via l'attribut `data-theme="dark"`:

```css
[data-theme="dark"] {
  --header-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  --sidebar-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  --footer-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
}
```

---

## ♿ Accessibilité

### Focus States
Tous les éléments interactifs ont des états de focus visibles:
```css
.element:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Reduced Motion
Support pour `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none;
    transition: none;
  }
}
```

### ARIA Labels
Ajouter des labels appropriés:
```html
<button aria-label="Ouvrir le menu" class="sidebar-toggle">
  <i class="bi bi-list"></i>
</button>
```

---

## 🖨️ Print Styles

Les composants incluent des styles d'impression:

```css
@media print {
  .header { display: none; }
  .sidebar { display: none; }
  .footer-main { display: none; }
  .footer-bottom { page-break-inside: avoid; }
}
```

---

## 🔧 Personnalisation

### Changer les couleurs

Modifier `variables.css`:
```css
:root {
  --color-primary: #your-color;
  --sidebar-bg: #your-bg;
  --header-bg: #your-bg;
}
```

### Changer les dimensions

```css
:root {
  --header-height: 80px; /* Par défaut: 70px */
  --sidebar-width: 300px; /* Par défaut: 260px */
  --sidebar-width-collapsed: 80px; /* Par défaut: 70px */
}
```

### Désactiver les animations

```css
* {
  animation: none !important;
  transition: none !important;
}
```

---

## ✅ Checklist d'Intégration

- [ ] ✅ Importer `main.scss` dans `index.jsx`
- [ ] ✅ Vérifier que `variables.css` est chargé en premier
- [ ] ✅ Ajouter les classes aux composants React (Header, Sidebar, Footer)
- [ ] ✅ Implémenter le toggle collapsed pour la sidebar
- [ ] ✅ Implémenter le dropdown du profil dans le header
- [ ] ✅ Ajouter l'overlay mobile pour la sidebar
- [ ] ✅ Gérer les classes `active` pour les liens du menu
- [ ] ✅ Implémenter l'auto-open des sub-menus
- [ ] ✅ Tester sur mobile, tablette, desktop
- [ ] ✅ Tester le dark mode
- [ ] ✅ Vérifier l'accessibilité (focus, ARIA)
- [ ] ✅ Tester l'impression

---

## 📦 Fichiers Modifiés

1. **Créés**:
   - `frontend/src/styles/header.css` (543 lignes)
   - `frontend/src/styles/sidebar.css` (686 lignes)
   - `frontend/src/styles/footer.css` (619 lignes)

2. **Modifiés**:
   - `frontend/src/styles/main.scss` (ajout des imports)

3. **Total**: ~1850 lignes de CSS professionnel

---

## 🎨 Conformité Dashboard

Les styles suivent exactement les mêmes conventions que `dashboard.css`:
- ✅ Mêmes variables CSS
- ✅ Même structure de classes (BEM-like)
- ✅ Mêmes transitions et animations
- ✅ Même palette de couleurs
- ✅ Mêmes bordures et ombres
- ✅ Même responsive design

---

## 🚀 Prochaines Étapes

1. Appliquer les classes dans les composants React:
   - `frontend/src/components/layout/Header.jsx`
   - `frontend/src/components/layout/Sidebar.jsx`
   - `frontend/src/components/layout/Footer.jsx`

2. Implémenter la logique JavaScript:
   - Toggle sidebar collapsed
   - Toggle dropdown profil
   - Toggle overlay mobile
   - Active state management
   - Sub-menu auto-open

3. Tester le rendu visuel et la responsivité

4. Ajuster les variables si nécessaire

---

**Auteur**: Documentation créée le 2024-12-05
**Version**: 1.0.0
**Statut**: ✅ Prêt pour intégration
