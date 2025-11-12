<template>
  <div class="star-layout-container">
    <!-- Zone 1 : Le "sac" de la cuisine -->
    <KitchenZoneBag
    :is-visible="isVisible"
    :kitchen-bag-cubes="kitchenBagCubes"
    @release-discovered-cube="$emit('release-discovered-cube', $event)"
    />
    <!-- Zone 2 : La zone d'affichage/remplacement -->
    <KitchenZoneResult
      :kitchen-display-cube="kitchenDisplayCube"
      @drop-on-zone="$emit('drop-on-zone', $event)"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
    />
    <!-- Zone 3 : La zone réceptacle (avec gestion du drop) -->
    <KitchenZoneReceptacle
      :kitchen-receptacle-cube="kitchenReceptacleCube"
      @drop-on-zone="$emit('drop-on-zone', $event)"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
    />
    <!-- Zone 4 : La zone outil (avec gestion du drop) -->
    <KitchenZoneOutil
      :kitchen-outil-cube="kitchenOutilCube"
      @drop-on-zone="$emit('drop-on-zone', $event)"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
    />
    <!-- Zone 5 : La zone rune (avec gestion du drop) -->
     <KitchenZoneRune
      :kitchen-rune-cube="kitchenRuneCube"
      @drop-on-zone="$emit('drop-on-zone', $event)"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
    />
    <!-- Zone 6 : La zone carburant (avec gestion du drop) -->
     <KitchenZoneCarburant
      :kitchen-carburant-cube="kitchenCarburantCube"
      @drop-on-zone="$emit('drop-on-zone', $event)"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
    />
  </div>
</template>

<script setup>
/* Imports */
import KitchenZoneBag from '../components/KitchenZoneBag.vue';
import KitchenZoneResult from '../components/KitchenZoneResult.vue';
import KitchenZoneReceptacle from '../components/KitchenZoneReceptacle.vue';
import KitchenZoneRune from '../components/KitchenZoneRune.vue';
import KitchenZoneOutil from '../components/KitchenZoneOutil.vue';
import KitchenZoneCarburant from '../components/KitchenZoneCarburant.vue';
/* ----------------- */

/* Events */
const emit = defineEmits(['drop-on-zone', 'release-discovered-cube', 'close-book', 'open-result-viewer']);
const props = defineProps(['kitchenBagCubes', 'kitchenDisplayCube', 'kitchenReceptacleCube', 'kitchenOutilCube', 'kitchenRuneCube', 'kitchenCarburantCube', 'isVisible']);
/* ----------------- */

</script>

<style scoped>
/* STAR LAYOUT STYLES */
.star-layout-container {
  position: absolute;
  width: 450px; /* Taille du conteneur de la disposition */
  height: 450px; /* Forcé en carré */
  /* Les lignes suivantes centrent ce conteneur carré sur la page */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/* ----------------- */

</style>