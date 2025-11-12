<template>
  <div
      id="kitchen-display-zone"
      class="drop-zone kitchen-display"
      @dragover.prevent
      @drop="$emit('drop-on-zone', 'kitchenDisplay')"
      :style="displayZoneStyle"
      @click="releaseDisplayCube"
    >
    <p>Brumage</p>
  </div>
</template>

<script setup>
/* Imports */
import { getZoneStyle, updateDecryptedImage, decryptedZoneImages} from '../src/command-liste.js';
import { watch, computed } from 'vue';
/* ----------------- */

/* Events */
const emit = defineEmits(['drop-on-zone', 'release-discovered-cube']);
const props = defineProps(['kitchenDisplayCube'])
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
  // Si un cube est présent dans la zone de résultat, un clic le libère.
  if (kitchenDisplayCube.value) {
    emit('release-discovered-cube', kitchenDisplayCube.value.id, kitchenDisplayCube.value.originalCubeId);
  }
};
/* ----------------- */



</script>

<style scoped>
/* DROP ZONE STYLES */
.drop-zone {
  position: absolute;
  border-radius: 10px;
  box-sizing: border-box;
  /* Centrage de l'élément sur ses coordonnées top/left */
  transform: translate(-50%, -50%);
}
/* ----------------- */

/* Kitchen Zone Display STYLES */
.kitchen-display {
  width: 100px; /* Plus petit et au centre */
  height: 100px;
  top: 50%;
  left: 50%;
  color: white;
  text-align: center;
  padding: 6px;
  font-size: 0.7em;
  cursor: pointer;
}
/* ----------------- */

</style>