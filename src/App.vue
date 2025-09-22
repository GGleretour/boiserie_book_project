
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
        :key="cube.id" 
        :cube-data="cube"
        @discovered="spawnDiscoveredCube"
        @state-changed="saveCubesState"
      />
    </div>
    <BookPages
      v-show="pagesVisible"
      @close-book="receiveEmit"
      @page-changed="updateCurrentBookPage"
      @discovered="spawnDiscoveredCube"
      :cubes="cubes"
      @state-changed="saveCubesState"
      :current-book-page="currentBookPage"
    />
    <ReadMe
      v-show="readMeVisible"
      @close-book="receiveEmit"
    />
    <SpecialCube 
      :cubes="cubes" 
      :stored-discovered-cubes="storedDiscoveredCubes"
      @release-discovered-cube="releaseDiscoveredCube"
    />
    <DiscoveredCube
      v-for="cube in discoveredCubes"
      :key="cube.id"
      v-show="!cube.isStored"
      :img-src="cube.img_src"
      :cube-id="cube.id"
      @stored="storeDiscoveredCube"
    />
</main>
</template>

<script> 
import BookPages from './BookPages.vue';
import ReadMe from './ReadMe.vue';
import Cube from './Cube.vue';
import SpecialCube from './SpecialCube.vue';
import DiscoveredCube from './DiscoveredCube.vue';
import { cubesinfos } from './cubes';
export default {
  components: {
    BookPages,
    ReadMe,
    Cube,
    SpecialCube,
    DiscoveredCube,
  },
  data()
  {
    return {
      pagesVisible: false,
      readMeVisible: false,
      cubes: cubesinfos, // Utilisation directe du tableau importé
      currentBookPage: -1, // -1 signifie que le livre est fermé
      // Gère l'état des cubes découverts
      discoveredCubes: [],
    };
  },
  computed: {
    homeCubes() {
      // Affiche les cubes qui n'ont pas de page assignée (ceux de la page principale)
      return this.cubes.filter(cube => (cube.page === undefined || cube.page === null) && !cube.isInInventory);
    },
    storedDiscoveredCubes() {
      return this.discoveredCubes.filter(c => c.isStored);
    },
  },
  created() {
    // Au chargement, on restaure l'état depuis le localStorage avec une nouvelle logique.
    const savedCubes = localStorage.getItem('cubes');
    const savedDiscoveredCubes = localStorage.getItem('discoveredCubes');

    if (savedCubes && savedDiscoveredCubes) {
      let discovered = JSON.parse(savedDiscoveredCubes);
      let originals = JSON.parse(savedCubes);

      // 1. On ne garde que les cubes découverts qui sont stockés dans le sac.
      const storedDiscovered = discovered.filter(c => c.isStored);
      const storedImgSrcs = new Set(storedDiscovered.map(c => c.img_src));

      // 2. On met à jour la liste des cubes originaux.
      // Un cube original est considéré comme "trouvé" (find: true) SEULEMENT si sa version découverte est dans le sac.
      originals.forEach(cube => {
        cube.find = storedImgSrcs.has(cube.img_src);
      });

      // 3. On applique les états filtrés et mis à jour.
      this.discoveredCubes = storedDiscovered;
      this.cubes = originals;
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
    spawnDiscoveredCube(imgSrc) {
      // Vérifie si un cube découvert avec cette image existe déjà
      const alreadyExists = this.discoveredCubes.some(c => c.img_src === imgSrc);
      if (alreadyExists) {
        console.log('Ce cube a déjà été découvert, on ne le recrée pas.');
        return; // On arrête la fonction pour ne pas créer de doublon
      }
      const newId = `dc-${Date.now()}`; // Crée un ID unique
      this.discoveredCubes.push({ id: newId, isStored: false, img_src: imgSrc });
      // On sauvegarde uniquement la liste des cubes découverts ici
      localStorage.setItem('discoveredCubes', JSON.stringify(this.discoveredCubes));
      console.log('Nouveau DiscoveredCube créé !', newId);
    },
    storeDiscoveredCube(cubeId) {
      // Le cube original est déjà marqué comme 'find' et sauvegardé.
      const cube = this.discoveredCubes.find(c => c.id === cubeId);
      if (cube) {
        cube.isStored = true;
        // On cherche le cube original correspondant par sa source d'image
        const originalCube = this.cubes.find(c => c.img_src === cube.img_src);
        if (originalCube) {
          originalCube.find = true; // On s'assure qu'il est bien marqué comme trouvé
          // On sauvegarde l'état des deux listes
          localStorage.setItem('cubes', JSON.stringify(this.cubes));
        }
        localStorage.setItem('discoveredCubes', JSON.stringify(this.discoveredCubes));
      }
    },
    releaseDiscoveredCube(cubeId) {
      const cube = this.discoveredCubes.find(c => c.id === cubeId);
      if (cube) {
        cube.isStored = false;
        localStorage.setItem('discoveredCubes', JSON.stringify(this.discoveredCubes));
      }
    },
    saveCubesState() {
      localStorage.setItem('cubes', JSON.stringify(this.cubes));
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

.home-container {
  position: relative;
}


</style>
