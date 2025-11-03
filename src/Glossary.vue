<template>
  <div class="glossary-container" :class="{ 'is-open': isOpen }">
    <div class="glossary-handle" @click="toggleGlossary">
    </div>
    <div class="glossary-content">
      <EncryptedImage src="assets/sprite/planche_a_glossaire.png" alt="Planche du glossaire" class="glossary-background" />
      <div class="cubes-grid">
        <GlossaryCubeSlot :cubes="cubes" @spawn-from-glossary="emit('spawn-from-glossary', $event)"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import EncryptedImage from './EncryptedImage.vue';
import GlossaryCubeSlot from '../components/GlossaryCubeSlot.vue';

/* --- Props --- */
defineProps(['cubes']);
const emit =defineEmits(['spawn-from-glossary']);

//   State

const isOpen = ref(false);

//   Methods
function toggleGlossary() {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.glossary-container {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translate(-90%, -50%);
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* Effet rebondissant */
  z-index: 400;
  display: flex;
  align-items: center;
}

.glossary-container.is-open {
  transform: translate(0, -50%);
}

.glossary-handle {
  position: absolute;
  right: 0px; /* Ajustez pour positionner la poignée correctement */
  top: 50%;
  transform: translateY(-50%);
  width: 200px; /* Ajustez la taille */
  height: 150px; /* Ajustez la taille */
  cursor: pointer;
  z-index: 1;
}

.glossary-handle img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.glossary-content {
  position: relative;
  width: 700px; /* Largeur de la planche */
  height: 466px; /* Hauteur de la planche */
}

.glossary-background {
  width: 100%;
  height: 100%;
}

.cubes-grid {
  position: absolute;
  top: 49%;
  left: 40%;
  transform: translate(-50%, -50%);
  width: 60%; /* Ajustez pour correspondre à la zone de grille sur votre image */
  height: 63%; /* Ajustez pour correspondre à la zone de grille sur votre image */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 2fr)); /* Crée des colonnes flexibles */
  gap: 0px;
  padding: 5px;
  overflow-y: auto;
}
</style>