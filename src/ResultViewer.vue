<template>
  <div v-if="visible" class="result-viewer-overlay" @click.self="close">
    <div class="result-viewer-content">
      <button class="close-btn" @click="close">&times;</button>
      <EncryptedImage ref="encryptedImage" :src="imgSrc" alt="Image inspectée" class="result-image"/>
      <div class="button-container">
        <button v-if="showRetrieveButton" class="retrieve-btn" @click="retrieve">Récupérer</button>
        <button v-if="showDownloadButton" class="download-btn" @click="downloadImage">Télécharger</button>
      </div>
    </div>
  </div>
</template>

<script>
import EncryptedImage from './EncryptedImage.vue';

export default {
  name: 'ResultViewer',
  components: { EncryptedImage },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    imgSrc: {
      type: String,
      default: null,
    },
    showRetrieveButton: {
      type: Boolean,
      default: false,
    },
    showDownloadButton: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['update:visible', 'retrieve', 'download'],
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    retrieve() {
      this.$emit('retrieve');
      this.close();
    },
    downloadImage() {
      // On accède à l'URL déchiffrée (blob URL) depuis le composant EncryptedImage
      const imageUrl = this.$refs.encryptedImage.decryptedSrc;
      if (!imageUrl) return;

      // On extrait un nom de fichier depuis le chemin original
      const filename = this.imgSrc.split('/').pop().replace('.enc', '');

      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename || 'image.png'; // Nom du fichier téléchargé
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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

.result-viewer-content {
  position: relative;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.result-image {
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 15px; /* Espace entre les boutons */
}

.close-btn, .retrieve-btn, .download-btn {
  /* Styles pour les boutons */
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 15px;
  border-radius: 5px;  
}
.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #333;
}
.retrieve-btn {
  background-color: #4CAF50;
  color: rgb(105, 105, 105);
  border: none;
}
.download-btn {
  background-color: #008CBA; /* Couleur bleue pour le téléchargement */
  color: white;
  border: none;
}
</style>