<template>
  <div v-if="visible" class="result-viewer-overlay" @click.self="close">
    <div class="result-viewer-content">
      <button class="close-btn" @click="close">&times;</button>
      <EncryptedImage :src="imgSrc" alt="Résultat de la recette" class="result-image"/>
      <button v-if="showRetrieveButton" class="retrieve-btn" @click="retrieve">Récupérer</button>
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
    }
  },
  emits: ['update:visible', 'retrieve'],
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    retrieve() {
      this.$emit('retrieve');
      this.close();
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

.close-btn, .retrieve-btn {
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
</style>