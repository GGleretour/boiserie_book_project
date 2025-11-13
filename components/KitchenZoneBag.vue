<template>
  <div id="kitchen-bag-zone" class="drop-zone kitchen-bag" :style="bagZoneStyle">
    <p>ingredients</p>
    <!-- Affiche les cubes stockés dans cette zone -->
    <!-- Ajout d'une ref pour accéder aux instances des cubes -->
    <DiscoveredCube
    v-for="cube in kitchenBagCubes"
    :key="`kitchen-bag-${cube.id}`"
    :is-in-inventory="true"
    :cube-id="cube.id"
    :original-cube-id="cube.originalCubeId"
    :img-src="cube.img_src"
    ref="kitchenBagCubeRefs"
    :inventory-offset-left="97"
    :inventory-offset-right="97"
    :inventory-offset-top="97"
    :inventory-offset-bottom="97"
    @mousedown.stop="$emit('release-discovered-cube', cube.id)"
    />
  </div>
</template>

<script setup>
/* Imports */
import DiscoveredCube from '../src/DiscoveredCube.vue';
import { getZoneStyle, updateDecryptedImage, decryptedZoneImages} from '../src/command-liste.js';
import {watch, nextTick, ref, computed } from 'vue';
/* ----------------- */

/* Events */
const emit = defineEmits(['release-discovered-cube']);
const props = defineProps(['kitchenBagCubes'])
/* ----------------- */

/* define */
const kitchenBagCubeRefs = ref([]);
const kitchenBagCubes = defineModel('kitchenBagCubes');
const isVisible = defineModel('isVisible');
/* ----------------- */

/* Computed */
const bagZoneStyle = computed(() => { return getZoneStyle(null, 'bag', 'assets/block/block_I_vide.png');});
/* ----------------- */

/* Methods */
watch(isVisible, async (newValue) => {
  if (newValue && !decryptedZoneImages.bag) {
    // Charge l'image de fond du sac d'ingrédients la première fois que la cuisine est visible
    updateDecryptedImage(null, 'bag', 'assets/block/block_I_vide.png');
    // Lorsque la cuisine devient visible, on force le repositionnement des cubes.
    nextTick(() => {
      kitchenBagCubeRefs.value?.forEach(cube => cube.recenterInParent());
    });
  }
});
/* ----------------- */
</script>

<style scoped>
</style>