
<template>
  <LoadingScreen v-if="isLoading" />
  <template v-else>
    <ResultViewer v-model:visible="resultViewerVisible" :img-src="resultViewerImgSrc" :show-retrieve-button="isKitchenResult" :show-download-button="!isKitchenResult" @retrieve="handleRetrieveResult" />
    <Glossary :cubes="cubes" @spawn-from-glossary="spawnDiscoveredCube" />
    <EncryptedImage
      src="assets/sprite/background.png"
      class="background-app"
      alt="background"/>
    <header v-show="pageMenu == 0">
      <EncryptedImage alt="logo_ronge_bois"
        class="logo"
        src="assets/sprite/ronge_bois_symbole.png"
        width="250"
        height="auto"
        @click="pageMenu = 2"
      />

      <EncryptedImage alt="logo_petit_chaudron"
        class="logo"
        src="assets/sprite/petit_chaudron.png"
        width="250"
        height="auto"
        @click="pageMenu = 3"
      />
    </header>

    <main>
      <div v-show="pageMenu == 0" class="home-container">
        <EncryptedImage
          src="assets/sprite/book_boiserie.png"
          alt="Book Cover"
          class="book-cover"
          width="400"
          height="600"
          @click="pageMenu = 1"
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
        v-show="pageMenu == 1"
        @close-book="receiveEmit"
        @page-changed="updateCurrentBookPage"
        @discovered="spawnDiscoveredCube"
        :cubes="cubes"
        @state-changed="saveCubesState"
        :current-book-page="currentBookPage"
      />
      <ReadMe
        v-show="pageMenu == 2"
        @close-book="receiveEmit"
      />
      <Kitchen
        v-show="pageMenu == 3"
        :is-visible="pageMenu == 3"
        @close-book="receiveEmit"

        :kitchen-bag-cubes="kitchenBagCubes"
        :kitchen-display-cube="kitchenDisplayCube"
        :kitchen-receptacle-cube="kitchenReceptacleCube"
        :kitchen-outil-cube="kitchenOutilCube"
        :kitchen-rune-cube="kitchenRuneCube"
        :kitchen-carburant-cube="kitchenCarburantCube"

        @release-discovered-cube="releaseDiscoveredCube"
        @drop-on-zone="storeDiscoveredCube"
        @open-result-viewer="handleOpenResultViewer"
      />
    <SpecialCube
        :cubes="cubes"
        :stored-discovered-cubes="storedDiscoveredCubes"
        @release-discovered-cube="releaseDiscoveredCube"
    />
      <!-- Affiche tous les cubes "libres" (ni stockés, ni dans la cuisine) -->
      <DiscoveredCube v-for="cube in freeDiscoveredCubes" :key="cube.id" :original-cube-id="cube.originalCubeId" :img-src="cube.img_src" :cube-id="cube.id" @stored="storeDiscoveredCube" @inspect="handleInspectCube" :is-loupe-mode-active="isLoupeModeActive" />
  </main>
</template>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import BookPages from './BookPages.vue';
import ReadMe from './ReadMe.vue';
import Kitchen from './Kitchen.vue';
import Cube from './Cube.vue';
import SpecialCube from './SpecialCube.vue';
import DiscoveredCube from './DiscoveredCube.vue';
import EncryptedImage from './EncryptedImage.vue';
import CryptoJS from 'crypto-js';
import ResultViewer from './ResultViewer.vue';
import Glossary from './Glossary.vue';

import LoadingScreen from './LoadingScreen.vue';
import { preloadImages } from './image-service.js';
import { recipes } from './recipes.js';
import { pageImages } from './pages.js';

// Récupère la clé secrète depuis les variables d'environnement.
const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY;

// --- State ---
const isLoading = ref(true);
const pageMenu= ref(0);
const cubes = ref([]); // Sera chargé de manière asynchrone
const currentBookPage = ref(-1); // -1 signifie que le livre est fermé
const discoveredCubes = ref([]);
const resultViewerVisible = ref(false);
const resultViewerImgSrc = ref(null);
const isLoupeModeActive = ref(false);
const isKitchenResult = ref(false); // Pour savoir si la visionneuse affiche un résultat de cuisine

