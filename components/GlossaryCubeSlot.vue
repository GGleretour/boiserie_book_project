<template>
  <div
    v-for="cube in cubes"
    :key="cube.id"
    class="cube-slot"
    @click="handleCubeClick(cube)"
  >
    <GlossaryCubeImg :cube="cube"/>
  </div>
</template>

<script setup>
import GlossaryCubeImg from './GlossaryCubeImg.vue';

defineProps(['cubes']);

const emit = defineEmits(['spawn-from-glossary']);

function handleCubeClick(cube) {
  // On n'émet l'événement que pour les cubes déjà découverts.
  if (cube.find) {
    emit('spawn-from-glossary', cube);
  }
}
</script>

<style scoped>
/* CUBE SLOT STYLES */
.cube-slot {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
/* ----------------- */
</style>