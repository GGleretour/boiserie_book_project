    <script> 
    import BookPages from './BookPages.vue';
    export default {
      components: {
        BookPages,
      },
      data() { 
        return {
          pagesVisible: false,
        };
      },
      methods: {
        showPages() {
          this.pagesVisible = true;
        },
      },
    };
    </script>
<template> 
  <div class="container">
    <h1>My Boiserie Book</h1>

    <img
      v-if="!pagesVisible" 
      src="./assets/book_boiserie.png"
      alt="Book Cover"
      class="book-cover"
      @click="showPages"
    />
    <BookPages v-if="pagesVisible" />
  </div>
</template>


<style scoped>

.container {
  text-align: center;
  background-image: url('./assets/background.jpg');
  background-size:auto; /* Optional: Adjust as needed */
}
.book-cover {
  width: 50%; /* Make the width relative to the container */
  height: auto;
  cursor: pointer;
  margin: 0 auto; /* Add this line to center the book cover */
}
</style>
