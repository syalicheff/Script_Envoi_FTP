#!/usr/bin/env node
/**
 * Script générique pour envoyer des fichiers aux fournisseurs via FTP
 */

const fs = require("fs");
const path = require("path");
const ftp = require("basic-ftp");
const dotenv = require("dotenv");

// Charger les variables d'environnement
dotenv.config();

// Dossiers
const UPLOAD_DIR = path.join(__dirname, "A ENVOYER");
const SENT_DIR = path.join(__dirname, "ENVOYES");

/**
 * Configure les logs
 */
const logFile = path.join(__dirname, "ftp_transfer.log");

function log(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${level} - ${message}\n`;

  // Afficher dans la console
  console.log(logMessage.trim());

  // Écrire dans le fichier de log
  fs.appendFileSync(logFile, logMessage);
}

/**
 * Crée les dossiers nécessaires s'ils n'existent pas
 */
function ensureDirectories() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    log("INFO", `Dossier créé: ${UPLOAD_DIR}`);
  }

  if (!fs.existsSync(SENT_DIR)) {
    fs.mkdirSync(SENT_DIR, { recursive: true });
    log("INFO", `Dossier créé: ${SENT_DIR}`);
  }
}

/**
 * Récupère la liste des fichiers à envoyer
 * @returns {Array<string>} - Liste des fichiers
 */
function getFilesToSend() {
  const files = fs.readdirSync(UPLOAD_DIR);

  // Filtrer uniquement les fichiers (pas les dossiers)
  return files.filter((file) => {
    const filePath = path.join(UPLOAD_DIR, file);
    const stat = fs.statSync(filePath);
    return stat.isFile() && file !== "README.txt" && !file.startsWith(".");
  });
}

/**
 * Envoie un fichier au fournisseur via FTP
 *
 * @param {string} filename - Nom du fichier à envoyer
 * @param {string} ftpHost - Adresse du serveur FTP
 * @param {string} ftpUser - Nom d'utilisateur FTP
 * @param {string} ftpPassword - Mot de passe FTP
 * @returns {Promise<boolean>} - True si le transfert a réussi, False sinon
 */
async function sendFileToSupplier(filename, ftpHost, ftpUser, ftpPassword) {
  const client = new ftp.Client();
  const filePath = path.join(UPLOAD_DIR, filename);

  // Configuration du timeout pour FTP
  client.ftp.timeout = 30000; // 30 secondes

  try {
    const fileSize = fs.statSync(filePath).size;
    log("INFO", `Préparation de l'envoi: ${filename} (${fileSize} octets)`);

    // Se connecter au serveur FTP
    log("INFO", `Connexion au serveur FTP: ${ftpHost}`);

    await client.access({
      host: ftpHost,
      user: ftpUser,
      password: ftpPassword,
      secure: false,
    });

    log("INFO", `Connexion FTP réussie pour l'utilisateur: ${ftpUser}`);

    // Envoyer le fichier
    await client.uploadFrom(filePath, filename);

    log("INFO", `✅ Fichier envoyé avec succès: ${filename}`);

    // Déplacer le fichier vers le dossier ENVOYES
    const sentFilePath = path.join(SENT_DIR, filename);

    // Si un fichier avec le même nom existe déjà, le renommer
    let finalSentPath = sentFilePath;
    if (fs.existsSync(sentFilePath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const ext = path.extname(filename);
      const name = path.basename(filename, ext);
      finalSentPath = path.join(SENT_DIR, `${name}_${timestamp}${ext}`);
    }

    fs.renameSync(filePath, finalSentPath);
    log("INFO", `Fichier déplacé vers: ${path.basename(finalSentPath)}`);

    return true;
  } catch (error) {
    if (error.code && error.code.startsWith("E")) {
      log("ERROR", `Erreur FTP: ${error.message}`);
    } else {
      log("ERROR", `Erreur inattendue: ${error.message}`);
    }
    return false;
  } finally {
    // Fermer la connexion FTP
    client.close();
  }
}

/**
 * Fonction principale
 */
async function main() {
  // Créer les dossiers nécessaires
  ensureDirectories();

  // Récupérer les paramètres depuis les variables d'environnement
  const ftpHost = process.env.FTP_HOST;
  const ftpUser = process.env.FTP_USER;
  const ftpPassword = process.env.FTP_PASSWORD;

  // Vérifier que tous les paramètres sont présents
  const missingParams = [];
  if (!ftpHost) missingParams.push("FTP_HOST");
  if (!ftpUser) missingParams.push("FTP_USER");
  if (!ftpPassword) missingParams.push("FTP_PASSWORD");

  if (missingParams.length > 0) {
    log(
      "ERROR",
      `Paramètres manquants dans le fichier .env: ${missingParams.join(", ")}`
    );
    process.exit(1);
  }

  // Récupérer la liste des fichiers à envoyer
  const files = getFilesToSend();

  if (files.length === 0) {
    log("INFO", "=".repeat(50));
    log("INFO", "📭 Aucun fichier à envoyer");
    log("INFO", `Placez vos fichiers dans le dossier: ${UPLOAD_DIR}`);
    log("INFO", "=".repeat(50));
    process.exit(0);
  }

  // Lancer le transfert
  log("INFO", "=".repeat(50));
  log("INFO", `📤 Démarrage du transfert vers le fournisseur`);
  log("INFO", `📁 ${files.length} fichier(s) à envoyer`);
  log("INFO", "=".repeat(50));

  let successCount = 0;
  let failureCount = 0;

  for (const file of files) {
    log("INFO", "");
    log("INFO", `➡️  Traitement du fichier: ${file}`);

    const success = await sendFileToSupplier(
      file,
      ftpHost,
      ftpUser,
      ftpPassword
    );

    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  // Résumé
  log("INFO", "");
  log("INFO", "=".repeat(50));
  log("INFO", "📊 RÉSUMÉ DU TRANSFERT");
  log("INFO", `✅ Fichiers envoyés avec succès: ${successCount}`);
  log("INFO", `❌ Fichiers en échec: ${failureCount}`);
  log("INFO", "=".repeat(50));

  if (failureCount > 0) {
    log(
      "ERROR",
      "Certains transferts ont échoué. Consultez les logs ci-dessus."
    );
    process.exit(1);
  } else {
    log("INFO", "🎉 Tous les transferts ont réussi !");
    process.exit(0);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  main();
}

module.exports = { sendFileToSupplier };