// --- Computed properties ---
const freeDiscoveredCubes = computed(() => {
  return discoveredCubes.value.filter(c => !c.isStored && !c.isInKitchenBag && !c.isInKitchenDisplay && !c.isInKitchenReceptacle && !c.isInKitchenOutil && !c.isInKitchenRune && !c.isInKitchenCarburant);
});

const homeCubes = computed(() => {
  return cubes.value.filter(cube => (cube.page === undefined || cube.page === null) && !cube.isInInventory && cube.disp);
});

const storedDiscoveredCubes = computed(() => {
  return discoveredCubes.value.filter(c => c.isStored);
});

const kitchenBagCubes = computed(() => {
  return discoveredCubes.value.filter(c => c.isInKitchenBag);
});

const kitchenDisplayCube = computed(() => {
  return discoveredCubes.value.find(c => c.isInKitchenDisplay);
});

const kitchenReceptacleCube = computed(() => {
  return discoveredCubes.value.find(c => c.isInKitchenReceptacle);
});

const kitchenOutilCube = computed(() => {
  return discoveredCubes.value.find(c => c.isInKitchenOutil);
});

const kitchenRuneCube = computed(() => {
  return discoveredCubes.value.find(c => c.isInKitchenRune);
});

const kitchenCarburantCube = computed(() => {
  return discoveredCubes.value.find(c => c.isInKitchenCarburant);
});

// --- Methods ---
function handleGlobalKeyDown(event) {
  if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
    return;
  }
  if (event.key.toLowerCase() === 'l') {
    isLoupeModeActive.value = !isLoupeModeActive.value;
    document.body.classList.toggle('loupe-cursor', isLoupeModeActive.value);
  }
}

async function loadEncryptedCubes() {
  try {
    const response = await fetch('assets-encrypted/cubes.enc');
    const encryptedText = await response.text();
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      console.error("Le fichier de configuration des cubes est vide après déchiffrement.");
      return null;
    }
    const executableCode = decryptedText.replace('export ', '');
    const getCubes = new Function(`${executableCode}; return cubesinfos;`);
    return getCubes();
  } catch (error) {
    console.error("Erreur lors du chargement ou du déchiffrement de la configuration des cubes:", error);
    return null;
  }
}

function receiveEmit() {
  pageMenu.value = 0;
  currentBookPage.value = -1;
}

function updateCurrentBookPage(pageIndex) {
  currentBookPage.value = pageIndex;
}

function saveCubesState() {
  const stringifiedData = JSON.stringify(cubes.value);
  const encryptedData = CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
  localStorage.setItem('cubes', encryptedData);
}

function saveDiscoveredCubesState() {
  const stringifiedData = JSON.stringify(discoveredCubes.value);
  const encryptedData = CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
  localStorage.setItem('discoveredCubes', encryptedData);
}

function spawnDiscoveredCube(cubeData) {
  const newId = `dc-${Date.now()}`;
  discoveredCubes.value.push({ id: newId, originalCubeId: cubeData.id, isStored: false, isInKitchenBag: false, isInKitchenDisplay: false, isInKitchenReceptacle: false, isInKitchenOutil: false, isInKitchenRune: false, isInKitchenCarburant: false, img_src: cubeData.img_src, type: cubeData.type });

  const originalCube = cubes.value.find(c => c.id === cubeData.id);
  if (originalCube) {
    originalCube.find = true;
    saveCubesState();
  }

  saveDiscoveredCubesState();
  console.log('Nouveau DiscoveredCube créé !', newId);
}

