<template>
  <img :src="decryptedSrc" v-bind="$attrs" />
</template>
<script>
import { getDecryptedImage } from './image-service.js';

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
        this.decryptedSrc = await getDecryptedImage(newSrc);
      },
    },
  },
};
</script>