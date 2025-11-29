# Guide de Contribution - ERP SYSCOHADA

Merci de votre intérêt pour contribuer au projet ERP SYSCOHADA !

## 🤝 Comment contribuer

### Signaler un bug

1. Vérifier que le bug n'a pas déjà été signalé dans les [Issues](../../issues)
2. Créer une nouvelle issue avec le template "Bug Report"
3. Inclure :
   - Description détaillée du bug
   - Steps to reproduce
   - Comportement attendu vs comportement actuel
   - Screenshots si applicable
   - Environnement (OS, Node version, etc.)

### Proposer une nouvelle fonctionnalité

1. Créer une issue avec le template "Feature Request"
2. Décrire la fonctionnalité souhaitée
3. Expliquer le cas d'usage
4. Attendre l'approbation avant de commencer le développement

### Soumettre une Pull Request

1. **Fork le projet**
```bash
git clone https://github.com/votre-username/erp-syscohada.git
cd erp-syscohada
```

2. **Créer une branche**
```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

3. **Faire vos modifications**
   - Suivre les conventions de code
   - Écrire des tests si applicable
   - Commenter le code en français
   - Mettre à jour la documentation

4. **Commiter vos changements**
```bash
git add .
git commit -m "feat: ajouter la fonctionnalité X"
```

Convention de commits (suivre [Conventional Commits](https://www.conventionalcommits.org/)) :
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, point-virgule manquant, etc.
- `refactor:` refactoring du code
- `test:` ajout de tests
- `chore:` mise à jour des tâches, configuration, etc.

5. **Pousser vers votre fork**
```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

6. **Ouvrir une Pull Request**
   - Aller sur GitHub
   - Cliquer sur "New Pull Request"
   - Remplir le template de PR
   - Attendre la review

## 📝 Conventions de code

### JavaScript/React

- Utiliser ES6+ (const, let, arrow functions)
- Indentation : 2 espaces
- Point-virgule obligatoire
- Quotes : simples `'`
- Nommage :
  - Variables/fonctions : camelCase
  - Composants React : PascalCase
  - Constantes : UPPER_SNAKE_CASE

### Commentaires

Commenter en **français** :

```javascript
// Bon
// Calculer le montant total TTC
const totalTTC = calculateTotalWithVAT(amount, vatRate);

// Éviter
// Calculate total amount with VAT
const totalTTC = calculateTotalWithVAT(amount, vatRate);
```

### Fichiers

- Un composant par fichier
- Nommer le fichier comme le composant : `InvoiceForm.jsx`
- Organiser les imports :
  1. Librairies externes
  2. Composants internes
  3. Utilitaires
  4. Styles

Exemple :
```javascript
// 1. Librairies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// 2. Composants
import Button from '../common/Button';
import Modal from '../common/Modal';

// 3. Utilitaires
import { formatCurrency } from '../../utils/formatters';

// 4. Styles
import './InvoiceForm.css';
```

## 🧪 Tests

### Lancer les tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Écrire des tests

- Tests unitaires pour les fonctions utilitaires
- Tests d'intégration pour les routes API
- Tests de composants React

Exemple de test :

```javascript
// utils/formatters.test.js
import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  test('formate correctement les montants XOF', () => {
    expect(formatCurrency(1000000, 'XOF')).toBe('1 000 000 FCFA');
  });
});
```

## 📚 Documentation

Toute nouvelle fonctionnalité doit être documentée :

- Mettre à jour le README si nécessaire
- Documenter les nouvelles API dans `docs/API_DOCUMENTATION.md`
- Ajouter des exemples d'utilisation

## 🔍 Code Review

Votre PR sera reviewée selon ces critères :

- ✅ Code propre et lisible
- ✅ Respect des conventions
- ✅ Tests passent
- ✅ Documentation à jour
- ✅ Pas de régression
- ✅ Performance acceptable

## 🚫 Ce qu'il ne faut PAS faire

- ❌ Commiter des fichiers `.env`
- ❌ Commiter `node_modules/`
- ❌ Faire des commits avec des messages vagues ("fix", "update")
- ❌ Mélanger plusieurs fonctionnalités dans une seule PR
- ❌ Ignorer les erreurs du linter
- ❌ Ne pas tester son code

## 🎯 Priorités de développement

Voir les [Issues](../../issues) avec les labels :

- `good first issue` : Bon pour commencer
- `help wanted` : Besoin d'aide
- `priority: high` : Priorité haute
- `bug` : Bugs à corriger

## 📞 Questions ?

- Ouvrir une issue avec le label `question`
- Envoyer un email : contribute@erp-syscohada.com

## 📜 Code de Conduite

En participant, vous acceptez de respecter notre Code de Conduite :

- Être respectueux et inclusif
- Accepter les critiques constructives
- Se concentrer sur ce qui est meilleur pour la communauté
- Faire preuve d'empathie

## 🙏 Merci !

Toute contribution, petite ou grande, est appréciée !

---

Fait avec ❤️ par la communauté ERP SYSCOHADA
