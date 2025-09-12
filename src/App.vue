
<template> 
  <header v-show="pagesVisible == false && readMeVisible == false">
    <img alt="logo_ronge_bois"
      class="logo"
      src="./assets/ronge_bois_symbole.png"
      width="250"
      height="auto"
      @click="showReadMe"/>
  </header>

  <main>
    <div v-show="pagesVisible == false && readMeVisible == false" class="home-container">
      <img
        src="./assets/book_boiserie.png"
        alt="Book Cover"
        class="book-cover"
        width="400"
        height="600"
        @click="showPages"
      />
      <Cube 
        v-for="cube in homeCubes"
        :key="cube.id" :cube-data="cube"
      />
    </div>
    <BookPages
      v-show="pagesVisible"
      @close-book="receiveEmit"
      @page-changed="updateCurrentBookPage"
      :cubes="cubes"
      :current-book-page="currentBookPage"
    />
    <ReadMe
      v-show="readMeVisible"
      @close-book="receiveEmit"
    />
</main>
</template>

<script> 
import BookPages from './BookPages.vue';
import ReadMe from './ReadMe.vue';
import Cube from './Cube.vue';
import { cubesinfos } from './cubes';
export default {
  components: {
    BookPages,
    ReadMe,
    Cube,
  },
  data()
  {
    return {
      pagesVisible: false,
      readMeVisible: false,
      cubes: cubesinfos, // Utilisation directe du tableau importé
      currentBookPage: -1, // -1 signifie que le livre est fermé
    };
  },
  computed: {
    homeCubes() {
      // Affiche les cubes qui n'ont pas de page assignée (ceux de la page principale)
      return this.cubes.filter(cube => cube.page === undefined || cube.page === null);
    }
  },
  methods: {
    showPages() {
      this.pagesVisible = true;
      this.currentBookPage = 0; // Le livre s'ouvre à la première double-page (index 0)
    },
    showReadMe() {
      this.readMeVisible = true;
    },
    receiveEmit(){
      this.pagesVisible = false;
      this.readMeVisible = false;
      this.currentBookPage = -1; // Le livre est fermé
    },
    updateCurrentBookPage(pageIndex) {
      this.currentBookPage = pageIndex;
    },
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

.home-container {
  position: relative;
}


</style>
