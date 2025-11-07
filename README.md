# Script d'envoi de fichiers aux fournisseurs

Ce script Node.js télécharge automatiquement un fichier depuis une URL et l'envoie à un fournisseur via FTP.

## 📑 Table des matières

1. [Démarrage rapide (pour débutants)](#-démarrage-rapide-pour-débutants)
2. [Installation de Node.js](#-installation-de-nodejs)
3. [Installation du script](#-installation-du-script)
4. [Configuration](#️-configuration)
5. [Utilisation](#-utilisation)
6. [Logs et vérification](#-logs)
7. [Dépannage](#-dépannage)
8. [Structure du projet](#-structure-du-projet)

---

## 🎯 Démarrage rapide (pour débutants)

**Vous n'avez jamais codé ? Pas de problème ! Suivez ces étapes :**

### Étape 1 : Ouvrir le Terminal

**Sur macOS :**

1. Appuyez sur `Cmd + Espace` (barre de recherche Spotlight)
2. Tapez "Terminal" et appuyez sur Entrée
3. Une fenêtre noire ou blanche s'ouvre (c'est le Terminal)

**Sur Windows :**

1. Appuyez sur la touche `Windows`
2. Tapez "cmd" ou "Invite de commandes"
3. Cliquez sur "Invite de commandes"

**Sur Linux :**

1. Appuyez sur `Ctrl + Alt + T`

### Étape 2 : Vérifier si Node.js est installé

Dans le Terminal, tapez cette commande et appuyez sur Entrée :

```bash
node --version
```

**Si vous voyez quelque chose comme `v18.x.x` ou `v20.x.x`** → Node.js est déjà installé ! Passez à [l'installation du script](#-installation-du-script).

**Si vous voyez une erreur** → Continuez à la section suivante pour installer Node.js.

---

## 📦 Installation de Node.js

### Sur macOS

**Méthode 1 : Via le site officiel (recommandé pour débutants)**

1. Allez sur [https://nodejs.org/](https://nodejs.org/)
2. Cliquez sur le gros bouton vert "LTS" (version recommandée)
3. Une fois téléchargé, ouvrez le fichier `.pkg`
4. Suivez l'assistant d'installation (cliquez sur "Continuer" à chaque étape)
5. Entrez votre mot de passe macOS quand demandé
6. Attendez la fin de l'installation

**Méthode 2 : Via Homebrew (pour utilisateurs avancés)**

```bash
# Installer Homebrew si ce n'est pas déjà fait
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Node.js
brew install node
```

### Sur Windows

1. Allez sur [https://nodejs.org/](https://nodejs.org/)
2. Cliquez sur le bouton "LTS" (version recommandée)
3. Une fois téléchargé, ouvrez le fichier `.msi`
4. Suivez l'assistant d'installation
5. **Acceptez toutes les options par défaut** (notamment "Add to PATH")
6. Attendez la fin de l'installation
7. Cliquez sur "Finish"

### Sur Linux (Ubuntu/Debian)

Ouvrez le Terminal et tapez :

```bash
# Installer Node.js via NodeSource (version LTS recommandée)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Entrez votre mot de passe quand demandé.

### Sur Linux (Fedora/CentOS/RHEL)

```bash
# Installer Node.js via NodeSource
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo dnf install -y nodejs
```

### Vérifier l'installation de Node.js

Fermez et rouvrez votre Terminal, puis tapez :

```bash
node --version
npm --version
```

Vous devriez voir s'afficher deux numéros de version.

Si ça fonctionne, bravo ! Node.js est installé correctement. 🎉

---

## 📋 Prérequis

- ✅ Node.js 16.x ou supérieur (voir section ci-dessus)
- Accès à un serveur FTP (fourni par votre fournisseur)
- URL du fichier à télécharger

---

## 🚀 Installation du script

### Étape 1 : Télécharger le projet

**Téléchargez tous les fichiers** de ce projet dans un dossier sur votre ordinateur.

### Étape 2 : Naviguer vers le dossier

Dans le Terminal, tapez (remplacez le chemin par le vôtre) :

```bash
cd /Users/votre_nom/Documents/Travail/FTP_Frs_GLOBAL
```

💡 **Astuce** : Vous pouvez glisser-déposer le dossier dans le Terminal pour obtenir automatiquement le chemin complet.

### Étape 3 : Installer les dépendances Node.js

Dans le Terminal (assurez-vous d'être dans le bon dossier), tapez :

```bash
npm install
```

Appuyez sur Entrée et attendez. Vous verrez du texte défiler, c'est normal. Cela installe les bibliothèques nécessaires (axios, basic-ftp, dotenv).

---

## ⚙️ Configuration

### Créer le fichier de configuration

Dans le Terminal, tapez :

**Sur macOS/Linux :**

```bash
cp env.example .env
```

**Sur Windows (CMD) :**

```bash
copy env.example .env
```

### Éditer le fichier .env

1. **Ouvrez le fichier `.env`** avec un éditeur de texte :

   - Sur macOS : double-cliquez sur `.env` (ou utilisez TextEdit)
   - Sur Windows : ouvrez avec Notepad
   - Ou utilisez un éditeur comme VSCode, Sublime Text, etc.

2. **Remplacez les valeurs** par vos vraies informations :

```env
# L'adresse web du fichier à envoyer
URL_FICHIER=https://votre-site.com/fichier.pdf

# Les informations de connexion FTP (demandez-les à votre fournisseur)
FTP_HOST=ftp.fournisseur.com
FTP_USER=votre_nom_utilisateur
FTP_PASSWORD=votre_mot_de_passe

# L'heure d'exécution automatique (format 24h)
CRON_HOUR=09        # Heure (de 00 à 23)
CRON_MINUTE=00      # Minutes (de 00 à 59)
```

3. **Sauvegardez le fichier**

**⚠️ Important :**

- Ne partagez jamais ce fichier `.env` avec personne (il contient vos mots de passe)
- Les lignes commençant par `#` sont des commentaires, vous pouvez les garder ou les supprimer

---

## 🔧 Utilisation

### Étape 1 : Tester manuellement (recommandé avant d'automatiser)

Cette commande envoie le fichier **une seule fois** immédiatement pour vérifier que tout fonctionne :

```bash
node send_to_suppliers.js
```

Ou avec npm :

```bash
npm start
```

Si tout fonctionne bien, vous verrez des messages indiquant le succès du transfert. ✅

### Étape 2 : Configurer l'exécution automatique avec cron

**Cron** est un système intégré à macOS et Linux qui exécute des tâches automatiquement selon un planning.

#### Sur macOS/Linux :

**Méthode automatique (recommandée) :**

```bash
# Rendre le script exécutable (une seule fois)
chmod +x setup_cron.sh

# Lancer la configuration
./setup_cron.sh
```

Ou avec npm :

```bash
npm run setup-cron
```

Le script va :

- Lire votre fichier `.env`
- Configurer cron pour exécuter le transfert du lundi au vendredi à l'heure définie
- Afficher un résumé de la configuration

**Méthode manuelle :**

Si vous préférez configurer cron vous-même :

```bash
# Ouvrir l'éditeur cron
crontab -e
```

Ajoutez cette ligne (remplacez le chemin par le vôtre) :

```
0 9 * * 1-5 cd /Users/votre_nom/Documents/Travail/FTP_Frs_GLOBAL && /usr/local/bin/node send_to_suppliers.js >> cron.log 2>&1
```

💡 **Astuce** : Pour trouver le chemin de node, tapez `which node`

Explications :

- `0 9` = à 09h00 (modifiez selon vos besoins)
- `* * 1-5` = tous les jours de la semaine (1=lundi, 5=vendredi)
- `>>` = ajouter les logs au fichier cron.log

Sauvegardez et quittez (sur nano: `Ctrl+X`, puis `Y`, puis Entrée)

#### Sur Windows :

Windows n'a pas cron, mais vous pouvez utiliser le **Planificateur de tâches** :

1. Appuyez sur `Windows` et tapez "Planificateur de tâches"
2. Cliquez sur "Créer une tâche de base"
3. Nom : "Envoi FTP Fournisseurs"
4. Déclencheur : "Quotidien"
5. Récurrence : Cochez Lun, Mar, Mer, Jeu, Ven
6. Action : "Démarrer un programme"
7. Programme : `node` (ou chemin complet : `C:\Program Files\nodejs\node.exe`)
8. Arguments : `send_to_suppliers.js`
9. Dossier : Le chemin vers votre dossier FTP_Frs_GLOBAL
10. Terminez l'assistant

---

## 📊 Logs

Les logs sont enregistrés dans :

- `ftp_transfer.log` - Logs détaillés des transferts FTP
- `cron.log` - Logs des exécutions automatiques via cron

---

## 🔍 Vérifier que cron fonctionne

Pour voir vos tâches cron configurées :

```bash
crontab -l
```

Pour voir les logs en temps réel :

```bash
tail -f cron.log
```

Ou pour les logs du script :

```bash
tail -f ftp_transfer.log
```

---

## 🛠️ Dépannage

### ❌ Erreur : "node n'est pas reconnu..."

**Solution :** Node.js n'est pas installé ou pas dans le PATH.

- Réinstallez Node.js en suivant les instructions ci-dessus
- Sur Windows, assurez-vous d'accepter l'option "Add to PATH" lors de l'installation

### ❌ Erreur : "npm n'est pas reconnu..."

**Solution :** npm est normalement installé avec Node.js.

- Fermez et rouvrez votre Terminal
- Si le problème persiste, réinstallez Node.js

### ❌ Erreur lors de npm install

**Solution :**

```bash
# Supprimer node_modules et réessayer
rm -rf node_modules
npm install
```

### ❌ La tâche cron ne s'exécute pas

1. **Vérifiez que cron est bien configuré** :

   ```bash
   crontab -l
   ```

   Vous devriez voir une ligne contenant `send_to_suppliers.js`

2. **Vérifiez les logs cron** :

   ```bash
   cat cron.log
   ```

   Si le fichier est vide, cron n'a pas encore exécuté la tâche ou il y a un problème

3. **Testez manuellement** :

   ```bash
   node send_to_suppliers.js
   ```

   Si ça fonctionne manuellement mais pas via cron, le problème vient de la configuration cron

4. **Vérifiez les chemins dans crontab** :
   - Le chemin vers le dossier doit être absolu (complet)
   - Le chemin vers node doit être correct (utilisez `which node` pour le trouver)

### ❌ Le transfert ne se fait pas

1. **Vérifiez les logs** pour voir les erreurs :

   - Ouvrez le fichier `ftp_transfer.log` avec un éditeur de texte
   - Ou dans le Terminal : `tail -f ftp_transfer.log`

2. **Vérifiez votre fichier .env** :

   - Les informations FTP sont-elles correctes ?
   - L'URL du fichier est-elle valide ?
   - L'heure est-elle au bon format (nombres uniquement) ?

3. **Testez manuellement** :
   ```bash
   node send_to_suppliers.js
   ```
   Regardez les messages d'erreur qui s'affichent

### ❌ Erreur de connexion FTP

**Causes possibles :**

- Mauvais nom d'utilisateur ou mot de passe → Vérifiez votre fichier `.env`
- Mauvaise adresse serveur → Contactez votre fournisseur
- Pare-feu qui bloque → Vérifiez vos paramètres réseau
- Votre IP n'est pas autorisée → Contactez votre fournisseur

### ❌ Erreur de téléchargement du fichier

**Causes possibles :**

- L'URL est incorrecte → Vérifiez l'adresse dans `.env`
- Le fichier n'existe plus → Vérifiez que le fichier est toujours en ligne
- Connexion internet coupée → Vérifiez votre connexion
- Le fichier nécessite une authentification → Modifiez l'URL ou le script

### 📞 Besoin d'aide ?

Si vous êtes bloqué :

1. Regardez les fichiers de logs (`.log`) qui contiennent les messages d'erreur
2. Notez le message d'erreur exact
3. Contactez votre administrateur système avec ces informations

---

## 📝 Structure du projet

```
FTP_Frs_GLOBAL/
├── send_to_suppliers.js    # Script principal Node.js
├── setup_cron.sh           # Script de configuration automatique de cron
├── package.json            # Dépendances Node.js
├── package-lock.json       # Verrouillage des versions (généré automatiquement)
├── node_modules/           # Bibliothèques installées (généré par npm install)
├── .env                    # Configuration (à créer)
├── env.example             # Exemple de configuration
├── README.md               # Documentation
├── .gitignore              # Fichiers à ignorer dans Git
├── ftp_transfer.log        # Logs des transferts FTP
├── cron.log                # Logs des exécutions cron
└── temp_downloads/         # Dossier temporaire (créé automatiquement)
```

---

## ⚡ Fonction principale

La fonction `sendFileToSupplier()` accepte 4 arguments:

1. `urlFichier` - URL du fichier à télécharger
2. `ftpHost` - Adresse du serveur FTP
3. `ftpUser` - Nom d'utilisateur FTP
4. `ftpPassword` - Mot de passe FTP

---

## 🔒 Sécurité

- Ne commitez **jamais** le fichier `.env` dans Git
- Ne commitez **jamais** le dossier `node_modules/` dans Git
- Changez régulièrement les mots de passe FTP
- Utilisez SFTP si possible pour plus de sécurité

---

## 💡 Technologies utilisées

- **Node.js** : Runtime JavaScript rapide et efficace
- **dotenv** : Gestion sécurisée des variables d'environnement
- **axios** : Client HTTP pour télécharger les fichiers
- **basic-ftp** : Client FTP simple et fiable
- **Cron** : Planification automatique des tâches
