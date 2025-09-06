<template>
  <div>
    <div class="pages-container">
      <!-- Page de Gauche -->
      <div class="page left-page">
        <img src="./assets/book_boiserie_page.png" alt="Left Page" class="page-image">
        <div class="page-content">
          <input type="text" v-model="pages[currentPage].title" placeholder="Titre de la recette" class="recipe-title">
          <div class="recipe-body">
            <div class="recipe-image-container">
              <img v-if="pages[currentPage].imageUrl" :src="pages[currentPage].imageUrl" alt="Recipe Image" class="recipe-image">
              <input type="text" v-model="pages[currentPage].imageUrl" placeholder="URL de l'image" class="image-url-input">
            </div>
            <textarea v-model="pages[currentPage].ingredients" placeholder="Liste des ingrédients..." class="ingredients-list"></textarea>
          </div>
          <textarea v-model="pages[currentPage].description" placeholder="Description de la recette..." class="recipe-description"></textarea>
        </div>
      </div>
      <!-- Page de Droite (peut être utilisée pour la suite de la recette ou une autre recette) -->
      <div class="page right-page">
        <img src="./assets/book_boiserie_page.png" alt="Right Page" class="page-image">
        <textarea v-model="pages[currentPage].rightPageText" placeholder="Suite de la recette ou autre contenu..."></textarea>
      </div>
    </div>
    <div class="navigation-container">
      <button @click="prevPage" :disabled="currentPage === 0" class="nav-button">Précédent</button>
      <span class="page-number">Pages {{ currentPage * 2 + 1 }} - {{ currentPage * 2 + 2 }}</span>
      <button @click="saveContent" class="save-button">Sauvegarder</button>
      <button @click="nextPage" class="nav-button">Suivant</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Tableau pour stocker plusieurs doubles pages
      pages: [
        { title: '', imageUrl: '', ingredients: '', description: '', rightPageText: '' }
      ],
      // Index de la double page actuelle
      currentPage: 0,
    };
  },
  mounted() {
    // Charger le contenu depuis le localStorage quand le composant est monté
    const savedPages = localStorage.getItem('boiserieBookPages');
    if (savedPages) {
      this.pages = JSON.parse(savedPages);
    }
    // S'assurer qu'il y a au moins une page
    if (this.pages.length === 0) {
      this.pages.push({ title: '', imageUrl: '', ingredients: '', description: '', rightPageText: '' });
    }
  },
  methods: {
    saveContent() {
      // Sauvegarder le contenu dans le localStorage
      localStorage.setItem('boiserieBookPages', JSON.stringify(this.pages));

      alert("Contenu sauvegardé dans le navigateur !");
    },
    nextPage() {
      // Si on est sur la dernière page, on en ajoute une nouvelle
      if (this.currentPage === this.pages.length - 1) {
        this.pages.push({ title: '', imageUrl: '', ingredients: '', description: '', rightPageText: '' });
      }
      this.currentPage++;
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

.page {
  position: relative; /* To contain absolutely positioned textarea */
  width: 45%;
}

.page-image {
  width: 45vw;
  height: auto;
  display: block; /* Remove extra space below image */
}

/* Styles pour le contenu de la page de gauche */
.page-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 5% 7%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.recipe-title {
  font-size: 1.5vw;
  font-weight: bold;
  text-align: center;
  background: transparent;
  border: none;
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
  flex-shrink: 0; /* Empêche le titre de rétrécir */
}

.recipe-body {
  display: flex;
  flex-grow: 1; /* Permet à cette section de grandir */
  gap: 15px;
  min-height: 0; /* Nécessaire pour que flex-grow fonctionne correctement dans un conteneur flex */
}

.recipe-image-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipe-image {
  max-width: 100%;
  max-height: 150px; /* Ajustez la hauteur max de l'image */
  object-fit: cover;
  margin-bottom: 5px;
}

.image-url-input {
  width: 100%;
  font-size: 0.7vw;
  background: #f0f0f0;
  border: 1px solid #ccc;
  padding: 2px;
}

.ingredients-list, .recipe-description, textarea {
  flex: 1;
  background: transparent;
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 0.9vw;
  resize: none; /* Empêche le redimensionnement manuel */
}

.save-button-container {
  margin-top: 20px;
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
</style>