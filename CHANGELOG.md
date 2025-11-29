# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### À venir
- Module de gestion des immobilisations
- Exports comptables pour logiciels tiers
- Application mobile (React Native)
- Support multilingue (Français, Wolof)

## [1.0.0] - 2025-01-XX

### Ajouté
- Initialisation du projet ERP SYSCOHADA
- Structure complète du projet (Backend + Frontend + Docker)
- Configuration de l'environnement de développement
- Documentation de base (README, INSTALLATION, CONTRIBUTING)

#### Backend
- Configuration Express.js avec MongoDB
- Système d'authentification JWT
- Middlewares de sécurité (Helmet, CORS, Rate Limiting)
- Logger avec Winston
- Gestion centralisée des erreurs
- Configuration Docker

#### Frontend
- Configuration React 18 avec Bootstrap 5
- Redux Toolkit pour la gestion d'état
- Configuration Axios avec intercepteurs
- Système de routing avec React Router v6
- Composants de base (Layout, Common)
- Configuration des styles globaux

#### Infrastructure
- Docker Compose pour développement et production
- Configuration Nginx
- Scripts de déploiement

#### Documentation
- README complet
- Guide d'installation détaillé
- Guide de contribution
- Structure de documentation technique

### Sécurité
- Hash des mots de passe avec bcrypt
- Protection CSRF
- Rate limiting sur les routes sensibles
- Validation des entrées
- Headers sécurisés

---

## Légende des types de changements

- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements dans les fonctionnalités existantes
- **Déprécié** : Fonctionnalités bientôt supprimées
- **Supprimé** : Fonctionnalités supprimées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Corrections de vulnérabilités
