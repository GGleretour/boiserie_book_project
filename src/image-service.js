import CryptoJS from 'crypto-js';

// Cache pour stocker les images déchiffrées (Object URLs) ou les URLs directes
const imageCache = new Map();
const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Récupère une image déchiffrée.
 * La déchiffre si elle n'est pas dans le cache, sinon retourne la version cachée.
 * @param {string} src - L'URL de l'image (chiffrée ou non).
 * @returns {Promise<string>} - Une promesse qui se résout avec l'URL de données (data:image/...).
 */
export async function getDecryptedImage(src) {
  if (!src) {
    return '';
  }

  // 1. Vérifier si l'image est déjà dans le cache
  if (imageCache.has(src)) {
    return imageCache.get(src);
  }

  // 2. Vérifier si l'image est chiffrée (.enc)
  if (src.endsWith('.enc')) {
    try {
      const response = await fetch(src);
      const encryptedBase64 = await response.text();
      const bytes = CryptoJS.AES.decrypt(encryptedBase64, SECRET_KEY);
      const decryptedBase64 = bytes.toString(CryptoJS.enc.Utf8);

      const filenameWithoutEnc = src.substring(0, src.length - 4);
      const originalExtension = filenameWithoutEnc.split('.').pop();
      const mimeType = `image/${originalExtension}`;

      const blob = base64ToBlob(decryptedBase64, mimeType);
      const objectUrl = URL.createObjectURL(blob);

      // 3. Mettre en cache le résultat déchiffré (Object URL)
      imageCache.set(src, objectUrl);
      return objectUrl;

    } catch (error) {
      console.error(`Erreur lors du déchiffrement de l'image ${src}:`, error);
      return ''; // Retourner une image vide ou de fallback en cas d'erreur
    }
  } else {
    // Si l'image n'est pas chiffrée, la retourner directement et la mettre en cache.
    // Le navigateur gérera le chargement de cette URL normale.
    imageCache.set(src, src);
    return src;
  }
}

/**
 * Précharge (déchiffre et met en cache) une liste d'images sans attendre le résultat.
 * @param {string[]} srcs - Un tableau d'URLs d'images (chiffrées ou non).
 */
export function preloadImages(srcs) {
  srcs.forEach(src => {
    if (src && !imageCache.has(src)) {
      getDecryptedImage(src); // On lance le déchiffrement, mais on n'attend pas la fin
    }
  });
}