<template>
  <div
    class="cube-container" 
    :style="cubeStyle" v-if="!cubeData.find"
  >
    <EncryptedImage
      alt="cube"
      :src="encryptedImgSrc"
      @mousedown.stop="discover"
      draggable="false"
      />
  </div>
</template>
<script>
import EncryptedImage from './EncryptedImage.vue';

export default {
  components: { EncryptedImage },
  props: {
    /** Données du cube, incluant sa source d'image, sa position, et son état (trouvé ou non). */
    cubeData: {
      type: Object,
      required: true,
    },
    overrideSize: {
      type: String,
      default: null,
      note: "Permet de forcer une taille pour le cube (ex: '50px')."
    }
  },
  computed: {
    cubeStyle() {
      // Applique le style dynamiquement en fonction de l'état du cube.
      return {
        left: this.cubeData.x_out,
        top: this.cubeData.y_out,
        opacity: this.cubeData.find ? 1 : this.cubeData.opacity,
        width: this.overrideSize || this.cubeData.width,
        height: this.overrideSize || this.cubeData.height,
        position: 'absolute',
        cursor: 'pointer', // Change le curseur pour indiquer que c'est cliquable
      };
    },
    encryptedImgSrc() {
      if (!this.cubeData.img_src) return '';
      return this.cubeData.img_src;
    }
  },
  methods: {
    discover() {
      // Au clic, on marque le cube comme "trouvé" et on émet les événements.
      this.cubeData.find = true;
      this.$emit('state-changed');
      this.$emit('discovered', { id: this.cubeData.id, img_src: this.cubeData.img_src, type: this.cubeData.type });
    },
  }
};
</script>

<style scoped>
.cube-container {
  z-index: 3;
  display: flex;
  position: absolute;
  transform: translate(-50%, -50%);
}

.cube-container img {
  width: 100%;
  height: 100%;
  object-fit: fill; /* Ou 'fill' si vous voulez que l'image s'étire pour remplir le conteneur */
}

/*
  Cette règle est ajoutée globalement via JavaScript pendant le drag.
  Elle empêche le surlignage du texte et des images.
*/
::v-deep(.no-select) {
  user-select: none;
  -webkit-user-select: none; /* Pour Safari */
  -moz-user-select: none;    /* Pour Firefox */
}
</style>