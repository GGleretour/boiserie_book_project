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
        src="assets/page.png"
        alt="kitchen page"
        width="600"
        height="auto"
      />

      <!-- Conteneur carré pour la disposition en étoile -->
      <div class="star-layout-container">
        <!-- Zone 1 : Le "sac" de la cuisine -->
        <div id="kitchen-bag-zone" class="drop-zone kitchen-bag">
          <p>Atelier</p>
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
            :inventory-offset-left="85"
            :inventory-offset-right="85"
            :inventory-offset-top="85"
            :inventory-offset-bottom="85"
            @mousedown.stop="$emit('release-discovered-cube', cube.id)"
          />
        </div>

        <!-- Zone 2 : La zone d'affichage/remplacement -->
        <div
          id="kitchen-display-zone"
          class="drop-zone kitchen-display"
          @dragover.prevent
          @drop="$emit('drop-on-zone', 'kitchenDisplay')"
          :style="displayZoneStyle"
          @click="releaseDisplayCube"
        >

        </div>

        <!-- Zone 3 : La zone réceptacle (avec gestion du drop) -->
        <div
          id="kitchen-receptacle-zone"
          class="drop-zone kitchen-receptacle"
          @dragover.prevent
          @drop="$emit('drop-on-zone', 'kitchenReceptacle')"
          :style="receptacleZoneStyle"
          @click="releaseReceptacleCube"
        >

        </div>
        <!-- Zone 4 : La zone outil (avec gestion du drop) -->
        <div
          id="kitchen-outil-zone"
          class="drop-zone kitchen-outil"
          @dragover.prevent
          @drop="$emit('drop-on-zone', 'kitchenOutil')"
          :style="outilZoneStyle"
          @click="releaseOutilCube"
        >

        </div>
        <!-- Zone 5 : La zone rune (avec gestion du drop) -->
        <div
          id="kitchen-rune-zone"
          class="drop-zone kitchen-rune"
          @dragover.prevent
          @drop="$emit('drop-on-zone', 'kitchenRune')"
          :style="runeZoneStyle"
          @click="releaseRuneCube"
        >

        </div>
        <!-- Zone 6 : La zone carburant (avec gestion du drop) -->
        <div
          id="kitchen-carburant-zone"
          class="drop-zone kitchen-carburant"
          @dragover.prevent
          @drop="$emit('drop-on-zone', 'kitchenCarburant')"
          :style="carburantZoneStyle"
          @click="releaseCarburantCube"
        >
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import EncryptedImage from './EncryptedImage.vue';
import DiscoveredCube from './DiscoveredCube.vue';

export default {
  name: 'Kitchen',
  components: { EncryptedImage, DiscoveredCube },
  data() { return {}; },
  props: {
    kitchenBagCubes: {
      type: Array,
      default: () => [],
    },
    kitchenDisplayCube: {
      type: Object,
      default: null,
    },
    kitchenReceptacleCube: {
      type: Object,
      default: null,
    },
    kitchenOutilCube: {
      type: Object,
      default: null,
    },
    kitchenRuneCube: {
      type: Object,
      default: null,
    },
    kitchenCarburantCube: {
      type: Object,
      default: null,
    },
  },
  computed: {
    displayZoneStyle() { return this.getZoneStyle(this.kitchenDisplayCube); },
    receptacleZoneStyle() { return this.getZoneStyle(this.kitchenReceptacleCube); },
    outilZoneStyle() { return this.getZoneStyle(this.kitchenOutilCube); },
    runeZoneStyle() { return this.getZoneStyle(this.kitchenRuneCube); },
    carburantZoneStyle() { return this.getZoneStyle(this.kitchenCarburantCube); },
  },
  
  methods: {
    getZoneStyle(cube) {
      return cube ? { backgroundImage: `url(${cube.img_src})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '2px dashed #fff' };
    },
    close() {
      this.$emit('close-book');
    },
    releaseDisplayCube() {
      if (this.kitchenDisplayCube) {
        this.$emit('release-discovered-cube', this.kitchenDisplayCube.id);
      }
    },
    releaseReceptacleCube() {
      if (this.kitchenReceptacleCube) {
        this.$emit('release-discovered-cube', this.kitchenReceptacleCube.id);
      }
    },
    releaseOutilCube() {
      if (this.kitchenOutilCube) {
        this.$emit('release-discovered-cube', this.kitchenOutilCube.id);
      }
    },
    releaseRuneCube() {
      if (this.kitchenRuneCube) {
        this.$emit('release-discovered-cube', this.kitchenRuneCube.id);
      }
    },
    releaseCarburantCube() {
      if (this.kitchenCarburantCube) {
        this.$emit('release-discovered-cube', this.kitchenCarburantCube.id);
      }
    },
  },
};
</script>

<style scoped>
#kitchen_container {
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

.kitchen-bag {
  width: 100px;
  height: 100px;
  top: 10%; /* Pointe du haut */
  left: 50%; 
  background-color: rgba(0, 0, 0, 0.5);
  border: 2px solid #8B4513;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 0.9em;
}

.kitchen-display {
  width: 80px; /* Plus petit et au centre */
  height: 80px;
  top: 50%;
  left: 50%;
  cursor: pointer;
}

.kitchen-receptacle {
  width: 100px;
  height: 100px;
  top: 90%; /* Pointe bas-gauche */
  left: 22%;
  cursor: pointer;
}

.kitchen-outil {
  width: 100px;
  height: 100px;
  top: 35%; /* Pointe haut-droite */
  left: 90%;
  cursor: pointer;
}

.kitchen-rune {
  width: 100px;
  height: 100px;
  top: 35%; /* Pointe haut-gauche */
  left: 10%;
  cursor: pointer;
}

.kitchen-carburant {
  width: 100px;
  height: 100px;
  top: 90%; /* Pointe bas-droite */
  left: 78%;
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