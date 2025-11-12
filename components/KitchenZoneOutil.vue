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
/* DROP ZONE STYLES */
.drop-zone {
  position: absolute;
  border-radius: 10px;
  box-sizing: border-box;
  /* Centrage de l'élément sur ses coordonnées top/left */
  transform: translate(-50%, -50%);
}
/* ----------------- */

/* Kitchen Zone Outil STYLES */
.kitchen-outil {
  width: 100px;
  height: 100px;
  top: 35%; /* Pointe haut-droite */
  left: 90%;
  color: white;
  text-align: center;
  padding: 6px;
  font-size: 0.7em;
  cursor: pointer;
}
/* ----------------- */

</style>