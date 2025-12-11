<template>
  <OverlayComponent @close-Overlay="$emit('close-menu')">
    <CloseButton @close="$emit('close-menu')" />
    <EncryptedImage
      id="kitchen_page"
      src="assets/page/page_ninja_bois.png"
      alt="kitchen page"
      width="600"
      height="auto"
      class="ninja-bois-background"
    />
  </OverlayComponent>
</template>

<script setup>
import EncryptedImage from './EncryptedImage.vue';
import CloseButton from '../components/CloseButton.vue';
import OverlayComponent from '../components/OverlayComponent.vue';
defineEmits(['close-menu']);

</script>

<style scoped>
.ninja-bois-background {

  width: 100%;
  height: 100%;
  rotate: -90deg;
}
/* Positionne le bouton Close en haut du menu */
::v-deep(.config-container) {
  align-self: flex-start;
}
</style>