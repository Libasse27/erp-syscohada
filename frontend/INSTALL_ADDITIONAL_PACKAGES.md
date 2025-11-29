# Installation des packages additionnels

Une fois que l'application démarre correctement, vous pouvez installer les packages supplémentaires au fur et à mesure de vos besoins.

## 📦 Packages à installer progressivement

### 1. Graphiques (Charts)

```bash
npm install --legacy-peer-deps chart.js react-chartjs-2
# OU
npm install --legacy-peer-deps recharts
```

**Utilisation** : Pour les graphiques du dashboard (CA, statistiques, etc.)

---

### 2. Génération PDF

```bash
npm install --legacy-peer-deps jspdf jspdf-autotable
```

**Utilisation** : Pour générer les factures en PDF

---

###3. Gestion des dates

```bash
npm install --legacy-peer-deps date-fns react-datepicker
```

**Utilisation** : Pour les champs de sélection de date

---

### 4. Export Excel

```bash
npm install --legacy-peer-deps xlsx
```

**Utilisation** : Pour exporter les rapports en format Excel

---

### 5. Utilitaires

```bash
npm install --legacy-peer-deps lodash classnames
```

**Utilisation** : Helpers pour manipulation de données et classes CSS

---

### 6. Impression

```bash
npm install --legacy-peer-deps react-to-print
```

**Utilisation** : Pour imprimer directement depuis le navigateur

---

## 📝 Ordre recommandé d'installation

1. **Phase 1 - Démarrage** (déjà installé ✅)
   - React, Router, Redux, Bootstrap, Axios

2. **Phase 2 - Développement de base**
   ```bash
   npm install --legacy-peer-deps date-fns react-datepicker
   ```

3. **Phase 3 - Facturation**
   ```bash
   npm install --legacy-peer-deps jspdf jspdf-autotable
   ```

4. **Phase 4 - Dashboard**
   ```bash
   npm install --legacy-peer-deps chart.js react-chartjs-2
   ```

5. **Phase 5 - Reporting**
   ```bash
   npm install --legacy-peer-deps xlsx react-to-print
   ```

6. **Phase 6 - Utilitaires**
   ```bash
   npm install --legacy-peer-deps lodash classnames
   ```

---

## ⚠️ Important

- Toujours utiliser le flag `--legacy-peer-deps`
- Installer les packages un par un ou par petits groupes
- Tester l'application après chaque installation
- En cas d'erreur, supprimer le package et réessayer

---

## 🚀 Installation complète (quand tout fonctionne)

Si vous voulez réinstaller tout d'un coup après avoir vérifié que l'app fonctionne :

```bash
npm install --legacy-peer-deps chart.js react-chartjs-2 recharts date-fns react-datepicker jspdf jspdf-autotable xlsx react-to-print lodash classnames
```

---

## 🛠️ Packages alternatifs

### Pour les graphiques
- **Alternative à Chart.js** : `recharts`, `victory`, `nivo`

### Pour le PDF
- **Alternative à jsPDF** : `react-pdf`, `pdfmake`

### Pour les dates
- **Alternative à date-fns** : `moment`, `dayjs`, `luxon`

---

## 📖 Documentation

- Chart.js : https://www.chartjs.org/
- jsPDF : https://github.com/parallax/jsPDF
- date-fns : https://date-fns.org/
- xlsx : https://github.com/SheetJS/sheetjs

---

Bon développement ! 🎉
