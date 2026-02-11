# 📊 Tableau de Suivi des Besoins de Staffing

Une application web moderne et intuitive pour gérer et suivre les besoins de staffing, les demandes clients, les CV envoyés, les interviews et les deals.

## ✨ Fonctionnalités

- **Gestion des demandes** : Création, modification et suivi des demandes de staffing
- **Statistiques en temps réel** : 
  - Total des demandes
  - Demandes du mois
  - Jobs ouverts/fermés
  - Taux de transformation
  - Taux de réponse
  - Compteur de deals
  - Marge totale générée
- **Système de priorité visuelle** :
  - 🔴 Rouge : Demandes non traitées depuis plus de 48h
  - 🟠 Orange : Demandes entre 24h et 48h
  - 🟢 Vert : Demandes récentes (<24h) ou avec CV validés
- **Filtres avancés** :
  - Recherche par date, client ou fonction
  - Filtrage par qualité (A, B, C, D)
  - Filtrage par statut (ouvert/fermé)
- **Gestion des consultants** : Suivi des CV envoyés et des consultants associés
- **Gestion des interviews** : Suivi des entretiens programmés
- **Export Excel** : Exportation des données au format Excel
- **Sauvegarde locale** : Stockage des données dans le navigateur (localStorage)
- **Sauvegarde/Chargement** : Export et import de fichiers JSON pour sauvegarde externe

## 🚀 Installation

1. Clonez ce dépôt :
```bash
git clone https://github.com/VOTRE_USERNAME/tableau-suivi-staffing.git
cd tableau-suivi-staffing
```

2. Ouvrez `index.html` dans votre navigateur web moderne (Chrome, Firefox, Edge, Safari)

C'est tout ! Aucune installation de dépendances n'est nécessaire, l'application fonctionne directement dans le navigateur.

## 📖 Utilisation

### Ajouter une nouvelle demande

1. Cliquez sur le bouton **"+ Nouvelle demande"**
2. Remplissez le formulaire avec les informations requises :
   - Date et heure d'entrée
   - Informations client (nom, téléphone, email)
   - Fonction recherchée
   - Nombre de positions (N)
   - Qualité du job (A, B, C, D)
   - Fiabilité (1-9)
   - CV envoyés
   - Consultants et interviews
   - Chemin du dossier CVs
   - Statut (ouvert/fermé)
   - Deal et marge (si applicable)
3. Cliquez sur **"Enregistrer"**

### Sauvegarder vos données

- **Sauvegarde automatique** : Les données sont automatiquement sauvegardées dans le navigateur
- **Sauvegarde manuelle** : Cliquez sur **"💾 Sauvegarder"** pour exporter un fichier JSON
- **Charger une sauvegarde** : Cliquez sur **"📂 Charger"** pour importer un fichier JSON précédemment sauvegardé

### Exporter en Excel

Cliquez sur **"⬇ Exporter en Excel"** pour télécharger toutes vos données au format Excel (.xlsx)

### Filtrer et rechercher

- Utilisez la barre de recherche pour trouver des demandes par date, client ou fonction
- Utilisez les boutons de filtre pour afficher les demandes par priorité (Rouge, Orange, Vert)
- Sélectionnez une qualité spécifique dans le menu déroulant
- Activez le toggle pour afficher uniquement les besoins ouverts

## 🛠️ Technologies utilisées

- **HTML5** : Structure de l'application
- **CSS3** : Styles et design responsive
- **JavaScript (ES6+)** : Logique de l'application
- **localStorage** : Stockage local des données
- **SheetJS (xlsx)** : Export Excel (via CDN)

## 📁 Structure du projet

```
tableau-suivi-staffing/
│
├── index.html          # Page principale de l'application
├── styles.css          # Feuille de style
├── script.js           # Logique JavaScript
└── README.md           # Documentation du projet
```

## 🔒 Données et confidentialité

Les données sont stockées localement dans votre navigateur (localStorage). Aucune donnée n'est envoyée à un serveur externe. Pour sauvegarder vos données de manière permanente, utilisez la fonction d'export JSON.

## 🌐 Compatibilité

- ✅ Chrome (recommandé)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Opera

## 📝 Notes

- Les données sont stockées dans le navigateur, pensez à exporter régulièrement vos données
- Pour une sauvegarde permanente, utilisez la fonction d'export JSON
- L'application fonctionne entièrement hors ligne après le premier chargement

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## 📄 Licence

Ce projet est sous licence libre. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 👤 Auteur

Créé pour faciliter le suivi des besoins de staffing et améliorer la gestion des demandes clients.

---

**Note** : Cette application fonctionne entièrement côté client, aucune connexion internet n'est requise après le premier chargement (sauf pour le CDN SheetJS, mais l'export fonctionnera même hors ligne si la bibliothèque est déjà en cache).

