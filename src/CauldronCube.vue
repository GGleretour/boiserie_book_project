<template>
  <div class="cauldron-cube" :style="style">
    <EncryptedImage :src="imgSrc" alt="cauldron-ingredient" />
  </div>
</template>

<script>
import EncryptedImage from './EncryptedImage.vue';

export default {
  name: 'CauldronCube',
  components: { EncryptedImage },
  props: {
    imgSrc: String,
    index: Number, // L'index du cube dans le chaudron pour le positionner
  },
  computed: {
    style() {
      // Positionne les cubes en cercle à l'intérieur du chaudron
      const angle = this.index * (360 / 5); // 5 cubes max visibles
      const radius = 12; // Rayon du cercle
      const x = radius * Math.cos((angle * Math.PI) / 180);
      const y = radius * Math.sin((angle * Math.PI) / 180);
      return {
        transform: `translate(${x}px, ${y}px)`,
      };
    },
  },
};
</script>

<style scoped>
.cauldron-cube {
  position: absolute;
  width: 25px; /* Petite taille pour les ingrédients */
  height: 25px;
  transition: transform 0.3s ease;
}
.cauldron-cube img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>