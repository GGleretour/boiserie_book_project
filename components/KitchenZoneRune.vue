<template>
  <div
    id="kitchen-rune-zone"
    class="drop-zone kitchen-rune"
    @dragover.prevent
    @drop="$emit('drop-on-zone', 'kitchenRune')"
    :style="runeZoneStyle"
    @click="releaseRuneCube"
    >
    <p>Rune</p>
  </div>
</template>

<script setup>
/* Imports */
import { getZoneStyle, updateDecryptedImage} from '../src/command-liste.js';
import { watch, computed } from 'vue';
/* ----------------- */

/* Events */
const emit = defineEmits(['drop-on-zone', 'release-discovered-cube']);
const props = defineProps(['kitchenRuneCube'])
/* ----------------- */

/* define */
const kitchenRuneCube = defineModel('kitchenRuneCube');
/* ----------------- */

/* Computed */
const runeZoneStyle = computed(() => { return getZoneStyle(kitchenRuneCube.value, 'rune', 'assets/block/block_ru_vide.png'); });
/* ----------------- */

/* Methods */
watch(kitchenRuneCube, (newCube) => { updateDecryptedImage(newCube, 'rune', 'assets/block/block_ru_vide.png'); }, { deep: true, immediate: true });
function releaseRuneCube() {
  if (kitchenRuneCube.value) {
    emit('release-discovered-cube', kitchenRuneCube.value.id, kitchenRuneCube.value.originalCubeId);
  }
};
/* ----------------- */
</script>

<style scoped>
</style>