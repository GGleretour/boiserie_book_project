<template>
  <div
    id="kitchen-receptacle-zone"
    class="drop-zone kitchen-receptacle"
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
const props = defineProps(['kitchenDisplayCube'])
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
/* DROP ZONE STYLES */
.drop-zone {
  position: absolute;
  border-radius: 10px;
  box-sizing: border-box;
  /* Centrage de l'élément sur ses coordonnées top/left */
  transform: translate(-50%, -50%);
}
/* ----------------- */

/* Kitchen Zone Receptacle STYLES */
.kitchen-receptacle {
  width: 100px;
  height: 100px;
  top: 80%; /* Pointe bas-gauche */
  left: 22%;
  color: white;
  text-align: center;
  padding: 6px;
  font-size: 0.7em;
  cursor: pointer;
}
/* ----------------- */

</style>