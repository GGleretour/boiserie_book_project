<template>
  <EncryptedImage
    v-if="cube.find===true"
    :src="cube.img_src"
    :alt="cube.id"
    class="cube-image"
    :class="{ 'not-discovered': !cube.find }"
    draggable="false"
  />
  <EncryptedImage
    v-else-if="cube.type==='result'"
    src="assets/block/block_V_pageVoid.png"
    :alt="cube.id"
    class="cube-image"
    :class="{ 'not-discovered': !cube.find }"
    draggable="false"
  />
  <EncryptedImage
    v-else
    src="assets/block/block_V_cubeVoid.png"
    :alt="cube.id"
    class="cube-image"
    :class="{ 'not-discovered': !cube.find }"
    draggable="false"
  />
</template>

<script setup>
import EncryptedImage from '../src/EncryptedImage.vue';
defineProps(['cube']);
</script>

<style scoped>
/* CUBE IMAGE STYLES */
.cube-image {
  max-width: 100%;
  max-height: 100%;
  transition: filter 0.3s ease;
}

.cube-image.not-discovered {
  filter: grayscale(1) brightness(0.1);
  cursor: not-allowed;
}
/* ----------------- */
</style>