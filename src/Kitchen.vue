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

        <!-- Zone 2 : La zone d'affichage/remplacement -->
        <div
          id="kitchen-display-zone"
          class="drop-zone kitchen-display"
          @dragover.prevent
          @drop="$emit('drop-on-zone', 'kitchenDisplay')"
          :style="displayZoneStyle"
          @click="handleDisplayClick"
        >
        <p>Brumage</p>
        
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
          <p>Receptacle</p>

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
          <p>Outils</p>

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
          <p>Rune</p>

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
          <p>Carburant</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getDecryptedImage } from './image-service.js';
import EncryptedImage from './EncryptedImage.vue';
import DiscoveredCube from './DiscoveredCube.vue';

export default {
  name: 'Kitchen',
  components: { EncryptedImage, DiscoveredCube },
  data() {
    return {
      decryptedZoneImages: {
        display: null,
        receptacle: null,
        outil: null,
        rune: null,
        carburant: null,
        bag: null,
      },
    };
  },
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
    isVisible: {
      type: Boolean,
    },
  },
  computed: {
    bagZoneStyle() { return this.getZoneStyle(null, 'bag', 'assets/block/block_I_vide.png'); },
    displayZoneStyle() { return this.getZoneStyle(this.kitchenDisplayCube, 'display', 'assets/block/block_B_vide.png'); },
    receptacleZoneStyle() { return this.getZoneStyle(this.kitchenReceptacleCube, 'receptacle', 'assets/block/block_Re_vide.png'); },
    outilZoneStyle() { return this.getZoneStyle(this.kitchenOutilCube, 'outil', 'assets/block/block_O_vide.png'); },
    runeZoneStyle() { return this.getZoneStyle(this.kitchenRuneCube, 'rune', 'assets/block/block_ru_vide.png'); },
    carburantZoneStyle() { return this.getZoneStyle(this.kitchenCarburantCube, 'carburant', 'assets/block/block_C_vide.png'); },
  },
  watch: {
    isVisible(newValue) {
      if (newValue && !this.decryptedZoneImages.bag) {
        // Charge l'image de fond du sac d'ingrédients la première fois que la cuisine est visible
        this.updateDecryptedImage(null, 'bag', 'assets/block/block_I_vide.png');

        // Lorsque la cuisine devient visible, on force le repositionnement des cubes.
        this.$nextTick(() => {
          this.$refs.kitchenBagCubeRefs?.forEach(cube => cube.recenterInParent());
        });
      }
    },
    kitchenDisplayCube: { handler(newCube) { this.updateDecryptedImage(newCube, 'display', 'assets/block/block_B_vide.png'); }, immediate: true },
    kitchenReceptacleCube: { handler(newCube) { this.updateDecryptedImage(newCube, 'receptacle', 'assets/block/block_Re_vide.png'); }, immediate: true },
    kitchenOutilCube: { handler(newCube) { this.updateDecryptedImage(newCube, 'outil', 'assets/block/block_O_vide.png'); }, immediate: true },
    kitchenRuneCube: { handler(newCube) { this.updateDecryptedImage(newCube, 'rune', 'assets/block/block_ru_vide.png'); }, immediate: true },
    kitchenCarburantCube: { handler(newCube) { this.updateDecryptedImage(newCube, 'carburant', 'assets/block/block_C_vide.png'); }, immediate: true },
  },
  methods: {
    async updateDecryptedImage(cube, zoneKey, defaultPath) {
      const path = cube ? cube.img_src : defaultPath;
      if (path) {
        this.decryptedZoneImages[zoneKey] = await getDecryptedImage(path);
      } else {
        this.decryptedZoneImages[zoneKey] = null;
      }
    },
    getZoneStyle(cube, zoneKey, defaultPath) {
      const imageUrl = this.decryptedZoneImages[zoneKey] || '';
      const finalStyle = {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
      if (cube) {
        finalStyle.backgroundSize = 'cover';
        finalStyle.border = 'none';
      }
      return finalStyle;
    },
    close() {
      this.$emit('close-book');
    },
    handleDisplayClick() {
      // Si un cube est présent dans la zone de résultat, un clic le libère.
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

.kitchen-bag {
  width: 160px;
  height: 160px;
  top: 5%; /* Pointe du haut */
  left: 50%; 
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 0.9em;
  cursor: pointer;
}

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

.kitchen-rune {
  width: 100px;
  height: 100px;
  top: 35%; /* Pointe haut-gauche */
  left: 10%;
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