<template>
    <div id="readme_container">
      <div class="config-container">
        <button class="close-button" @click="close">Close</button>
      </div>
    <EncryptedImage
        id="readme_page"
        src="/assets-encrypted/page.png.enc"
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
    position:absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
#discord_link {
    color: blue;

}

#text_container {
    z-index: 2;
    position:fixed;
    top: 10%;
    left: 10%;
}

.config-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
  gap: 20px; /* Espace entre les boutons */
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