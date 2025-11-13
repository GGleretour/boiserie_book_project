<template>
  <div
    id="kitchen-receptacle-zone"
    @dragover.prevent
    @drop="$emit('drop-on-zone', 'kitchenReceptacle')"
    :style="receptacleZoneStyle"
    @click="releaseReceptacleCube"
    >
    <p>Receptacle</p>
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
const kitchenReceptacleCube = defineModel('kitchenReceptacleCube');
/* ----------------- */

/* Computed */
const receptacleZoneStyle = computed(() => { return getZoneStyle(kitchenReceptacleCube.value, 'receptacle', 'assets/block/block_Re_vide.png'); });
/* ----------------- */

/* Methods */
watch(kitchenReceptacleCube, (newCube) => { updateDecryptedImage(newCube, 'receptacle', 'assets/block/block_Re_vide.png'); }, { deep: true, immediate: true });
function releaseReceptacleCube() {
  if (kitchenReceptacleCube.value) {
    emit('release-discovered-cube', kitchenReceptacleCube.value.id, kitchenReceptacleCube.value.originalCubeId);
  }
};
/* ----------------- */
</script>

<style scoped>
</style>