<template>
  <div class="page" ref="pageElement">
    <!-- Affiche les cubes relatifs à cette page -->
    <Cube
      v-for="cube in cubes"
      :key="cube.id"
      :cube-data="cube"
      :floor-width="pageWidth" 
      :floor-height="pageHeight"
      @discovered="$emit('discovered', $event)" />

    <!-- Affiche directement l'image de la page si elle existe -->
    <img v-if="pageData.imageUrl" :src="pageData.imageUrl" alt="Page du livre" class="page-image">
    <!-- Sinon, affiche une page de fond par défaut -->
    <img v-else src="./assets/book_boiserie_page.png" alt="Page de fond" class="page-image">
  </div>
</template>
<script>
import Cube from './Cube.vue';
export default {
  components: {
    Cube,
  },
  props: {
    // pageData contient maintenant juste { imageUrl: '...' }
    pageData: {
      type: Object,
      required: true,
    },
    pageWidth: { type: Number, default: 600 }, // Largeur de la page
    pageHeight: { type: Number, default: 800 }, // Hauteur de la page (ajustez si nécessaire)
    cubes: {
      type: Array,
      default: () => [],
    }
  },
}
</script>

<style scoped>
.page {
  position: relative;
}

.page-image {
  width: 600px;
  height: auto;
  display: block;
}
</style>