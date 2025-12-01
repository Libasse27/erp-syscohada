# Architecture de Validation - ERP SYSCOHADA

## Vue d'ensemble

Le système de validation de l'ERP SYSCOHADA utilise une architecture en couches qui sépare clairement la validation des données de la logique métier, garantissant ainsi la sécurité et l'intégrité des données.

## Flux de validation

```
Client Request
    ↓
Express Route
    ↓
validateBody(schema) ← Middleware de validation
    ↓
Validation Joi
    ├── ✅ Valide → Controller (logique métier)
    └── ❌ Invalide → Error Response (400)
```

## Architecture en couches

### Couche 1 : Validators (Schémas Joi)

Les validators définissent les règles de validation sous forme de schémas Joi :

```javascript
// backend/src/validators/productValidator.js
export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  code: Joi.string().trim().uppercase().required(),
  purchasePrice: Joi.number().min(0).required(),
  sellingPrice: Joi.number().min(0).required(),
  // ... autres champs
});
```

**Responsabilités :**
- Définir les types de données attendus
- Spécifier les contraintes (min, max, required, etc.)
- Fournir des messages d'erreur personnalisés
- Gérer les validations conditionnelles (`when`)
- Valider les formats spécifiques (email, téléphone, dates, etc.)

### Couche 2 : Middleware de validation

Le middleware `validateBody()` intercepte les requêtes et applique le schéma :

```javascript
// backend/src/middlewares/validationMiddleware.js
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,    // Retourner toutes les erreurs
      stripUnknown: true,   // Supprimer les champs non définis
    });

    if (error) {
      // Formater et retourner les erreurs
      return next(new AppError('Validation échouée', 400));
    }

    // Remplacer req.body par les valeurs validées
    req.body = value;
    next();
  };
};
```

**Responsabilités :**
- Exécuter la validation Joi
- Formatter les erreurs de validation
- Nettoyer les données (strip unknown fields)
- Transformer les données validées
- Bloquer les requêtes invalides avant le controller

### Couche 3 : Routes (Intégration)

Les routes combinent le middleware de validation avec les controllers :

```javascript
// backend/src/routes/productRoutes.js
import { validateBody } from '../middlewares/validationMiddleware.js';
import { createProductSchema } from '../validators/productValidator.js';
import { createProduct } from '../controllers/productController.js';

router.post('/products',
  validateBody(createProductSchema),  // ← Validation en amont
  createProduct                        // ← Logique métier
);
```

