
<template> 
  <header v-show="!pagesVisible">
    <img alt="logo_ronge_bois"
      class="logo"
      src="./assets/ronge_bois_symbole.png"
      width="250"
      height="auto" />
  </header>

  <main id="background">
    <img
      v-show="!pagesVisible" 
      src="./assets/book_boiserie.png"
      alt="Book Cover"
      class="book-cover"
      width="400"
      height="600"
      @click="showPages"
    />
    <BookPages
      v-show="pagesVisible"
      @close-book="receiveEmit"
    />
</main>
</template>

<script> 
import BookPages from './BookPages.vue';
export default {
  components: {
    BookPages,
  },
  data() { 
    return {
      pagesVisible: false
    };
  },
  methods: {
    showPages() {
      this.pagesVisible = true;
    },
    receiveEmit(){
      this.pagesVisible = false;
    }
  },
};
</script>

<style scoped>

header {
  display: flex;
  place-items: center;
  padding-right: calc(var(--section-gap) / 2);
}

.logo {
  display: block;
  margin: 0 2rem 0 0;
}

.book-cover {
  display: block;
  margin: 0 auto 2rem;
}


</style>
