<template>
  <div class="menu-overlay" @click.self="$emit('close-book')">
    <div class="menu-content">
      <!-- Bouton de fermeture -->
      <CloseButton @close="$emit('close-book')" />
      <EncryptedImage
        id="kitchen_page"
        src="assets/page/page_helpMe.png"
        alt="kitchen page"
        width="450"
        height="auto"
      />
    </div>
  </div>
</template>

<script setup>
import EncryptedImage from './EncryptedImage.vue';
import CloseButton from '../components/CloseButton.vue';
defineEmits(['close-book']);

</script>

<style scoped>
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* z-index élevé pour être au-dessus de tout */
}

.menu-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
}

/* Positionne le bouton Close en haut du menu */
::v-deep(.config-container) {
  align-self: flex-start;
}
</style>