<template>
  <div id="kitchen_container">
    <!-- Bouton de fermeture -->
     <CloseButton @close="$emit('close-book')"/>
    
    <div class="content-wrapper">
      <EncryptedImage
        id="kitchen_page"
        src="assets/page/page_vide_from_book.png"
        alt="kitchen page"
        width="600"
        height="auto"
        />
      <!-- Conteneur carré pour la disposition en étoile -->
      <KitchenStarLayoutContainer
        :kitchen-bag-cubes="kitchenBagCubes"
        :kitchen-display-cube="kitchenDisplayCube"
        :kitchen-receptacle-cube="kitchenReceptacleCube"
        :kitchen-outil-cube="kitchenOutilCube"
        :kitchen-rune-cube="kitchenRuneCube"
        :kitchen-carburant-cube="kitchenCarburantCube"
        :is-visible="isVisible"
        @drop-on-zone="$emit('drop-on-zone', $event)"
        @release-discovered-cube="$emit('release-discovered-cube', $event)"
      />
    </div>
  </div>
</template>

<script setup>
/* Import */
import EncryptedImage from './EncryptedImage.vue';
import CloseButton from '../components/CloseButton.vue';
import KitchenStarLayoutContainer from '../components/KitchenStarLayoutContainer.vue';
/* ----------------- */

/* Events */
const props = defineProps(['kitchenBagCubes', 'kitchenDisplayCube', 'kitchenReceptacleCube', 'kitchenOutilCube', 'kitchenRuneCube', 'kitchenCarburantCube', 'isVisible']);
const emit = defineEmits(['drop-on-zone', 'release-discovered-cube', 'close-book']);
/* ----------------- */
</script>

<style scoped>
/* KITCHEN STYLES */
#kitchen_container {
  z-index: 1;
  display: flex;
  padding-right: 0;
  flex-direction: column;
  align-items: left;
  padding: 20px;
}

.content-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* ----------------- */
</style>