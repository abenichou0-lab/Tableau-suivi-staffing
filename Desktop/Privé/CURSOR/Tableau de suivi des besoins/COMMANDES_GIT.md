# 🔧 Commandes pour résoudre l'erreur Git

## Problème
L'erreur `error: src refspec main does not match any` signifie qu'il n'y a pas encore de commit dans votre dépôt local.

## Solution étape par étape

### 1. Ouvrez PowerShell dans le dossier de votre projet
- Naviguez vers : `C:\Users\Free2live\Desktop\Privé\CURSOR\Tableau de suivi des besoins`
- Ou faites un clic droit dans le dossier → "Ouvrir dans PowerShell" / "Ouvrir dans Terminal"

### 2. Vérifiez que vous êtes dans le bon répertoire
```powershell
pwd
```
Vous devriez voir : `C:\Users\Free2live\Desktop\Privé\CURSOR\Tableau de suivi des besoins`

### 3. Vérifiez si Git est déjà initialisé
```powershell
git status
```

### 4. Si Git n'est pas initialisé dans ce dossier, initialisez-le
```powershell
git init
```

### 5. Ajoutez tous les fichiers au dépôt
```powershell
git add .
```

### 6. Créez votre premier commit
```powershell
git commit -m "Initial commit: Tableau de suivi des besoins de staffing"
```

### 7. Vérifiez que le remote est bien configuré
```powershell
git remote -v
```

Si le remote n'existe pas, ajoutez-le :
```powershell
git remote add origin https://github.com/abenichou0-lab/Tableau-suivi-staffing.git
```

### 8. Créez la branche main (si nécessaire)
```powershell
git branch -M main
```

### 9. Poussez votre code sur GitHub
```powershell
git push -u origin main
```

## Si vous avez toujours des problèmes

### Option A : Supprimer le .git existant et recommencer
```powershell
# Supprimez le dossier .git s'il existe dans le mauvais répertoire
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# Réinitialisez Git dans le bon répertoire
git init
git add .
git commit -m "Initial commit: Tableau de suivi des besoins de staffing"
git branch -M main
git remote add origin https://github.com/abenichou0-lab/Tableau-suivi-staffing.git
git push -u origin main
```

### Option B : Si le remote existe déjà
```powershell
git remote remove origin
git remote add origin https://github.com/abenichou0-lab/Tableau-suivi-staffing.git
git push -u origin main
```

## Authentification GitHub

Si GitHub vous demande vos identifiants :
- **Username** : Votre nom d'utilisateur GitHub
- **Password** : Utilisez un **Personal Access Token** (pas votre mot de passe)

Pour créer un token :
1. Allez sur GitHub.com → Votre profil → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquez sur "Generate new token"
3. Donnez-lui un nom et cochez "repo"
4. Copiez le token et utilisez-le comme mot de passe

