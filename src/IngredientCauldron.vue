<template>
  <div id="ingredient-cauldron" :style="cauldronStyle">
    <span class="button-icon">🔥</span>
    <div class="cubes-display-area">
      <CauldronCube
        v-for="(cube, index) in cubes"
        :key="cube.id"
        :img-src="cube.img_src"
        :index="index"
      />
    </div>
  </div>
</template>

<script>
import CauldronCube from './CauldronCube.vue';

export default {
  name: 'IngredientCauldron',
  components: { CauldronCube },
  props: {
    style: {
      type: Object,
      required: true,
    },
  },
  computed: {
    cubes() {
      // Cette prop sera passée depuis Kitchen.vue
      return this.$attrs.cubes || [];
    },
    cauldronStyle() {
      // On fusionne le style de positionnement avec le style de base du chaudron
      return {
        ...this.style,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        width: '60px', // Légèrement plus grand pour se démarquer
        height: '60px',
        borderRadius: '50%',
        cursor: 'copy', // Curseur pour indiquer une zone de dépôt
        border: '3px solid #ff4500',
        backgroundColor: '#f0e0c0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
      };
    },
  },
};
</script>

<style scoped>
.button-icon {
  font-size: 30px;
  line-height: 1;
}

/* Ajout d'une petite animation pour attirer l'attention */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 69, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 69, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 69, 0, 0); }
}
#ingredient-cauldron {
  animation: pulse 2s infinite;
}

.cubes-display-area {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>