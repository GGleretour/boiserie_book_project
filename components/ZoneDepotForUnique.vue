<template>
  <div
    @dragover.prevent
    @drop="$emit('drop-on-zone', 'kitchenReceptacle')"
    :style="zoneStyle"
    @click="releaseCube"
    >
    <p>{{ zoneName }}</p>
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
const givenCube = defineModel('givenCube');
const zoneIdlImg = defineModel('zoneIdlImg');
const zoneName = defineModel('zoneName');
/* ----------------- */

/* Computed */
const zoneStyle = computed(() => { return getZoneStyle(givenCube.value, zoneName.value, zoneIdlImg.value); });
/* ----------------- */

/* Methods */
watch(givenCube, (newCube) => { updateDecryptedImage(newCube, zoneName.value, zoneIdlImg.value); }, { deep: true, immediate: true });
function releaseCube() {
  if (givenCube.value) {
    emit('release-discovered-cube', givenCube.value.id, givenCube.value.originalCubeId);
  }
};
/* ----------------- */
</script>

<style scoped>
</style>