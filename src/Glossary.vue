<template>
  <div class="glossary-container" :class="{ 'is-open': isOpen }">
    <div class="glossary-handle" @click="toggleGlossary">
    </div>
    <div class="glossary-content">
      <EncryptedImage src="assets/planche_a_glossaire.png" alt="Planche du glossaire" class="glossary-background" />
      <div class="cubes-grid">
        <div
          v-for="cube in cubes"
          :key="cube.id"
          class="cube-slot"
          @click="handleCubeClick(cube)"
        >
          <EncryptedImage
            :src="cube.img_src"
            :alt="cube.id"
            class="cube-image"
            :class="{ 'not-discovered': !cube.find }"
            draggable="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EncryptedImage from './EncryptedImage.vue';

export default {
  name: 'Glossary',
  components: { EncryptedImage },
  props: {
    cubes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleGlossary() {
      this.isOpen = !this.isOpen;
    },
    handleCubeClick(cube) {
      // On ne peut faire apparaître que les cubes déjà découverts
      if (cube.find) {
        this.$emit('spawn-from-glossary', cube);
      }
    },
  },
};
</script>

<style scoped>
.glossary-container {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translate(-74%, -50%);
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* Effet rebondissant */
  z-index: 1000;
  display: flex;
  align-items: center;
}

.glossary-container.is-open {
  transform: translate(0, -50%);
}

.glossary-handle {
  position: absolute;
  right: 0px; /* Ajustez pour positionner la poignée correctement */
  top: 50%;
  transform: translateY(-50%);
  width: 200px; /* Ajustez la taille */
  height: 150px; /* Ajustez la taille */
  cursor: pointer;
  z-index: 1;
}

.glossary-handle img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.glossary-content {
  position: relative;
  width: 700px; /* Largeur de la planche */
  height: 466px; /* Hauteur de la planche */
}

.glossary-background {
  width: 100%;
  height: 100%;
}

.cubes-grid {
  position: absolute;
  top: 49%;
  left: 40%;
  transform: translate(-50%, -50%);
  width: 60%; /* Ajustez pour correspondre à la zone de grille sur votre image */
  height: 63%; /* Ajustez pour correspondre à la zone de grille sur votre image */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 2fr)); /* Crée des colonnes flexibles */
  gap: 0px;
  padding: 5px;
  overflow-y: auto;
}

.cube-slot {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.cube-image {
  max-width: 100%;
  max-height: 100%;
  transition: filter 0.3s ease;
}

.cube-image.not-discovered {
  filter: grayscale(1) brightness(0.1);
  cursor: not-allowed;
}
</style>