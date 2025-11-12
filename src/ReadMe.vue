<template>
  <div id="readme_container">
    <CloseButton @close="$emit('close-book')"/>
    <EncryptedImage
      id="readme_page"
      src="assets/page/page_vide_from_book.png"
      alt="read me page"
      width="600"
      height="auto"
      />
  </div>
</template>

<script setup>
import CloseButton from '../components/CloseButton.vue';
import EncryptedImage from '../src/EncryptedImage.vue';

const emit = defineEmits(['close-book']);
</script>

<style scoped>
#readme_container {
  z-index: 1;
  display: flex;
  padding-right: 0;
  flex-direction: column;
  align-items: left;
  padding: 20px;
}
</style>