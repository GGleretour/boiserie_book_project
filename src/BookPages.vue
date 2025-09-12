<template>
  <div>
    <!-- Le bouton "Close" est conservé pour fermer le livre -->
    <div class="config-container">
      <button class="close-button" @click="close">Close</button>
    </div>
    <div class="pages-container" v-if="pages[currentPage]">
      <!-- Page de Gauche -->
      <RecipePage 
        v-model:pageData="pages[currentPage].left"
        :cubes="leftPageCubes"
        :page-width="640"
        :page-height="920"
      />
      <!-- Page de Droite -->
      <RecipePage 
        v-model:pageData="pages[currentPage].right"
        :cubes="rightPageCubes"
        :page-width="640"
        :page-height="920"
      />
    </div>
    <div class="navigation-container">
      <img
        id="arrow_left"
        src="./assets/arrow.png" 
        alt="arrow left"
        class="nav-button"
        @click="prevPage"
        width="100"
        height="100"
        :disabled="currentPage === 0"/>
      <span class="page-number">Pages {{ currentPage * 2 + 1 }} - {{ currentPage * 2 + 2 }}</span>
      <img
        id="arrow_right"
        src="./assets/arrow.png" 
        alt="arrow right"
        class="nav-button"
        @click="nextPage"
        width="100"
        height="100"
        :disabled="isNextButtonDisabled"
      />
    </div>
  </div>
</template>

<script>
import Cube from './Cube.vue';
import RecipePage from './RecipePage.vue';
import { pageImages } from './pages.js';

export default {
  components: {
    RecipePage,
    Cube,
  },
  props: {
    cubes: Array,
    currentBookPage: Number,
    pagesVisible: Boolean // Cette prop n'est plus utilisée mais conservée pour l'instant
  },
  data() {
    // Crée les doubles-pages à partir de la liste d'images
    const pages = [];
    for (let i = 0; i < pageImages.length; i += 2) {
      pages.push({
        left: { imageUrl: pageImages[i] || null },
        right: { imageUrl: pageImages[i + 1] || null },
      });
    }

    return {
      // Le livre est maintenant basé sur les images importées
      pages: pages,
      // Index de la double page actuelle (utilisera la prop)
      currentPage: 0
    };
  },
  computed: {
    isNextButtonDisabled() {
      // Le bouton "suivant" est désactivé si on est sur la dernière double-page
      return this.currentPage >= this.pages.length - 1;
    },
    visibleCubes() {
      // Filtre les cubes pour la double-page actuelle
      return this.cubes.filter(cube => cube.page === this.currentPage && !cube.isInInventory);
    },
    leftPageCubes() {
      // Cubes pour la page de gauche
      return this.visibleCubes.filter(cube => cube.side === 'left');
    },
    rightPageCubes() {
      // Cubes pour la page de droite
      return this.visibleCubes.filter(cube => cube.side === 'right');
    }
  },
  methods: {
    close() {
      this.$emit('close-book');
    },
    nextPage() {
      if (this.currentPage < this.pages.length - 1) {
        this.currentPage++;
        this.$emit('page-changed', this.currentPage);
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.$emit('page-changed', this.currentPage);
      }
    },
  },
};
</script>

<style scoped>

.config-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
  gap: 20px; /* Espace entre les boutons */
}

.pages-container {
  display: flex;
  margin-top: 10px;
  justify-content: left;
  align-items: center;
  flex-direction: row; /* Ensure pages are side by side */
}

.navigation-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -80px;
  gap: 60px;
}

.page-number {
  z-index:2;

  font-size: 16px;
  color: #333;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px 15px;
  border-radius: 15px;
  font-weight: bold;
}

.save-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4CAF50; /* Green */
  color: white;
  border: none;
  border-radius: 5px;
}

.close-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #e02929; /* Green */
  color: white;
  border: none;
  border-radius: 5px;
}

.nav-button {
  z-index:2;

  padding: 10px 10px;
  font-size: 30px;
  cursor: pointer;
}

.nav-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
#arrow_right {
  scale: 1 -1;
}
#arrow_left {
  scale: -1 -1;
}
</style>