
<template>
  <LoadingScreen v-if="isLoading" />
  <template v-else>
    <ResultViewer v-model:visible="resultViewerVisible" :img-src="resultViewerImgSrc" :show-retrieve-button="isKitchenResult" :show-download-button="!isKitchenResult" @retrieve="handleRetrieveResult" />
    <Glossary :cubes="cubesDefined" @spawn-from-glossary="spawnDiscoveredCube" />
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
        
      />
    </header>

    <main>
      <div v-show="pageMenu == 0" class="home-container">
      </div>
      <BookPages
        v-show="pageMenu == 1"
        @close-book="receiveEmit"
        @page-changed="updateCurrentBookPage"
        @discovered="spawnDiscoveredCube"
        :cubes="cubesDefined"
        @state-changed="saveCubesDefinedState"
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
        :cubes="cubesDefined"
        :stored-discovered-cubes="storedCubesAnimated"
        @release-discovered-cube="releaseDiscoveredCube"
    />
      <!-- Affiche tous les cubes "libres" (ni stockés, ni dans la cuisine) -->
      <DiscoveredCube v-for="cube in freeCubesAnimated" :key="cube.id" :original-cube-id="cube.originalCubeId" :img-src="cube.img_src" :cube-id="cube.id" @stored="storeDiscoveredCube" @inspect="handleInspectCube" :is-loupe-mode-active="isLoupeModeActive" />
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
const cubesDefined = ref([]); // Sera chargé de manière asynchrone
const currentBookPage = ref(-1); // -1 signifie que le livre est fermé
const resultViewerVisible = ref(false);
const resultViewerImgSrc = ref(null);
const isLoupeModeActive = ref(false);
const isKitchenResult = ref(false); // Pour savoir si la visionneuse affiche un résultat de cuisine

// --- Computed properties ---
const allInstances = computed(() => {
  return cubesDefined.value.flatMap(cube => 
    cube.instances.map(instance => ({
      ...instance,
      originalCubeId: cube.id,
      img_src: cube.img_src,
      type: cube.type
    }))
  );
});

const freeCubesAnimated = computed(() => {
  return allInstances.value.filter(instance => instance.location === 'free');
});

const homeCubes = computed(() => {
  return cubesDefined.value.filter(cube => (cube.page === undefined || cube.page === null) && !cube.isInInventory && cube.disp);
});

const storedCubesAnimated = computed(() => {
  return allInstances.value.filter(instance => instance.location === 'stored');
});

const kitchenBagCubes = computed(() => {
  return allInstances.value.filter(instance => instance.location === 'kitchenBag');
});

const kitchenDisplayCube = computed(() => {
  return allInstances.value.find(instance => instance.location === 'kitchenDisplay');
});

const kitchenReceptacleCube = computed(() => {
  return allInstances.value.find(instance => instance.location === 'kitchenReceptacle');
});

const kitchenOutilCube = computed(() => {
  return allInstances.value.find(instance => instance.location === 'kitchenOutil');
});

const kitchenRuneCube = computed(() => {
  return allInstances.value.find(instance => instance.location === 'kitchenRune');
});

