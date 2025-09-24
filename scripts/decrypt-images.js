// scripts/decrypt-images.js
import fs from 'fs';
import path from 'path';
import CryptoJS from 'crypto-js';
import 'dotenv/config'; // Charge les variables d'environnement depuis .env
import { fileURLToPath } from 'url';

const SECRET_KEY = process.env.VITE_CRYPTO_SECRET_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!SECRET_KEY) {
  console.error("La clé secrète VITE_CRYPTO_SECRET_KEY n'est pas définie dans le fichier .env");
  process.exit(1);
}

// Dossiers de référence
const encryptedDir = path.join(__dirname, '..', 'public', 'assets-encrypted');
const outputDir = path.join(__dirname, '..', 'public', 'assets');

// Crée le dossier de sortie s'il n'existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Récupère le chemin du fichier chiffré depuis les arguments de la ligne de commande
const encryptedFilePathArg = process.argv[2];

if (!encryptedFilePathArg) {
  console.error('Veuillez spécifier le chemin du fichier chiffré à déchiffrer.');
  console.error('Exemple : node scripts/decrypt-images.js public/assets-encrypted/mon_image.png.enc');
  process.exit(1);
}

const fullEncryptedPath = path.resolve(process.cwd(), encryptedFilePathArg);

if (!fs.existsSync(fullEncryptedPath)) {
  console.error(`Le fichier chiffré n'existe pas : ${fullEncryptedPath}`);
  process.exit(1);
}

try {
  // 1. Lire le contenu chiffré
  const encryptedContent = fs.readFileSync(fullEncryptedPath, 'utf8');

  // 2. Déchiffrer le contenu (qui est une chaîne Base64)
  const bytes = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY);
  const decryptedBase64 = bytes.toString(CryptoJS.enc.Utf8);

  // 3. Déterminer le nom du fichier de sortie et son extension originale
  const originalFilename = path.basename(fullEncryptedPath).replace(/\.enc$/, '');
  const outputFilePath = path.join(outputDir, originalFilename);

  // 4. Écrire le contenu Base64 déchiffré dans un fichier binaire
  fs.writeFileSync(outputFilePath, decryptedBase64, 'base64');

  console.log(`Fichier déchiffré : ${fullEncryptedPath} -> ${outputFilePath}`);
} catch (error) {
  console.error(`Erreur lors du déchiffrement du fichier ${fullEncryptedPath}:`, error);
}