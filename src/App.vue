
<template> 
  <EncryptedImage
    src="/assets/background.png"
    class="background-app"
    alt="background"/>
  <header v-show="pagesVisible == false && readMeVisible == false && kitchenVisible == false">
    <EncryptedImage alt="logo_ronge_bois"
      class="logo"
      src="/assets/ronge_bois_symbole.png"
      width="250"
      height="auto"
      @click="showReadMe"
    />

    <EncryptedImage alt="logo_petit_chaudron"
      class="logo"
      src="/assets/petit_chaudron.png"
      width="250"
      height="auto"
      @click="showKitchen"
    />
  </header>

  <main>
    <div v-show="pagesVisible == false && readMeVisible == false && kitchenVisible == false" class="home-container">
      <EncryptedImage
        src="/assets/book_boiserie.png"
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
    <Kitchen
      v-show="kitchenVisible"
      @close-book="receiveEmit"
      :kitchen-bag-cubes="kitchenBagCubes"
      :kitchen-display-cube="kitchenDisplayCube"
      @release-discovered-cube="releaseDiscoveredCube"
    />
   <SpecialCube
      :cubes="cubes"
      :stored-discovered-cubes="storedDiscoveredCubes"
      @release-discovered-cube="releaseDiscoveredCube"
   />
    <DiscoveredCube
      v-for="cube in discoveredCubes"
      :key="cube.id"
      v-show="!cube.isStored && !cube.isInKitchenBag && !cube.isInKitchenDisplay"
      :original-cube-id="cube.originalCubeId"
      :img-src="cube.img_src"
      :cube-id="cube.id"
      @stored="storeDiscoveredCube"
    />
</main>
</template>

<script> 
import BookPages from './BookPages.vue';
import ReadMe from './ReadMe.vue';
import Kitchen from './Kitchen.vue';
import Cube from './Cube.vue';
import SpecialCube from './SpecialCube.vue';
import DiscoveredCube from './DiscoveredCube.vue';
import EncryptedImage from './EncryptedImage.vue';
import CryptoJS from 'crypto-js';

// Récupère la clé secrète depuis les variables d'environnement.
const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

