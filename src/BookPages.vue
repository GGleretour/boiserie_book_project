<template>
  <div>
    <div class="pages-container" v-if="pages[currentPage]">
      <!-- Page de Gauche -->
      <RecipePage 
        v-model:pageData="pages[currentPage].left"
      />
      <!-- Page de Droite -->
      <RecipePage 
        v-model:pageData="pages[currentPage].right"
      />
    </div>
    <div class="navigation-container">
      <button @click="prevPage" :disabled="currentPage === 0" class="nav-button">Précédent</button>
      <span class="page-number">Pages {{ currentPage * 2 + 1 }} - {{ currentPage * 2 + 2 }}</span>
      <button @click="nextPage" :disabled="isNextButtonDisabled" class="nav-button">Suivant</button>
      <button @click="saveContent" class="save-button">Sauvegarder</button>
    </div>
  </div>
</template>

<script>
import RecipePage from './RecipePage.vue';
import { MAX_DOUBLE_PAGES } from './config.js';

const createEmptyPage = () => ({ title: '', imageUrl: '', ingredients: '', description: '' });

export default {
  components: {
    RecipePage
  },
  data() {
    return {
      // Tableau pour stocker plusieurs doubles pages
      pages: [
        { left: createEmptyPage(), right: createEmptyPage() }
      ],
      // Index de la double page actuelle
      currentPage: 0,
    };
  },
  computed: {
    isNextButtonDisabled() {
      return this.currentPage >= MAX_DOUBLE_PAGES - 1;
    }
  },
  mounted() {
    // Charger le contenu depuis le localStorage quand le composant est monté
    const savedPages = localStorage.getItem('boiserieBookPages');
    if (savedPages) {
      try {
        const parsedPages = JSON.parse(savedPages);
        // S'assurer que les données chargées ont la bonne structure
        if (Array.isArray(parsedPages) && parsedPages.length > 0 && parsedPages[0].left && parsedPages[0].right) {
          this.pages = parsedPages;
        }
      } catch (e) {
        console.error("Erreur lors de la lecture des pages sauvegardées:", e);
        // En cas d'erreur, on réinitialise le localStorage pour éviter des problèmes futurs
        localStorage.removeItem('boiserieBookPages');
      }
    }
  },
  methods: {
    saveContent() {
      // Sauvegarder le contenu dans le localStorage
      localStorage.setItem('boiserieBookPages', JSON.stringify(this.pages));

      alert("Contenu sauvegardé dans le navigateur !");
    },
    nextPage() {
      // Si on est sur la dernière page et qu'on peut en ajouter, on le fait.
      if (this.currentPage === this.pages.length - 1 && this.pages.length < MAX_DOUBLE_PAGES) {
        this.pages.push({ left: createEmptyPage(), right: createEmptyPage() });
      }
      // On ne peut avancer que s'il y a une page suivante.
      if (this.currentPage < this.pages.length - 1) {
          this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
  },
};
</script>

<style scoped>
.pages-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-direction: row; /* Ensure pages are side by side */
}

.navigation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 20px; /* Espace entre les boutons */
}

.page-number {
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

.nav-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #008CBA; /* Blue */
  color: white;
  border: none;
  border-radius: 5px;
}

.nav-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>