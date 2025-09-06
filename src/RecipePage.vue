<template>
  <div class="page">
    <img src="./assets/book_boiserie_page.png" alt="Page background" class="page-image">
    <div class="page-content">
      <input type="text" :value="pageData.title" @input="updateField('title', $event.target.value)" placeholder="Titre de la recette" class="recipe-title">
      <div class="recipe-body">
        <div class="recipe-image-container">
          <img v-if="pageData.imageUrl" :src="pageData.imageUrl" alt="Recipe Image" class="recipe-image">
          <input type="text" :value="pageData.imageUrl" @input="updateField('imageUrl', $event.target.value)" placeholder="URL de l'image" class="image-url-input">
        </div>
        <textarea :value="pageData.ingredients" @input="updateField('ingredients', $event.target.value)" placeholder="Liste des ingrédients..." class="ingredients-list"></textarea>
      </div>
      <textarea :value="pageData.description" @input="updateField('description', $event.target.value)" placeholder="Description de la recette..." class="recipe-description"></textarea>
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
  emits: ['update:pageData'],
  methods: {
    updateField(field, value) {
      const updatedData = {
        ...this.pageData,
        [field]: value
      };
      this.$emit('update:pageData', updatedData);
    }
  }
}
</script>

<style scoped>
.page {
  position: relative;
  width: 45%;
}

.page-image {
  width: 45vw;
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
  font-size: 1.5vw;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipe-image {
  max-width: 100%;
  max-height: 150px;
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

.ingredients-list, .recipe-description {
  flex: 1;
  background: transparent;
  border: 1px solid #ccc;
  padding: 5px;
  font-size: 0.9vw;
  resize: none;
}
</style>