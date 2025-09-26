<template>
  <div id="kitchen_container">
    <!-- Bouton de fermeture -->
    <div class="config-container">
      <button class="close-button" @click="close">Close</button>
    </div>
    <div class="content-wrapper">
      <EncryptedImage
        id="kitchen_page"
        src="/assets/page.png"
        alt="kitchen page"
        width="600"
        height="auto"
      />

      <!-- Zone 1 : Le "sac" de la cuisine -->
      <div id="kitchen-bag-zone" class="drop-zone kitchen-bag">
        <p>Atelier</p>
        <!-- Affiche les cubes stockés dans cette zone -->
        <DiscoveredCube
          v-for="cube in kitchenBagCubes"
          :key="`kitchen-bag-${cube.id}`"
          :is-in-inventory="true"
          :cube-id="cube.id"
          :original-cube-id="cube.originalCubeId"
          :img-src="cube.img_src"
          @mousedown.stop="$emit('release-discovered-cube', cube.id)"
        />
      </div>

      <!-- Zone 2 : La zone d'affichage/remplacement -->
      <div
        id="kitchen-display-zone"
        class="drop-zone kitchen-display"
        :style="displayZoneStyle"
        @click="releaseDisplayCube"
      >

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
  },
  computed: {
    displayZoneStyle() {
      if (this.kitchenDisplayCube) {
        // Quand un cube est présent, on utilise son image comme fond
        return {
          backgroundImage: `url(${this.kitchenDisplayCube.img_src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      // Style par défaut
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '2px dashed #fff',
      };
    },
  },
  methods: {
    close() {
      this.$emit('close-book');
    },
    releaseDisplayCube() {
      if (this.kitchenDisplayCube) {
        this.$emit('release-discovered-cube', this.kitchenDisplayCube.id);
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

.drop-zone {
  position: absolute;
  border-radius: 10px;
  box-sizing: border-box;
}

.kitchen-bag {
  width: 200px;
  height: 200px;
  top: 50px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 2px solid #8B4513;
  color: white;
  text-align: center;
  padding-top: 10px;
}

.kitchen-display {
  width: 150px;
  height: 150px;
  top: 50px;
  right: 20px;
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