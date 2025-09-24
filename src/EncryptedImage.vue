<template>
  <img :src="decryptedSrc" v-bind="$attrs" />
</template>

<script>
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

export default {
  name: 'EncryptedImage',
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      decryptedSrc: '', // Source de l'image déchiffrée (URL de données)
    };
  },
  watch: {
    src: {
      immediate: true, // Déchiffre l'image dès que le composant est monté
      async handler(newSrc) {
        if (!newSrc) {
          this.decryptedSrc = '';
          return;
        }

        try {
          const response = await fetch(newSrc);
          const encryptedBase64 = await response.text();
          const bytes = CryptoJS.AES.decrypt(encryptedBase64, SECRET_KEY);
          const decryptedBase64 = bytes.toString(CryptoJS.enc.Utf8);

          // Détermine le type de l'image à partir de l'extension originale
          // Prend le nom du fichier sans le ".enc", puis récupère la dernière extension.
          const filenameWithoutEnc = newSrc.substring(0, newSrc.length - 4);
          const originalExtension = filenameWithoutEnc.split('.').pop();
          this.decryptedSrc = `data:image/${originalExtension};base64,${decryptedBase64}`;
        } catch (error) {
          console.error(`Erreur lors du déchiffrement de l'image ${newSrc}:`, error);
          this.decryptedSrc = ''; // Mettre une image de fallback si nécessaire
        }
      },
    },
  },
};
</script>