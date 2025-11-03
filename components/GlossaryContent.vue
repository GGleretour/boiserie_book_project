<template>
  <div class="glossary-content">
    <EncryptedImage src="assets/sprite/planche_a_glossaire.png" alt="Planche du glossaire" class="glossary-background" />
    <GlossaryCubesGrid :cubes="cubes" @spawn-from-glossary="$emit('spawn-from-glossary', $event)"/>
  </div>
</template>

<script setup>
import GlossaryCubesGrid from './GlossaryCubesGrid.vue';
import EncryptedImage from '../src/EncryptedImage.vue';

defineProps(['cubes']);
</script>

<style scoped>
/* GLOSSARY CONTENT STYLES */
.glossary-content {
  position: relative;
  width: 700px; /* Largeur de la planche */
  height: 466px; /* Hauteur de la planche */
}

.glossary-background {
  width: 100%;
  height: 100%;
}
/* ----------------- */
</style>