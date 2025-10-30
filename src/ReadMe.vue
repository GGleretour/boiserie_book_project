<template>
    <div id="readme_container">
      <div class="config-container">
        <button class="close-button" @click="close">Close</button>
      </div>
    <EncryptedImage
        id="readme_page"
        src="assets/page/page_vide_from_book.png"
        alt="read me page"
        width="600"
        height="auto"
        />
</div>

</template>

<script>
import EncryptedImage from './EncryptedImage.vue';

export default {
    components: { EncryptedImage },
    methods: {
    close() {
      this.$emit('close-book');
    },
    nextPage() {
      if (this.currentPage < this.pages.length - 1) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
  },
};
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
#discord_link {
    color: blue;

}

#text_container {
    z-index: 2;
    /* position:fixed, top, left have been removed to follow the flex layout */
}

.config-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}

.close-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #e02929; /* Green */
  color: white;
  border: none;
  border-radius: 5px;
}


</style>