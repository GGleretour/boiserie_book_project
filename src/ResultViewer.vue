<template>
  <div v-if="visible" class="result-viewer-overlay" @click.self="close">
    <div class="viewer-content">
      <EncryptedImage :src="imgSrc" alt="Résultat agrandi" class="result-image" />
      <div class="button-container">
        <button @click="retrieve" class="action-button retrieve-button">Récupérer</button>
        <button @click="downloadImage" class="action-button download-button">Télécharger</button>
        <button @click="close" class="action-button close-button">Retour</button>
      </div>
    </div>
  </div>
</template>

<script>
import EncryptedImage from './EncryptedImage.vue';
import { getDecryptedImage } from './image-service.js';

export default {
  name: 'ResultViewer',
  components: { EncryptedImage },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    imgSrc: {
      type: String,
      default: null,
    },
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    retrieve() {
      this.$emit('retrieve');
      this.close();
    },
    async downloadImage() {
      if (!this.imgSrc) return;
      // Nous utilisons getDecryptedImage pour obtenir l'URL de l'objet Blob
      const objectUrl = await getDecryptedImage(this.imgSrc);
      const link = document.createElement('a');
      link.href = objectUrl;
      // Extrait le nom du fichier de l'URL originale
      const filename = this.imgSrc.split('/').pop().replace('.enc', '');
      link.download = filename || 'resultat.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Il n'est pas nécessaire de révoquer l'URL de l'objet ici car elle est gérée par le cache d'image.
    },
  },
};
</script>

<style scoped>
.result-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.viewer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.result-image {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
}
.button-container { display: flex; gap: 15px; }
.action-button { padding: 12px 25px; font-size: 16px; cursor: pointer; border: none; border-radius: 5px; color: white; }
.retrieve-button { background-color: #3498db; }
.download-button { background-color: #4CAF50; }
.close-button { background-color: #e02929; }
</style>