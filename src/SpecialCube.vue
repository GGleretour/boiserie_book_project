<template>
  <div
    id="special-cube-container"
    :style="cubeStyle"
    @mousedown="startDrag"
  >
    <EncryptedImage
      alt="special-cube_back"
      src="assets/sprite/sac_de_jute_2.png"
      draggable="false"
      class="background-img"
    />
    <!-- Affiche les cubes découverts qui sont stockés à l'intérieur -->
    <DiscoveredCube
    v-for="cube in storedDiscoveredCubes"
    :key="`stored-${cube.id}`"
    :is-in-inventory="true"
    :cube-id="cube.id"
    :original-cube-id="cube.originalCubeId"
    :img-src="cube.img_src"
    :inventory-offset-left="85"
    :inventory-offset-right="75"
    :inventory-offset-top="95"
    :inventory-offset-bottom="105"
    @released="$emit('release-discovered-cube', cube.id)"
    />
    <EncryptedImage
      alt="special-cub-front"
      src="assets/sprite/sac_de_jute_1.png"
      draggable="false"
      class="background-img_2"
    />
  </div>
</template>

<script>
// --- Constantes pour la physique de l'animation ---
const GRAVITY = 0.50;
const DAMPING = 0.50;
import EncryptedImage from './EncryptedImage.vue';
import DiscoveredCube from './DiscoveredCube.vue';

export default {
  name: 'SpecialCube',
  components: { DiscoveredCube, EncryptedImage },
  props: {
    cubes: {
      type: Array,
      default: () => [],
    },
    storedDiscoveredCubes: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      // --- Données de l'élément ---
      width: '150px',
      height: '150px',

      // --- État de la physique et du déplacement ---
      currentLeft: window.innerWidth / 2, // Position initiale au centre
      currentTop: 100,
      velocityX: (Math.random() - 0.5) * 10,
      velocityY: (Math.random() - 0.5) * 5,
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
    };
  },
  computed: {
    cubeStyle() {
      return {
        left: `${this.currentLeft}px`,
        top: `${this.currentTop}px`,
        width: this.width,
        height: this.height,
        cursor: this.isDragging ? 'grabbing' : 'grab',
      };
    },
  },
  mounted() {
    this.animate();
  },
  methods: {
    startDrag(event) {
      event.preventDefault();
      this.isDragging = true;
      document.body.classList.add('no-select');

      this.dragOffset.x = event.clientX - this.currentLeft;
      this.dragOffset.y = event.clientY - this.currentTop;

      this.velocityX = 0;
      this.velocityY = 0;

      window.addEventListener('mousemove', this.onDrag);
      window.addEventListener('mouseup', this.stopDrag);
    },

    onDrag(event) {
      if (!this.isDragging) return;

      // Calcul de la nouvelle position
      this.velocityX = (event.clientX - this.dragOffset.x - this.currentLeft);
      this.velocityY = (event.clientY - this.dragOffset.y - this.currentTop);

      this.currentLeft = event.clientX - this.dragOffset.x;
      this.currentTop = event.clientY - this.dragOffset.y;
    },

    stopDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;
      document.body.classList.remove('no-select');

      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.stopDrag);

      this.animate();

    },

    animate() {
      if (this.isDragging) return;

      this.velocityY += GRAVITY;
      this.currentLeft += this.velocityX;
      this.currentTop += this.velocityY;

      const floorWidth = window.innerWidth;
      const floorHeight = window.innerHeight;

      const halfWidth = parseInt(this.width, 10) / 2;
      const halfHeight = parseInt(this.height, 10) / 2;

      const isGrounded = this.currentTop >= floorHeight - halfHeight;

      // Rebond sur les murs (gauche/droite) de la fenêtre
      if (this.currentLeft < halfWidth || this.currentLeft > floorWidth - halfWidth) {
        this.velocityX *= -1 * DAMPING;
        this.currentLeft = Math.max(halfWidth, Math.min(this.currentLeft, floorWidth - halfWidth));
      }

      if (isGrounded) {
        this.velocityX *= DAMPING; // Applique la friction au sol
      }
      // Rebond sur le sol et le plafond de la fenêtre
      if (this.currentTop < halfHeight || this.currentTop > floorHeight - halfHeight) {
        this.velocityY *= -1 * DAMPING;
        this.currentTop = Math.max(halfHeight, Math.min(this.currentTop, floorHeight - halfHeight));
      }

      requestAnimationFrame(this.animate);
    }
  }
};
</script>

<style scoped>
.special-cube-container, #special-cube-container {
  z-index: 999; /* z-index élevé pour être au-dessus des autres éléments */
  position: fixed; /* Important pour se positionner par rapport à la fenêtre */
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  z-index: 1; /* Arrière-plan */
}
.background-img_2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none; /* Permet de cliquer à travers pour attraper les cubes */
  z-index: 3; /* Premier plan, au-dessus des cubes */
}

/* Cible les cubes DÉCOUVERTS qui sont DANS ce conteneur */
::v-deep(.discovered-cube-container) {
  z-index: 2; /* Positionne les cubes entre les deux images du sac */
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