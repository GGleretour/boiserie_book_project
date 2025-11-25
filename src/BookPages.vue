<template>
  <div>
    <!-- Le bouton "Close" est conservé pour fermer le livre -->
    <div class="config-container">
      <button class="close-button" @click="close">Close</button>
    </div>
    <div class="pages-container" v-if="pages[currentPage]" @click="logClickPosition">
      <!-- Page de Gauche -->
      <RecipePage 
        v-model:pageData="pages[currentPage].left"
        :cubes="whatPageCubes(pages[currentPage].left.imageUrl)"
        :page-width="400"
        :page-height="600" 
        ref="leftPage"
        @discovered="$emit('discovered', $event)"
      />
      <!-- Page de Droite -->
      <RecipePage 
        v-model:pageData="pages[currentPage].right"
        :cubes="whatPageCubes(pages[currentPage].right.imageUrl)"
        :page-width="400"
        :page-height="600"
        ref="rightPage"
        @discovered="$emit('discovered', $event)"
      />
    </div>
    <div class="navigation-container">
      <EncryptedImage
        id="arrow_left"
        src="assets/sprite/arrow.png" 
        alt="arrow left"
        class="nav-button"
        @click="prevPage"
        width="100"
        height="100"
        :disabled="currentPage === 0"/>
      <span class="page-number">Pages {{ currentPage * 2 + 1 }} - {{ currentPage * 2 + 2 }}</span>
      <EncryptedImage
        id="arrow_right"
        src="assets/sprite/arrow.png" 
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
import EncryptedImage from './EncryptedImage.vue';
import RecipePage from './RecipePage.vue';
import { pageImages } from './pages.js';

export default {
  components: {
    RecipePage,
    Cube,
    EncryptedImage,
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
      return this.cubes.filter(cube => cube.page === this.currentPage && !cube.isInInventory && cube.disp);
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
    whatPageCubes(page) {
      return this.cubes.filter(cube => cube.page === page && cube.disp);
    },
    logClickPosition(event) {
      // Cette fonction ne s'exécute qu'en mode développement (npm run dev)
      if (import.meta.env.DEV) {
        const leftPageEl = this.$refs.leftPage?.$el;
        const rightPageEl = this.$refs.rightPage?.$el;

        if (!leftPageEl || !rightPageEl) return;

        const leftRect = leftPageEl.getBoundingClientRect();
        const rightRect = rightPageEl.getBoundingClientRect();

        let pageClicked = null;
        let x = 0;
        let y = 0;
        let side = '';

        if (event.clientX >= leftRect.left && event.clientX <= leftRect.right && event.clientY >= leftRect.top && event.clientY <= leftRect.bottom) {
          pageClicked = leftRect;
          side = 'left';
        } else if (event.clientX >= rightRect.left && event.clientX <= rightRect.right && event.clientY >= rightRect.top && event.clientY <= rightRect.bottom) {
          pageClicked = rightRect;
          side = 'right';
        }

        if (pageClicked) {
          const x_px = Math.round(event.clientX - pageClicked.left);
          const y_px = Math.round(event.clientY - pageClicked.top);
          if (side === 'left') {
          console.log(`x_out:'${x_px}px',\ny_out:'${y_px}px',\npage: '${this.pages[this.currentPage].left.imageUrl}',\n`);
          } else {
          console.log(`x_out:'${x_px}px',\ny_out:'${y_px}px',\npage: '${this.pages[this.currentPage].right.imageUrl}',\n`);
          }
        }
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 10px;
  align-items: center;
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
  transform: scaleX(-1);
}
</style>