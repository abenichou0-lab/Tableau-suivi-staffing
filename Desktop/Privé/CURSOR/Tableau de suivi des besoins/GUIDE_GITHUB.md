# 🚀 Guide : Déposer votre projet sur GitHub

Ce guide vous explique étape par étape comment déposer votre projet sur GitHub.

## 📋 Prérequis

1. Avoir un compte GitHub (si vous n'en avez pas, créez-en un sur [github.com](https://github.com))
2. Avoir Git installé sur votre ordinateur (téléchargez-le sur [git-scm.com](https://git-scm.com/downloads) si nécessaire)

## 🔧 Étape 1 : Vérifier l'installation de Git

Ouvrez PowerShell ou l'invite de commande et tapez :
```bash
git --version
```

Si Git est installé, vous verrez la version. Sinon, installez-le d'abord.

## 📦 Étape 2 : Initialiser le dépôt Git dans votre projet

1. Ouvrez PowerShell dans le dossier de votre projet (clic droit dans le dossier > "Ouvrir dans PowerShell" ou "Ouvrir dans Terminal")

2. Initialisez Git :
```bash
git init
```

## 📝 Étape 3 : Ajouter tous les fichiers

Ajoutez tous les fichiers au dépôt :
```bash
git add .
```

## 💾 Étape 4 : Créer le premier commit

Créez votre premier commit (sauvegarde) :
```bash
git commit -m "Initial commit: Tableau de suivi des besoins de staffing"
```

## 🌐 Étape 5 : Créer un dépôt sur GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous
2. Cliquez sur le bouton **"+"** en haut à droite, puis sur **"New repository"**
3. Remplissez les informations :
   - **Repository name** : `tableau-suivi-staffing` (ou le nom que vous préférez)
   - **Description** : "Application web de suivi des besoins de staffing"
   - **Visibilité** : Choisissez Public ou Private selon vos préférences
   - ⚠️ **NE COCHEZ PAS** "Add a README file" (vous en avez déjà un)
   - ⚠️ **NE COCHEZ PAS** "Add .gitignore" (vous en avez déjà un)
   - ⚠️ **NE COCHEZ PAS** "Choose a license"
4. Cliquez sur **"Create repository"**

## 🔗 Étape 6 : Lier votre projet local à GitHub

GitHub vous affichera des instructions. Utilisez celles-ci (remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub) :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/tableau-suivi-staffing.git
```

**Remplacez `VOTRE_USERNAME` par votre vrai nom d'utilisateur GitHub !**

## ⬆️ Étape 7 : Pousser votre code sur GitHub

Envoyez votre code sur GitHub :
```bash
git branch -M main
git push -u origin main
```

GitHub vous demandera vos identifiants :
- **Username** : Votre nom d'utilisateur GitHub
- **Password** : Utilisez un **Personal Access Token** (voir ci-dessous)

## 🔑 Étape 8 : Créer un Personal Access Token (si nécessaire)

Si GitHub vous demande un token au lieu d'un mot de passe :

1. Allez sur GitHub.com → Cliquez sur votre photo de profil (en haut à droite)
2. Allez dans **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
4. Donnez un nom au token (ex: "Mon projet staffing")
5. Sélectionnez la durée (ex: "No expiration" ou "90 days")
6. Cochez la case **"repo"** (pour donner accès aux dépôts)
7. Cliquez sur **"Generate token"**
8. **COPIEZ LE TOKEN** (vous ne pourrez plus le voir après !)
9. Utilisez ce token comme mot de passe lors du `git push`

## ✅ Vérification

Allez sur votre dépôt GitHub (https://github.com/VOTRE_USERNAME/tableau-suivi-staffing) et vérifiez que tous vos fichiers sont bien présents !

## 🔄 Mettre à jour votre dépôt (après des modifications)

Quand vous modifiez des fichiers et voulez les mettre à jour sur GitHub :

```bash
git add .
git commit -m "Description de vos modifications"
git push
```

## 📚 Commandes Git utiles

- `git status` : Voir l'état de vos fichiers
- `git log` : Voir l'historique des commits
- `git pull` : Récupérer les dernières modifications depuis GitHub

## 🆘 En cas de problème

- **Erreur "remote origin already exists"** : 
  ```bash
  git remote remove origin
  git remote add origin https://github.com/VOTRE_USERNAME/tableau-suivi-staffing.git
  ```

- **Erreur d'authentification** : Vérifiez que vous utilisez bien un Personal Access Token et non votre mot de passe GitHub

- **Fichiers non ajoutés** : Vérifiez que vos fichiers ne sont pas dans le `.gitignore`

---

**Bon courage ! 🎉**