function checkRecipes() {
  const currentIngredients = {
    kitchenReceptacle: kitchenReceptacleCube.value ? kitchenReceptacleCube.value.originalCubeId : null,
    kitchenBag: discoveredCubes.value.filter(c => c.isInKitchenBag).map(c => c.originalCubeId),
    kitchenOutil: kitchenOutilCube.value ? kitchenOutilCube.value.originalCubeId : null,
    kitchenRune: kitchenRuneCube.value ? kitchenRuneCube.value.originalCubeId : null,
    kitchenCarburant: kitchenCarburantCube.value ? kitchenCarburantCube.value.originalCubeId : null,
  };

  for (const recipe of recipes) {
    const { ingredients, result, secret, discover } = recipe;

    const receptacleMatch = ingredients.kitchenReceptacle === currentIngredients.kitchenReceptacle;
    const outilMatch = ingredients.kitchenOutil === currentIngredients.kitchenOutil;
    const runeMatch = ingredients.kitchenRune === currentIngredients.kitchenRune;
    const carburantMatch = ingredients.kitchenCarburant === currentIngredients.kitchenCarburant;

    const bagMatch = ingredients.kitchenBag.length === currentIngredients.kitchenBag.length &&
      ingredients.kitchenBag.every(ing => currentIngredients.kitchenBag.includes(ing));

    if (receptacleMatch && outilMatch && runeMatch && carburantMatch && bagMatch) {
      console.log(`Recette "${recipe.name}" réussie !`);

      const ingredientCubes = discoveredCubes.value.filter(c =>
        c.isInKitchenReceptacle || c.isInKitchenBag || c.isInKitchenOutil || c.isInKitchenRune || c.isInKitchenCarburant
      );
      discoveredCubes.value = discoveredCubes.value.filter(c => !ingredientCubes.includes(c));

      const newId = `dc-${Date.now()}`;
      discoveredCubes.value.push({
        id: newId,
        originalCubeId: result.originalCubeId,
        img_src: result.img_src,
        type: result.type,
        isInKitchenDisplay: true,
      });

      const originalCube = cubes.value.find(c => c.id === result.originalCubeId);
      if (originalCube) {
        originalCube.find = true;
        saveCubesState();
      }

      if (secret && secret.length > 0) {
        secret.forEach(secretCubeId => {
          const cubeToReveal = cubes.value.find(c => c.id === secretCubeId);
          if (cubeToReveal) {
            cubeToReveal.disp = true;
            console.log(`Cube secret "${secretCubeId}" révélé !`);
          }
        });
        saveCubesState();
      }

      if (discover && discover.length > 0) {
        discover.forEach(discoverCubeId => {
          const cubeToDiscover = cubes.value.find(c => c.id === discoverCubeId);
          if (cubeToDiscover) {
            cubeToDiscover.find = true;
            console.log(`Cube "${discoverCubeId}" marqué comme découvert !`);
          }
        });
        saveCubesState();
      }
      saveDiscoveredCubesState();
      return;
    }
  }
}

function storeDiscoveredCube({ cubeId, zone }) {
  const cube = discoveredCubes.value.find(c => c.id === cubeId);
  if (cube) {
    if (zone !== 'mainBag' && zone !== 'kitchenDisplay' && cube.type !== zone) {
      return;
    }
    cube.isStored = false;
    cube.isInKitchenBag = false;
    cube.isInKitchenDisplay = false;
    cube.isInKitchenReceptacle = false;
    cube.isInKitchenOutil = false;
    cube.isInKitchenRune = false;
    cube.isInKitchenCarburant = false;

    if (zone === 'mainBag') {
      cube.isStored = true;
    } else if (zone === 'kitchenDisplay') {
      if (cube.type === 'result') {
        const currentDisplayCube = discoveredCubes.value.find(c => c.isInKitchenDisplay && c.id !== cube.id);
        if (currentDisplayCube) {
          currentDisplayCube.isInKitchenDisplay = false;
        }
        cube.isInKitchenDisplay = true;
      }
    } else if (zone === 'kitchenBag') {
      cube.isInKitchenBag = true;
    } else if (zone === 'kitchenReceptacle') {
      const currentReceptacleCube = discoveredCubes.value.find(c => c.isInKitchenReceptacle && c.id !== cube.id);
      if (currentReceptacleCube) {
        currentReceptacleCube.isInKitchenReceptacle = false;
      }
      cube.isInKitchenReceptacle = true;
    } else if (zone === 'kitchenOutil') {
      const currentOutilCube = discoveredCubes.value.find(c => c.isInKitchenOutil && c.id !== cube.id);
      if (currentOutilCube) {
        currentOutilCube.isInKitchenOutil = false;
      }
      cube.isInKitchenOutil = true;
    } else if (zone === 'kitchenRune') {
      const currentRuneCube = discoveredCubes.value.find(c => c.isInKitchenRune && c.id !== cube.id);
      if (currentRuneCube) {
        currentRuneCube.isInKitchenRune = false;
      }
      cube.isInKitchenRune = true;
    } else if (zone === 'kitchenCarburant') {
      const currentCarburantCube = discoveredCubes.value.find(c => c.isInKitchenCarburant && c.id !== cube.id);
      if (currentCarburantCube) {
        currentCarburantCube.isInKitchenCarburant = false;
      }
      cube.isInKitchenCarburant = true;
    }

    const originalCube = cubes.value.find(c => c.id === cube.originalCubeId);
    if (originalCube) {
      originalCube.find = true;
      saveCubesState();
    }
    saveDiscoveredCubesState();
    checkRecipes();
  }
}

