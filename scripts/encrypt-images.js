// scripts/encrypt-images.js
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

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
const encryptedDir = path.join(__dirname, '..', 'public', 'assets-encrypted');

// Crée le dossier pour les images chiffrées s'il n'existe pas
if (!fs.existsSync(encryptedDir)) {
  fs.mkdirSync(encryptedDir);
}

// Lit tous les fichiers dans le dossier assets
fs.readdir(assetsDir, (err, files) => {
  if (err) {
    return console.error('Impossible de scanner le dossier des assets :', err);
  }

  files.forEach(file => {
    // Ne traite que les fichiers image
    if (/\.(png|jpe?g|gif|svg)$/.test(file)) {
      const filePath = path.join(assetsDir, file);
      const encryptedFilePath = path.join(encryptedDir, `${file}.enc`);

      // 1. Lire l'image en Base64
      const imageBase64 = fs.readFileSync(filePath, 'base64');
      
      // 2. Chiffrer la chaîne Base64
      const encrypted = CryptoJS.AES.encrypt(imageBase64, SECRET_KEY).toString();

      // 3. Sauvegarder le contenu chiffré
      fs.writeFileSync(encryptedFilePath, encrypted);

      console.log(`Image chiffrée : ${file} -> ${path.basename(encryptedFilePath)}`);
    }
  });
});
