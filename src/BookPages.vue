<template>
  <div>
    <div class="config-container">
      <button class="save-button" @click="saveContent">Sauvegarder</button>
      <button class="close-button" @click="close">Close</button>
    </div>
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
      <button class="nav-button" @click="prevPage" :disabled="currentPage === 0">Précédent</button>
      <span class="page-number">Pages {{ currentPage * 2 + 1 }} - {{ currentPage * 2 + 2 }}</span>
      <button class="nav-button" @click="nextPage" :disabled="isNextButtonDisabled">Suivant</button>
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
  data() {  //ici quand cur°page change, page est aussi reset car si une valeur dans data bouge, les autre sont rechargé
    return {
      // Tableau pour stocker plusieurs doubles pages
      pages: [
        { left: createEmptyPage(), right: createEmptyPage() }
      ],
      // Index de la double page actuelle
      currentPage: 0,
    };
  },
  props: {
    pagesVisible: false
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
        if (Array.isArray(parsedPages) && parsedPages.every(p => p && typeof p.left === 'object' && typeof p.right === 'object')) {
          // Limiter au nombre maximum de pages pour éviter les problèmes
          this.pages = parsedPages.slice(0, MAX_DOUBLE_PAGES);
        } else {
          throw new Error("Invalid data structure in localStorage.");
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
    close() {
      this.$emit('close-book');
    },
    nextPage() {
      if (this.currentPage < MAX_DOUBLE_PAGES - 1) {
        this.currentPage++;
        // Ajouter une nouvelle double page si on arrive sur une page qui n'existe pas encore
        if (this.currentPage === this.pages.length) {
        this.pages.push({ left: createEmptyPage(), right: createEmptyPage() });
        }
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
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
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