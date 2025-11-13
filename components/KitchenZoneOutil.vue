<template>
  <div
      id="kitchen-outil-zone"
      class="drop-zone kitchen-outil"
      @dragover.prevent
      @drop="$emit('drop-on-zone', 'kitchenOutil')"
      :style="outilZoneStyle"
      @click="releaseOutilCube"
    >
    <p>Outil</p>
  </div>
</template>

<script setup>
/* Imports */
import { getZoneStyle, updateDecryptedImage} from '../src/command-liste.js';
import { watch, computed } from 'vue';
/* ----------------- */

/* Events */
const emit = defineEmits(['drop-on-zone', 'release-discovered-cube']);
const props = defineProps(['kitchenOutilCube'])
/* ----------------- */

/* define */
const kitchenOutilCube = defineModel('kitchenOutilCube');
/* ----------------- */

/* Computed */
const outilZoneStyle = computed(() => { return getZoneStyle(kitchenOutilCube.value, 'outil', 'assets/block/block_O_vide.png'); });
/* ----------------- */

/* Methods */
watch(kitchenOutilCube, (newCube) => { updateDecryptedImage(newCube, 'outil', 'assets/block/block_O_vide.png'); }, { deep: true, immediate: true });
function releaseOutilCube() {
  if (kitchenOutilCube.value) {
    emit('release-discovered-cube', kitchenOutilCube.value.id, kitchenOutilCube.value.originalCubeId);
  }
};
/* ----------------- */
</script>

<style scoped>
</style>