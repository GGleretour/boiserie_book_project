// scripts/encrypt-image.js
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
const sourceDir = path.join(__dirname, '..', 'public', 'assets');
const encryptedDir = path.join(__dirname, '..', 'public', 'assets-encrypted');

// Crée le dossier de sortie s'il n'existe pas
if (!fs.existsSync(encryptedDir)) {
  fs.mkdirSync(encryptedDir, { recursive: true });
}

// Récupère le chemin du fichier à chiffrer depuis les arguments
const sourceFilePathArg = process.argv[2];

if (!sourceFilePathArg) {
  console.error('Veuillez spécifier le chemin du fichier à chiffrer.');
  console.error('Exemple : node scripts/encrypt-image.js public/assets/mon_image.png');
  process.exit(1);
}

const fullSourcePath = path.resolve(process.cwd(), sourceFilePathArg);

if (!fs.existsSync(fullSourcePath)) {
  console.error(`Le fichier source n'existe pas : ${fullSourcePath}`);
  process.exit(1);
}

const imageBase64 = fs.readFileSync(fullSourcePath, 'base64');
const encrypted = CryptoJS.AES.encrypt(imageBase64, SECRET_KEY).toString();
const outputFilePath = path.join(encryptedDir, path.basename(fullSourcePath) + '.enc');
fs.writeFileSync(outputFilePath, encrypted);

console.log(`Fichier chiffré : ${fullSourcePath} -> ${outputFilePath}`);