export default {
  components: {
    BookPages,
    ReadMe,
    Kitchen,
    Cube,
    SpecialCube,
    EncryptedImage,
    DiscoveredCube,
  },
  data()
  {
    return {
      pagesVisible: false,
      readMeVisible: false,
      kitchenVisible: false,
      cubes: [], // Sera chargé de manière asynchrone
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
    kitchenBagCubes() {
      // Filtre les cubes pour la première zone de la cuisine
      return this.discoveredCubes.filter(c => c.isInKitchenBag);
    },
    kitchenDisplayCube() {
      // Trouve le cube unique pour la deuxième zone (il ne peut y en avoir qu'un)
      // find() retourne le premier élément ou undefined, ce qui est parfait.
      return this.discoveredCubes.find(c => c.isInKitchenDisplay);
    }
  },
  async created() {
    // Charge et déchiffre la configuration des cubes
    const cubesinfos = await this.loadEncryptedCubes();
    if (cubesinfos) {
      // Au chargement, on restaure l'état depuis le localStorage avec une nouvelle logique.
      // On commence par la définition des cubes depuis cubes.js (la source de vérité pour les propriétés statiques)
      // Cela permet d'ajouter de nouveaux cubes ou de modifier les propriétés existantes (opacity, width, etc.)
      this.cubes = JSON.parse(JSON.stringify(cubesinfos)); // Deep copy pour ne pas modifier l'objet importé directement

      const encryptedCubes = localStorage.getItem('cubes');
      const encryptedDiscoveredCubes = localStorage.getItem('discoveredCubes');

      let savedCubesString = null;
      if (encryptedCubes) {
        try {
          const bytes = CryptoJS.AES.decrypt(encryptedCubes, SECRET_KEY);
          savedCubesString = bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) { console.error("Erreur de déchiffrement pour 'cubes'", e); }
      }

      let savedDiscoveredCubesString = null;
      if (encryptedDiscoveredCubes) {
        try {
          const bytes = CryptoJS.AES.decrypt(encryptedDiscoveredCubes, SECRET_KEY);
          savedDiscoveredCubesString = bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) { console.error("Erreur de déchiffrement pour 'discoveredCubes'", e); }
      }

      let savedOriginalsFindStatus = new Map(); // Pour stocker le statut 'find' des cubes sauvegardés
      let savedDiscoveredCubesData = []; // Pour stocker les cubes découverts sauvegardés

      if (savedCubesString) {
        const parsedSavedCubes = JSON.parse(savedCubesString);
        parsedSavedCubes.forEach(cube => {
          if (cube && cube.id) savedOriginalsFindStatus.set(cube.id, cube.find);
        });
      }

      if (savedDiscoveredCubesString) {
        savedDiscoveredCubesData = JSON.parse(savedDiscoveredCubesString);
      }

      // 1. Appliquer le statut 'find' sauvegardé aux cubes actuels.
      // Cela restaure l'état de découverte des cubes de la session précédente.
      this.cubes.forEach(cube => {
        if (savedOriginalsFindStatus.has(cube.id)) {
          cube.find = savedOriginalsFindStatus.get(cube.id);
        }
        // Les nouveaux cubes de cubes.js qui n'étaient pas sauvegardés garderont leur 'find: false' par défaut.
      });

      // 2. Filtrer les cubes découverts : on ne garde que ceux qui sont stockés dans le sac.
      const storedDiscovered = savedDiscoveredCubesData.filter(c => c.isStored || c.isInKitchenBag || c.isInKitchenDisplay);
      const storedOriginalIds = new Set(storedDiscovered.map(c => c.originalCubeId));

      // 3. Synchroniser le statut 'find' des cubes originaux avec les cubes découverts stockés.
      // Un cube original est considéré comme "trouvé" (find: true) SEULEMENT si sa version découverte est dans le sac.
      this.cubes.forEach(cube => {
        cube.find = storedOriginalIds.has(cube.id);
      });

      // 4. Appliquer l'état filtré et mis à jour aux cubes découverts du composant.
      this.discoveredCubes = storedDiscovered;
    }
  },
  methods: {
    async loadEncryptedCubes() {
      try {
        const response = await fetch('/assets-encrypted/cubes.enc');
        const encryptedText = await response.text();
        const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        const executableCode = decryptedText.replace('export ', '');
        // Le texte est un module JS, on doit extraire le tableau.
        // C'est une astuce qui utilise le constructeur de fonction pour évaluer le code.
        const getCubes = new Function(`${executableCode}; return cubesinfos;`);
        return getCubes();
      } catch (error) {
        console.error("Erreur lors du chargement ou du déchiffrement de la configuration des cubes:", error);
        return null;
      }
    },
    showPages() {
      this.pagesVisible = true;
      this.currentBookPage = 0; // Le livre s'ouvre à la première double-page (index 0)
    },
    showReadMe() {
      this.readMeVisible = true;
    },
    showKitchen() {
      this.kitchenVisible = true;
    },
    receiveEmit(){
      this.pagesVisible = false;
      this.readMeVisible = false;
      this.kitchenVisible = false;
      this.currentBookPage = -1; // Le livre est fermé
    },
    updateCurrentBookPage(pageIndex) {
      this.currentBookPage = pageIndex;
    },
    spawnDiscoveredCube(cubeData) {
      // Vérifie si un cube découvert lié à cet ID original existe déjà
      const alreadyExists = this.discoveredCubes.some(c => c.originalCubeId === cubeData.id);
      if (alreadyExists) {
        console.log('Ce cube a déjà été découvert, on ne le recrée pas.');
        return; // On arrête la fonction pour ne pas créer de doublon
      }
      const newId = `dc-${Date.now()}`; // Crée un ID unique pour le DiscoveredCube
      this.discoveredCubes.push({ id: newId, originalCubeId: cubeData.id, isStored: false, isInKitchenBag: false, isInKitchenDisplay: false, img_src: cubeData.img_src });
      // On sauvegarde la liste chiffrée des cubes découverts
      this.saveDiscoveredCubesState();
      console.log('Nouveau DiscoveredCube créé !', newId);
    },
    storeDiscoveredCube({ cubeId, zone }) {
      const cube = this.discoveredCubes.find(c => c.id === cubeId);
      if (cube) {
        // On s'assure que le cube n'est dans aucune autre zone avant de l'assigner
        cube.isStored = false;
        cube.isInKitchenBag = false;
        cube.isInKitchenDisplay = false;

        if (zone === 'mainBag') {
          cube.isStored = true;
        } else if (zone === 'kitchenBag') {
          cube.isInKitchenBag = true;
        } else if (zone === 'kitchenDisplay') {
          // S'il y a déjà un cube dans la zone d'affichage, on le libère
          const currentDisplayCube = this.discoveredCubes.find(c => c.isInKitchenDisplay && c.id !== cube.id);
          if (currentDisplayCube) {
            currentDisplayCube.isInKitchenDisplay = false;
          }
          cube.isInKitchenDisplay = true;
        }

        // On cherche le cube original correspondant par son ID
        const originalCube = this.cubes.find(c => c.id === cube.originalCubeId);
        if (originalCube) {
          originalCube.find = true; // On s'assure qu'il est bien marqué comme trouvé
          this.saveCubesState();
        }
        this.saveDiscoveredCubesState();
      }
    },
    releaseDiscoveredCube(cubeId) {
      const cube = this.discoveredCubes.find(c => c.id === cubeId);
      if (cube) {
        cube.isStored = false;
        cube.isInKitchenBag = false;
        cube.isInKitchenDisplay = false;
        this.saveDiscoveredCubesState();
      }
    },
    saveCubesState() {
      const stringifiedData = JSON.stringify(this.cubes);
      const encryptedData = CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
      localStorage.setItem('cubes', encryptedData);
    },
    saveDiscoveredCubesState() {
      const stringifiedData = JSON.stringify(this.discoveredCubes);
      const encryptedData = CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
      localStorage.setItem('discoveredCubes', encryptedData);
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

.background-app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
}
.home-container {
  position: relative;
}


</style>
