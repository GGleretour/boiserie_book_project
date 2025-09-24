import fs from 'fs';
import path from 'path';
import CryptoJS from 'crypto-js';
import 'dotenv/config';
import { fileURLToPath } from 'url';

const SECRET_KEY = process.env.VITE_CRYPTO_SECRET_KEY;

if (!SECRET_KEY) {
  console.error("La clé secrète VITE_CRYPTO_SECRET_KEY n'est pas définie dans le fichier .env");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFilePath = path.join(__dirname, '..', 'src', 'cubes.js');
const encryptedDir = path.join(__dirname, '..', 'public', 'assets-encrypted');
const encryptedFilePath = path.join(encryptedDir, 'cubes.enc');

const action = process.argv[2]; // 'encrypt' or 'decrypt'

if (action === 'encrypt') {
  encryptFile();
} else if (action === 'decrypt') {
  decryptFile();
} else {
  console.error("Action non valide. Utilisez 'encrypt' ou 'decrypt'.");
  console.error("Exemple: npm run cubes:encrypt");
  process.exit(1);
}

function encryptFile() {
  if (!fs.existsSync(sourceFilePath)) {
    console.error(`Le fichier source ${sourceFilePath} n'existe pas.`);
    return;
  }

  // Crée le dossier pour les fichiers chiffrés s'il n'existe pas
  if (!fs.existsSync(encryptedDir)) {
    fs.mkdirSync(encryptedDir, { recursive: true });
  }

  const fileContent = fs.readFileSync(sourceFilePath, 'utf8');
  const encrypted = CryptoJS.AES.encrypt(fileContent, SECRET_KEY).toString();
  fs.writeFileSync(encryptedFilePath, encrypted);
  console.log(`Fichier ${sourceFilePath} chiffré avec succès vers ${encryptedFilePath}`);
}

function decryptFile() {
  if (!fs.existsSync(encryptedFilePath)) {
    console.error(`Le fichier chiffré ${encryptedFilePath} n'existe pas.`);
    return;
  }

  const encryptedContent = fs.readFileSync(encryptedFilePath, 'utf8');
  const bytes = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY);
  const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);
  fs.writeFileSync(sourceFilePath, decryptedContent);
  console.log(`Fichier ${encryptedFilePath} déchiffré avec succès vers ${sourceFilePath}`);
}