function handleOpenResultViewer(cubeData) {
  isKitchenResult.value = true;
  resultViewerImgSrc.value = cubeData.img_src;
  resultViewerVisible.value = true;
}

function handleInspectCube(cubeData) {
  isKitchenResult.value = false;
  resultViewerImgSrc.value = cubeData.imgSrc;
  resultViewerVisible.value = true;
}

function releaseDiscoveredCube(cubeId) {
  const cube = discoveredCubes.value.find(c => c.id === cubeId);
  if (cube) {
    cube.isStored = false;
    cube.isInKitchenBag = false;
    cube.isInKitchenDisplay = false;
    cube.isInKitchenReceptacle = false;
    cube.isInKitchenOutil = false;
    cube.isInKitchenRune = false;
    cube.isInKitchenCarburant = false;
    saveDiscoveredCubesState();
  }
}

function handleRetrieveResult() {
  if (kitchenDisplayCube.value) {
    releaseDiscoveredCube(kitchenDisplayCube.value.id);
  }
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  // 1. Charger et déchiffrer la configuration des cubes en premier.
  const cubesinfos = await loadEncryptedCubes();

  // 2. Extraire les chemins des images des cubes.
  const cubeImagePaths = cubesinfos ? cubesinfos.map(cube => cube.img_src).filter(Boolean) : [];

  const staticUIImages = [
    'assets/sprite/background.png', 'assets/sprite/ronge_bois_symbole.png', 'assets/sprite/petit_chaudron.png',
    'assets/sprite/book_boiserie.png', 'assets/sprite/arrow.png', 'assets/sprite/loop.png',
    'assets/block/block_I_vide.png', 'assets/block/block_B_vide.png', 'assets/block/block_Re_vide.png',
    'assets/block/block_O_vide.png', 'assets/block/block_ru_vide.png', 'assets/block/block_C_vide.png',
    'assets/loading_the_castor.gif'
  ];

  // 3. Créer une liste complète de toutes les images à précharger.
  const allImages = [...pageImages, ...staticUIImages, ...cubeImagePaths];

  // 4. Lancer le préchargement et attendre la fin.
  await preloadImages(allImages);

  // 5. Initialiser le reste de l'état.
  if (cubesinfos) {
    cubes.value = JSON.parse(JSON.stringify(cubesinfos));

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

    const savedOriginalsState = new Map();
    if (savedCubesString) {
      const parsedSavedCubes = JSON.parse(savedCubesString);
      parsedSavedCubes.forEach(cube => {
        if (cube && cube.id) {
          savedOriginalsState.set(cube.id, { find: cube.find, disp: cube.disp });
        }
      });
    }

    cubes.value.forEach(cube => {
      const savedState = savedOriginalsState.get(cube.id);
      if (savedState) {
        cube.find = savedState.find || false;
        if (savedState.disp === true) {
          cube.disp = true;
        }
      }
    });

    let savedDiscoveredCubesData = [];
    if (savedDiscoveredCubesString) {
      savedDiscoveredCubesData = JSON.parse(savedDiscoveredCubesString);
    }

    const storedDiscovered = savedDiscoveredCubesData.filter(c => c.isStored || c.isInKitchenBag || c.isInKitchenDisplay || c.isInKitchenReceptacle || c.isInKitchenOutil || c.isInKitchenRune || c.isInKitchenCarburant);
    discoveredCubes.value = storedDiscovered;
  }

  isLoading.value = false;

  nextTick(() => {
    document.addEventListener('contextmenu', event => event.preventDefault());
  });

  window.addEventListener('keydown', handleGlobalKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown);
});
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
.loupe-cursor { /* Cette règle est dans le style scoped, elle peut être moins prioritaire */
  cursor: url('/assets/sprite/loup.png') 0 0, auto;
}

</style>
<style>
/* Style global pour le curseur en mode loupe */
.loupe-cursor, .loupe-cursor * {
  cursor: url('/assets/sprite/loup.png') 0 0, auto !important;
}
</style>
