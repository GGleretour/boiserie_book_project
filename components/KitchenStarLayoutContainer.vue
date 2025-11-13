<template>
  <div class="star-layout-container">
    <!-- Zone 1 : Le "sac" de la cuisine -->
    <KitchenZoneBag
      class="zone-bag-posi zone-big-style"
      :is-visible="isVisible"
      :kitchen-bag-cubes="kitchenBagCubes"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
      />
    <!-- Zone 2 : La zone d'affichage/remplacement -->
    <KitchenZoneResult
      class="zone-result-posi zone-moyen-style"
      :kitchen-display-cube="kitchenDisplayCube"
      @drop-on-zone="$emit('drop-on-zone', $event)"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
      />
    <!-- Zone 3 : La zone réceptacle (avec gestion du drop) -->
    <KitchenZoneReceptacle
      class="zone-receptacle-posi zone-moyen-style"
      :kitchen-receptacle-cube="kitchenReceptacleCube"
      @drop-on-zone="$emit('drop-on-zone', $event)"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
      />
    <!-- Zone 4 : La zone outil (avec gestion du drop) -->
    <KitchenZoneOutil
      class="zone-outil-posi zone-moyen-style"
      :kitchen-outil-cube="kitchenOutilCube"
      @drop-on-zone="$emit('drop-on-zone', $event)"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
      />
    <!-- Zone 5 : La zone rune (avec gestion du drop) -->
    <KitchenZoneRune
      class="zone-rune-posi zone-moyen-style"
      :kitchen-rune-cube="kitchenRuneCube"
      @drop-on-zone="$emit('drop-on-zone', $event)"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
      />
    <!-- Zone 6 : La zone carburant (avec gestion du drop) -->
    <KitchenZoneCarburant
      class="zone-carburant-posi zone-moyen-style"
      :kitchen-carburant-cube="kitchenCarburantCube"
      @drop-on-zone="$emit('drop-on-zone', $event)"
      @release-discovered-cube="$emit('release-discovered-cube', $event)"
      />
  </div>
</template>

<script setup>
/* Imports */
import KitchenZoneBag from './KitchenZoneBag.vue';
import KitchenZoneResult from './KitchenZoneResult.vue';
import KitchenZoneReceptacle from './KitchenZoneReceptacle.vue';
import KitchenZoneRune from './KitchenZoneRune.vue';
import KitchenZoneOutil from './KitchenZoneOutil.vue';
import KitchenZoneCarburant from './KitchenZoneCarburant.vue';
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

/* Star Zone posi STYLES */
.zone-bag-posi {
  top: 5%; /* Pointe du haut */
  left: 50%;
}
.zone-result-posi {
  top: 50%; /* Pointe du haut */
  left: 50%;
}
.zone-receptacle-posi {
  top: 80%; /* Pointe bas-gauche */
  left: 22%;
}
.zone-outil-posi {
  top: 35%; /* Pointe haut-droite */
  left: 90%;
}
.zone-rune-posi {
  top: 35%; /* Pointe haut-gauche */
  left: 10%;
}
.zone-carburant-posi {
  top: 80%; /* Pointe bas-droite */
  left: 78%;
}
/* ----------------- */
.zone-moyen-style {
  position: absolute;
  border-radius: 10px;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  color: white;
  text-align: center;
  padding: 6px;
  font-size: 0.7em;
  cursor: pointer;
}

.zone-big-style {
  position: absolute;
  border-radius: 10px;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px; 
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 0.9em;
  cursor: pointer;
}

</style>