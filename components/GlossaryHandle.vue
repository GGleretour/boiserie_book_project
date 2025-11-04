<template>
  <div class="glossary-handle" @click="isOpen = !isOpen"></div>
</template>

<script setup>
  const isOpen = defineModel('isOpen');
</script>

<style scoped>
/* GLOSSARY HANDLE STYLES */
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
/* ----------------- */
</style>