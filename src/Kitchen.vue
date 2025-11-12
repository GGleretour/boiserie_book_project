<template>
  <!-- Note: v-show est utilisé pour que les refs soient disponibles même quand le composant est caché -->
  <div id="kitchen_container">
    <!-- Bouton de fermeture -->
     <CloseButton @close="$emit('close-book')"/>
    <!--<div class="config-container">
      <button class="close-button" @click="close">Close</button>
    </div>-->
    <div class="content-wrapper">
      <EncryptedImage
        id="kitchen_page"
        src="assets/page/page_vide_from_book.png"
        alt="kitchen page"
        width="600"
        height="auto"
      />

      <!-- Conteneur carré pour la disposition en étoile -->
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

    </div>
  </div>
</template>

<script setup>
/* Import */
import EncryptedImage from './EncryptedImage.vue';
import KitchenZoneBag from '../components/KitchenZoneBag.vue';
import KitchenZoneResult from '../components/KitchenZoneResult.vue';
import KitchenZoneReceptacle from '../components/KitchenZoneReceptacle.vue';
import KitchenZoneRune from '../components/KitchenZoneRune.vue';
import KitchenZoneOutil from '../components/KitchenZoneOutil.vue';
import KitchenZoneCarburant from '../components/KitchenZoneCarburant.vue';
import CloseButton from '../components/CloseButton.vue';
/* ----------------- */

const kitchenBagCubes = defineModel('kitchenBagCubes');
const kitchenDisplayCube = defineModel('kitchenDisplayCube');
const kitchenReceptacleCube = defineModel('kitchenReceptacleCube');
const kitchenOutilCube = defineModel('kitchenOutilCube');
const kitchenRuneCube = defineModel('kitchenRuneCube');
const kitchenCarburantCube = defineModel('kitchenCarburantCube');
const isVisible = defineModel('isVisible');

const emit = defineEmits(['drop-on-zone', 'release-discovered-cube', 'close-book', 'open-result-viewer']);

function close() {
  emit('close-book');
};
</script>

<style scoped>
/* KITCHEN STYLES */
#kitchen_container {
  z-index: 1;
  display: flex;
  padding-right: 0;
  flex-direction: column;
  align-items: left;
  padding: 20px;
}

.content-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.star-layout-container {
  position: absolute;
  width: 450px; /* Taille du conteneur de la disposition */
  height: 450px; /* Forcé en carré */
  /* Les lignes suivantes centrent ce conteneur carré sur la page */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.drop-zone {
  position: absolute;
  border-radius: 10px;
  box-sizing: border-box;
  /* Centrage de l'élément sur ses coordonnées top/left */
  transform: translate(-50%, -50%);
}
/* ----------------- */
/* KITCHEN ZONE STYLES */

.config-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}

.close-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #e02929;
  color: white;
  border: none;
  border-radius: 5px;
}
</style>