<template>
  <div class="page">
    <img src="./assets/book_boiserie_page.png" alt="Page background" class="page-image">
    <div class="page-content">
      <input type="text" v-model="editablePageData.title" placeholder="Titre de la recette" class="recipe-title">
      <div class="recipe-body">
        <div class="recipe-image-container">
          <img v-if="pageData.imageUrl" :src="pageData.imageUrl" alt="Recipe Image" class="recipe-image">
          <input type="text" v-model="editablePageData.imageUrl" placeholder="URL de l'image" class="image-url-input">
        </div>
        <textarea v-model="editablePageData.ingredients" placeholder="Liste des ingrédients..." class="ingredients-list"></textarea>
      </div>
      <textarea v-model="editablePageData.description" placeholder="Description de la recette..." class="recipe-description"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageData: {
      type: Object,
      required: true,
    }
  },
  emits: ['update:pageData.object', 'update:pageData'],
  computed: {
    editablePageData: {
      get() {
        return this.pageData;
      },
      set(newValue) {
        this.$emit('update:pageData', newValue);
      }
    }
  }
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
  font-size: 1.5;
  font-weight: bold;
  text-align: center;
  background: transparent;
  border: none;
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
  flex-shrink: 0;
}

.recipe-body {
  display: flex;
  flex-grow: 1;
  gap: 15px;
  min-height: 0;
}

.recipe-image-container {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 50%;
}

.recipe-image {
  max-width: 100%;
  max-height: 150px;
  object-fit: cover;
  margin-bottom: 5px;
}

.image-url-input {
  width: 100%;
  font-size: 1;
  background: #f0f0f0;
  border: 1px solid #ccc;
  padding: 2px;
}

.ingredients-list, .recipe-description {
  flex: 1;
  background: transparent;
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 1;
  resize: none;
}
</style>