const kitchenCarburantCube = computed(() => {
  return allInstances.value.find(instance => instance.location === 'kitchenCarburant');
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

function saveCubesDefinedState() {
  const stringifiedData = JSON.stringify(cubesDefined.value);
  const encryptedData = CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
  localStorage.setItem('cubesDefined', encryptedData);
}



function spawnDiscoveredCube(cubeData) {
  const originalCube = cubesDefined.value.find(c => c.id === cubeData.id);
  if (originalCube) {
    const newId = `dc-${Date.now()}`;
    originalCube.instances.push({
      id: newId,
      location: 'free', // 'free' is the default location
    });
    originalCube.find = true;
    saveCubesDefinedState();
    console.log('Nouveau DiscoveredCube créé !', newId);
  }
}

function checkRecipes() {
  const currentIngredients = {
    kitchenReceptacle: kitchenReceptacleCube.value ? kitchenReceptacleCube.value.originalCubeId : null,
    kitchenBag: kitchenBagCubes.value.map(c => c.originalCubeId),
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

      // Remove consumed ingredients
      const locationsToClear = ['kitchenReceptacle', 'kitchenBag', 'kitchenOutil', 'kitchenRune', 'kitchenCarburant'];
      cubesDefined.value.forEach(cubeDef => {
        cubeDef.instances = cubeDef.instances.filter(inst => !locationsToClear.includes(inst.location));
      });

      // Add result cube instance
      const resultCubeDef = cubesDefined.value.find(c => c.id === result.originalCubeId);
      if (resultCubeDef) {
        const newId = `dc-${Date.now()}`;
        resultCubeDef.instances.push({
          id: newId,
          location: 'kitchenDisplay',
        });
        resultCubeDef.find = true;
        saveCubesDefinedState();
        console.log('Nouveau DiscoveredCube créé !', newId);
      }

      // Handle secret and discover
      if (secret && secret.length > 0) {
        secret.forEach(secretCubeId => {
          const cubeToReveal = cubesDefined.value.find(c => c.id === secretCubeId);
          if (cubeToReveal) {
            cubeToReveal.disp = true;
            console.log(`Cube secret "${secretCubeId}" révélé !`);
          }
        });
      }

      if (discover && discover.length > 0) {
        discover.forEach(discoverCubeId => {
          const cubeToDiscover = cubesDefined.value.find(c => c.id === discoverCubeId);
          if (cubeToDiscover) {
            cubeToDiscover.find = true;
            console.log(`Cube "${discoverCubeId}" marqué comme découvert !`);
          }
        });
      }

      saveCubesDefinedState();
      return;
    }
  }
}

function storeDiscoveredCube({ cubeId, zone }) {
  let targetInstance = null;
  let originalCubeOfInstance = null;

  // Find the instance and its parent cube definition
  for (const cubeDef of cubesDefined.value) {
    const foundInstance = cubeDef.instances.find(inst => inst.id === cubeId);
    if (foundInstance) {
      targetInstance = foundInstance;
      originalCubeOfInstance = cubeDef;
      break;
    }
  }

  if (!targetInstance) return;

  // Type validation check
  if (zone !== 'mainBag' && originalCubeOfInstance.type !== zone) {
    return;
  }

  // For single-occupancy zones, free up the spot first.
  if (zone === 'kitchenDisplay' || zone === 'kitchenReceptacle' || zone === 'kitchenOutil' || zone === 'kitchenRune' || zone === 'kitchenCarburant') {
    for (const cubeDef of cubesDefined.value) {
      for (const inst of cubeDef.instances) {
        if (inst.location === zone && inst.id !== cubeId) {
          inst.location = 'free';
        }
      }
    }
  }
  
  // Assign the new location
  if (zone === 'mainBag') {
    targetInstance.location = 'stored';
  } else {
    targetInstance.location = zone;
  }

  // Mark the original cube definition as found
  originalCubeOfInstance.find = true;

  saveCubesDefinedState();
  checkRecipes();
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

function releaseDiscoveredCube(cubeId, originalCubeId) {
  const instance = cubesDefined.value.map(cubeDef => cubeDef.instances.find(inst => inst.id === cubeId)).find(inst => inst !== undefined);
  //cubesDefined.valuefind(cubeDef => cubeDef.id === originalCubeId).instances.find(inst => inst.id === cubeId);
    if (instance) {
      instance.location = 'free';
      saveCubesDefinedState();
      return; // Exit after finding and updating
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
    'assets/sprite/background.png', 'assets/sprite/ronge_bois_symbole.png', 'assets/sprite/petit_chaudron.png', 'assets/sprite/sac_de_jute_1.png', 'assets/sprite/sac_de_jute_2.png',
    'assets/sprite/book_boiserie.png', 'assets/sprite/arrow.png', 'assets/sprite/loup.png', 'assets/sprite/clou.png', 'assets/sprite/planche_a_glossaire.png',
    'assets/block/block_I_vide.png', 'assets/block/block_B_vide.png', 'assets/block/block_Re_vide.png', 'assets/block/block_V_pageVoid.png',
    'assets/block/block_O_vide.png', 'assets/block/block_ru_vide.png', 'assets/block/block_C_vide.png', 'assets/block/block_V_cubeVoid.png',
  ];

  // 3. Créer une liste complète de toutes les images à précharger.
  const allImages = [...pageImages, ...staticUIImages, ...cubeImagePaths];

  // 4. Lancer le préchargement et attendre la fin.
  await preloadImages(allImages);

  // 5. Initialiser le reste de l'état.
  if (cubesinfos) {
    cubesDefined.value = JSON.parse(JSON.stringify(cubesinfos));

    const encryptedCubes = localStorage.getItem('cubesDefined');

    let savedCubesString = null;
    if (encryptedCubes) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedCubes, SECRET_KEY);
        savedCubesString = bytes.toString(CryptoJS.enc.Utf8);
      } catch (e) { console.error("Erreur de déchiffrement pour 'cubesDefined'", e); }
    }

    const savedOriginalsState = new Map();
    if (savedCubesString) {
      const parsedSavedCubes = JSON.parse(savedCubesString);
      parsedSavedCubes.forEach(cube => {
        if (cube && cube.id) {
          savedOriginalsState.set(cube.id, cube);
        }
      });
    }

    cubesDefined.value.forEach(cube => {
      const savedCube = savedOriginalsState.get(cube.id);
      if (savedCube) {
        cube.find = savedCube.find || false;
        if (savedCube.disp === true) {
          cube.disp = true;
        }
        if (savedCube.instances) {
          cube.instances = savedCube.instances.filter(inst => inst.location !== 'free');
        } else {
          cube.instances = [];
        }
      }
    });
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
  cursor: url('assets/sprite/loup.png') 0 0, auto;
}

</style>
<style>
/* Style global pour le curseur en mode loupe */
.loupe-cursor, .loupe-cursor * {
  cursor: url('assets/sprite/loup.png') 0 0, auto !important;
}
</style>
