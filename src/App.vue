
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
    <img
      v-show="pagesVisible == false && readMeVisible == false"
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
    <Cube v-show="pagesVisible == false && readMeVisible == false"
      v-for="cube in cubes"
      :key="cube.id"
      :cubeid="cube"/>
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
    const cubes = [];

    for (let i = 0; i < cubesinfos.length; i += 1)
      cubes.push( {
          id: cubesinfos[i].id,
          img_src:cubesinfos[i].img_src,
          find:cubesinfos[i].find,
          stocked:cubesinfos[i].stocked,
          transparence:cubesinfos[i].transparence,
          x_out:cubesinfos[i].x_out,
          y_out:cubesinfos[i].y_out,
          x_in:cubesinfos[i].x_in,
          y_in:cubesinfos[i].y_in,
          rotation:cubesinfos[i].rotation,
      });
    return {
      pagesVisible: false,
      readMeVisible: false,
      cubes: cubes
    };
  },
  methods: {
    showPages() {
      this.pagesVisible = true;
    },
    showReadMe() {
      this.readMeVisible = true;
    },
    receiveEmit(){
      this.pagesVisible = false;
      this.readMeVisible = false;
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
