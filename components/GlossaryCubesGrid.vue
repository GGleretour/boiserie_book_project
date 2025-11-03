<template>
  <div class="cubes-grid">
    <GlossaryCubeSlot :cubes="cubes" @spawn-from-glossary="$emit('spawn-from-glossary', $event)"/>
  </div>
</template>

<script setup>
import GlossaryCubeSlot from './GlossaryCubeSlot.vue';

defineProps(['cubes']);
</script>

<style scoped>
/* CUBES GRID STYLES */
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
/* ----------------- */
</style>