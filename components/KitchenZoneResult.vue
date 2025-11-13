<template>
  <div
      id="kitchen-display-zone"
      class="drop-zone kitchen-display"
      @dragover.prevent
      @drop="$emit('drop-on-zone', { cubeId: kitchenDisplayCube.value.id, zone: 'kitchenDisplay' })"
      :style="displayZoneStyle"
      @click="releaseDisplayCube"
    >
    <p>Brumage</p>
  </div>
</template>

<script setup>
/* Imports */
import { getZoneStyle, updateDecryptedImage} from '../src/command-liste.js';
import { watch, computed } from 'vue';
/* ----------------- */

/* Events */
const emit = defineEmits(['drop-on-zone', 'release-discovered-cube']);
/* ----------------- */

/* define */
const kitchenDisplayCube = defineModel('kitchenDisplayCube');
/* ----------------- */

/* Computed */
const displayZoneStyle = computed(() => { return getZoneStyle(kitchenDisplayCube.value, 'display', 'assets/block/block_B_vide.png'); });
/* ----------------- */

/* Methods */
watch(kitchenDisplayCube, (newCube) => { updateDecryptedImage(newCube, 'display', 'assets/block/block_B_vide.png'); }, { deep: true, immediate: true });
function releaseDisplayCube() {
  if (kitchenDisplayCube.value) {
    emit('release-discovered-cube', kitchenDisplayCube.value.id, kitchenDisplayCube.value.originalCubeId);
  }
};
/* ----------------- */
</script>

<style scoped>
</style>