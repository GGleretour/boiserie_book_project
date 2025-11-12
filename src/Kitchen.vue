<template>
  <!-- Note: v-show est utilisé pour que les refs soient disponibles même quand le composant est caché -->
  <div id="kitchen_container">
    <!-- Bouton de fermeture -->
    <div class="config-container">
      <button class="close-button" @click="close">Close</button>
    </div>
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
        <div
          id="kitchen-carburant-zone"
          class="drop-zone kitchen-carburant"
          @dragover.prevent
          @drop="$emit('drop-on-zone', 'kitchenCarburant')"
          :style="carburantZoneStyle"
          @click="releaseCarburantCube"
        >
          <p>Carburant</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { updateDecryptedImage, getZoneStyle} from './command-liste.js';
import EncryptedImage from './EncryptedImage.vue';
import { reactive, watch, nextTick, ref, computed } from 'vue';
import KitchenZoneBag from '../components/KitchenZoneBag.vue';
import KitchenZoneResult from '../components/KitchenZoneResult.vue';
import KitchenZoneReceptacle from '../components/KitchenZoneReceptacle.vue';
import KitchenZoneRune from '../components/KitchenZoneRune.vue';
import KitchenZoneOutil from '../components/KitchenZoneOutil.vue';
//import KitchenZoneCarburant from '../components/KitchenZoneCarburant.vue';

const kitchenBagCubes = defineModel('kitchenBagCubes');
const kitchenDisplayCube = defineModel('kitchenDisplayCube');
const kitchenReceptacleCube = defineModel('kitchenReceptacleCube');
const kitchenOutilCube = defineModel('kitchenOutilCube');
const kitchenRuneCube = defineModel('kitchenRuneCube');
const kitchenCarburantCube = defineModel('kitchenCarburantCube');
const isVisible = defineModel('isVisible');

const emit = defineEmits(['drop-on-zone', 'release-discovered-cube', 'close-book', 'open-result-viewer']);

//const receptacleZoneStyle = computed(() => { return getZoneStyle(kitchenReceptacleCube.value, 'receptacle', 'assets/block/block_Re_vide.png'); });
const outilZoneStyle = computed(() => { return getZoneStyle(kitchenOutilCube.value, 'outil', 'assets/block/block_O_vide.png'); });
//const runeZoneStyle = computed(() => { return getZoneStyle(kitchenRuneCube.value, 'rune', 'assets/block/block_ru_vide.png'); });
const carburantZoneStyle = computed(() => { return getZoneStyle(kitchenCarburantCube.value, 'carburant', 'assets/block/block_C_vide.png'); });

//watch(kitchenReceptacleCube, (newCube) => { updateDecryptedImage(newCube, 'receptacle', 'assets/block/block_Re_vide.png'); }, { deep: true, immediate: true });
watch(kitchenOutilCube, (newCube) => { updateDecryptedImage(newCube, 'outil', 'assets/block/block_O_vide.png'); }, { deep: true, immediate: true });
//watch(kitchenRuneCube, (newCube) => { updateDecryptedImage(newCube, 'rune', 'assets/block/block_ru_vide.png'); }, { deep: true, immediate: true });
watch(kitchenCarburantCube, (newCube) => { updateDecryptedImage(newCube, 'carburant', 'assets/block/block_C_vide.png'); }, { deep: true, immediate: true });

function close() {
  emit('close-book');
};
/*function releaseReceptacleCube() {
  if (kitchenReceptacleCube.value) {
    emit('release-discovered-cube', kitchenReceptacleCube.value.id, kitchenReceptacleCube.value.originalCubeId);
  }
};*/
function releaseOutilCube() {
  if (kitchenOutilCube.value) {
    emit('release-discovered-cube', kitchenOutilCube.value.id, kitchenOutilCube.value.originalCubeId);
  }
};

function releaseCarburantCube() {
  if (kitchenCarburantCube.value) {
    emit('release-discovered-cube', kitchenCarburantCube.value.id, kitchenCarburantCube.value.originalCubeId);
  }
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

.kitchen-carburant {
  width: 100px;
  height: 100px;
  top: 80%; /* Pointe bas-droite */
  left: 78%;
  color: white;
  text-align: center;
  padding: 6px;
  font-size: 0.7em;
  cursor: pointer;
}
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