<template>
  <div
      id="kitchen-carburant-zone"
      class="drop-zone kitchen-carburant"
      @dragover.prevent
      @drop="$emit('drop-on-zone', 'kitchenCarburant')"
      :style="carburantZoneStyle"
      @click="releaseCarburantCube"
    >
    <p>Carburant</p>
  </div>
</template>

<script setup>
/* Imports */
import { getZoneStyle, updateDecryptedImage} from '../src/command-liste.js';
import { watch, computed } from 'vue';
/* ----------------- */

/* Events */
const emit = defineEmits(['drop-on-zone', 'release-discovered-cube']);
const props = defineProps(['kitchenCarburantCube'])
/* ----------------- */

/* define */
const kitchenCarburantCube = defineModel('kitchenCarburantCube');
/* ----------------- */

/* Computed */
const carburantZoneStyle = computed(() => { return getZoneStyle(kitchenCarburantCube.value, 'carburant', 'assets/block/block_C_vide.png'); });
/* ----------------- */

/* Methods */
watch(kitchenCarburantCube, (newCube) => { updateDecryptedImage(newCube, 'carburant', 'assets/block/block_C_vide.png'); }, { deep: true, immediate: true });
function releaseCarburantCube() {
  if (kitchenCarburantCube.value) {
    emit('release-discovered-cube', kitchenCarburantCube.value.id, kitchenCarburantCube.value.originalCubeId);
  }
};
/* ----------------- */
</script>

<style scoped>
</style>