**Avantages :**
- Séparation des préoccupations
- Réutilisabilité des schémas
- Code DRY (Don't Repeat Yourself)
- Erreurs cohérentes

### Couche 4 : Controller (Logique métier)

Le controller reçoit des données **déjà validées et nettoyées** :

```javascript
// backend/src/controllers/productController.js
export const createProduct = async (req, res, next) => {
  try {
    // req.body est déjà validé ✅
    // Pas besoin de re-vérifier les types, formats, etc.

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
```

**Bénéfices :**
- Code controller plus propre
- Focus sur la logique métier
- Moins de code défensif
- Confiance dans les données

## Exemples d'utilisation

### Exemple 1 : Validation simple

```javascript
// Route
router.post('/products',
  validateBody(createProductSchema),
  createProduct
);

// Requête valide
{
  "name": "Ordinateur Dell",
  "code": "DELL-001",
  "purchasePrice": 500000,
  "sellingPrice": 650000
}
// → ✅ Passe au controller

// Requête invalide
{
  "name": "A",           // Trop court (min: 2)
  "purchasePrice": -100  // Négatif (min: 0)
}
// → ❌ Erreur 400 retournée
```

### Exemple 2 : Validation avec transformation

```javascript
// Schema
export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

// Requête
{
  "email": "  USER@EXAMPLE.COM  ",
  "password": "secret123"
}

// Après validation (req.body)
{
  "email": "user@example.com",  // ← Nettoyé et normalisé
  "password": "secret123"
}
```

### Exemple 3 : Validation conditionnelle

```javascript
// Schema
export const createInvoiceSchema = Joi.object({
  type: Joi.string().valid('sale', 'purchase'),

  customer: Joi.string()
    .when('type', {
      is: 'sale',
      then: Joi.required(),      // Requis pour les ventes
      otherwise: Joi.optional()  // Optionnel pour les achats
    }),

  supplier: Joi.string()
    .when('type', {
      is: 'purchase',
      then: Joi.required(),      // Requis pour les achats
      otherwise: Joi.optional()  // Optionnel pour les ventes
    }),
});
```

### Exemple 4 : Validation personnalisée

```javascript
// Schema avec validation custom
export const createEntrySchema = Joi.object({
  lines: Joi.array().items(entryLineSchema).min(2).required()
    .custom((value, helpers) => {
      // Validation personnalisée : équilibre comptable
      const totalDebit = value.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = value.reduce((sum, line) => sum + line.credit, 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return helpers.error('custom.unbalanced');
      }

      return value;
    })
    .messages({
      'custom.unbalanced': 'L\'écriture n\'est pas équilibrée (débit ≠ crédit)',
    }),
});
```

## Validators disponibles

### 1. authValidator.js
- Authentification et gestion des utilisateurs
- Schémas : register, login, forgotPassword, resetPassword, changePassword

### 2. productValidator.js
- Gestion des produits et du stock
- Schémas : createProduct, updateProduct, adjustStock, transferStock, searchProduct

### 3. invoiceValidator.js
- Facturation (ventes, achats, avoirs)
- Schémas : createInvoice, updateInvoice, validateInvoice, sendInvoice, searchInvoice

### 4. accountingValidator.js
- Comptabilité SYSCOHADA
- Schémas : createAccount, createEntry, closePeriod, balanceSheet, incomeStatement
- **Validation spéciale** : équilibre débit/crédit, codes SYSCOHADA

### 5. paymentValidator.js
- Paiements et Mobile Money
- Schémas : createPayment, refundPayment, transfer, reconciliation, searchPayment
- **Support** : Orange Money, Wave, Free Money

## Middlewares de validation

### validateBody(schema)
Valide le corps de la requête (req.body)

```javascript
router.post('/products', validateBody(createProductSchema), createProduct);
```

### validateQuery(schema)
Valide les query parameters (req.query)

```javascript
router.get('/products', validateQuery(searchProductSchema), getProducts);
```

### validateParams(schema)
Valide les paramètres d'URL (req.params)

```javascript
const idSchema = Joi.object({ id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/) });
router.get('/products/:id', validateParams(idSchema), getProduct);
```

### validateObjectId(paramName)
Raccourci pour valider un ObjectId MongoDB

```javascript
router.get('/products/:id', validateObjectId('id'), getProduct);
```

### validatePagination()
Valide et normalise la pagination

```javascript
router.get('/products', validatePagination(), getProducts);
// req.pagination = { page: 1, limit: 10, skip: 0 }
```

## Avantages de cette architecture

### 1. Sécurité
- ✅ Validation stricte avant traitement
- ✅ Protection contre les injections
- ✅ Sanitization automatique (XSS)
- ✅ Rejet des champs inconnus

### 2. Maintenabilité
- ✅ Schémas centralisés et réutilisables
- ✅ Modification facile des règles de validation
- ✅ Code controller plus propre
- ✅ Tests simplifiés

### 3. Expérience développeur
- ✅ Messages d'erreur clairs
- ✅ Validation côté client et serveur cohérente
- ✅ Auto-complétion avec TypeScript/JSDoc
- ✅ Documentation vivante (les schémas documentent les API)

### 4. Performance
- ✅ Validation rapide (Joi est très optimisé)
- ✅ Arrêt précoce des requêtes invalides
- ✅ Pas de logique de validation dans le controller
- ✅ Cache de schémas compilés

## Bonnes pratiques

### ✅ À faire

1. **Toujours valider les données entrantes**
   ```javascript
   router.post('/resource', validateBody(schema), controller);
   ```

2. **Utiliser des messages d'erreur clairs**
   ```javascript
   name: Joi.string().required().messages({
     'string.empty': 'Le nom est requis',
     'any.required': 'Le nom est obligatoire',
   })
   ```

3. **Valider selon le contexte**
   ```javascript
   // Création : tous les champs requis
   createSchema: { name: Joi.string().required() }

   // Mise à jour : tous les champs optionnels
   updateSchema: { name: Joi.string().optional() }
   ```

4. **Nettoyer et transformer les données**
   ```javascript
   email: Joi.string().email().lowercase().trim()
   ```

### ❌ À éviter

1. **Ne pas valider manuellement dans le controller**
   ```javascript
   // ❌ Mauvais
   if (!req.body.name || req.body.name.length < 2) {
     return res.status(400).json({ error: 'Nom invalide' });
   }

   // ✅ Bon
   router.post('/resource', validateBody(schema), controller);
   ```

2. **Ne pas faire confiance aux données sans validation**
   ```javascript
   // ❌ Dangereux
   const product = await Product.create(req.body);

   // ✅ Sûr (après validation)
   router.post('/products', validateBody(createProductSchema), async (req, res) => {
     const product = await Product.create(req.body);
   });
   ```

3. **Ne pas dupliquer les règles de validation**
   ```javascript
   // ❌ Duplication
   // Dans le controller ET dans le validator

   // ✅ Centralisé
   // Uniquement dans le validator
   ```

## Conclusion

L'architecture de validation de l'ERP SYSCOHADA garantit que :

1. **Aucune donnée invalide** n'atteint la logique métier
2. **Les controllers** se concentrent sur leur responsabilité principale
3. **La sécurité** est renforcée par la validation stricte
4. **Le code** reste maintenable et testable
5. **L'expérience développeur** est optimale

Cette approche en couches permet de construire une application robuste, sécurisée et facile à maintenir.
