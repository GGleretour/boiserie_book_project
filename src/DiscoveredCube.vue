<template>
  <div
    class="discovered-cube-container"
    :style="cubeStyle"
    @mousedown.stop="startDrag"
  >
    <EncryptedImage
      alt="discovered-cube"
      :src="encryptedImgSrc"
      draggable="false"
    />
  </div>
</template>

<script>
import EncryptedImage from './EncryptedImage.vue';
// --- Constantes pour la physique de l'animation ---
const GRAVITY = 0.3;
const DAMPING = 0.8;

export default {
  name: 'DiscoveredCube',
  components: { EncryptedImage },
  props: {
    isInInventory: {
      type: Boolean,
      default: false,
    },
    imgSrc: {
      type: String,
      default: './assets/ronge_bois_symbole.png' // Une image par défaut
    },
    cubeId: {
      type: String,
      required: true,
    },
    originalCubeId: {
      type: String,
      required: true,
    },
    inventoryFloorWidth: {
      type: Number,
      default: null,
    },
    inventoryCeiling: {
      type: Number,
      default: 0, // 0 par défaut, ce qui correspond au haut du conteneur
    },
    inventoryFloor: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      // --- Données de l'élément ---
      width: '100px',
      height: '100px',

      // --- État de la physique et du déplacement ---
      currentLeft: window.innerWidth / 2,
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
        width: this.isInInventory ? `${parseInt(this.width, 10) / 3}px` : this.width,
        height: this.isInInventory ? `${parseInt(this.height, 10) / 3}px` : this.height,
        cursor: this.isDragging ? 'grabbing' : 'grab',
        position: this.isInInventory ? 'absolute' : 'fixed',
        transform: 'translate(-50%, -50%)',
      };
    },
    encryptedImgSrc() {
      if (!this.imgSrc) return '';
      return this.imgSrc;
    }
  },
  mounted() {
    // Si le cube est créé directement dans l'inventaire, on initialise sa position au centre.
    if (this.isInInventory) {
      const parentRect = this.$el.parentElement.getBoundingClientRect();
      this.currentLeft = parentRect.width / 2;
      this.currentTop = parentRect.height / 2;
    }
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

    stopDrag(event) {
      if (!this.isDragging) return;
      this.isDragging = false;
      document.body.classList.remove('no-select');

      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.stopDrag);

      // Vérifie si le cube est lâché sur l'inventaire (SpecialCube)
      const inventoryEl = document.getElementById('special-cube-container');
      if (inventoryEl) {
        const rect = inventoryEl.getBoundingClientRect();
        if (!this.isInInventory && event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom) {
          this.$emit('stored', this.cubeId); // Emet un événement avec son ID
          return; // On arrête l'animation et la fonction
        } else if (this.isInInventory) {
          // Le cube est dans l'inventaire et est relâché dehors
          this.$emit('released', this.cubeId);
          return;
        }
      }

      this.animate();
    },

    animate() {
      if (this.isDragging) return;

      this.velocityY += GRAVITY;
      this.currentLeft += this.velocityX;
      this.currentTop += this.velocityY;

      // Les limites de rebond dépendent de si le cube est dans l'inventaire ou non
      const parentRect = this.isInInventory ? { width: this.inventoryFloorWidth || this.$el.parentElement.getBoundingClientRect().width, height: this.$el.parentElement.getBoundingClientRect().height } : { width: window.innerWidth, height: window.innerHeight };
      const floorWidth = parentRect.width; // La largeur de la zone de rebond
      const floorHeight = parentRect.height;

      const halfWidth = parseInt(this.width, 10) / 2;
      const halfHeight = parseInt(this.height, 10) / 2;

      const isGrounded = this.currentTop >= floorHeight - halfHeight;

      // Rebond sur les murs (gauche/droite) de la fenêtre
      if (this.currentLeft < halfWidth || this.currentLeft > floorWidth - halfWidth) {
        this.velocityX *= -1 * DAMPING; // Inverse la vitesse
        // Repositionne le cube juste à l'intérieur de la bordure pour éviter le "tunneling"
        this.currentLeft = Math.max(halfWidth, Math.min(this.currentLeft, floorWidth - halfWidth));
      }

      if (isGrounded) {
        this.velocityX *= DAMPING; // Applique la friction au sol
      }
      // Rebond sur le sol et le plafond de la fenêtre
      const effectiveFloor = this.isInInventory && this.inventoryFloor !== null ? this.inventoryFloor : floorHeight;
      if (this.currentTop < (this.isInInventory ? this.inventoryCeiling : halfHeight) || this.currentTop > effectiveFloor - halfHeight) {
        this.velocityY *= -1 * DAMPING; // Inverse la vitesse
        // Repositionne le cube juste à l'intérieur de la bordure pour éviter le "tunneling"
        if (this.currentTop > effectiveFloor - halfHeight) {
          this.currentTop = effectiveFloor - halfHeight;
        } else if (this.currentTop < halfHeight) {
          this.currentTop = halfHeight;
        }
      }

      requestAnimationFrame(this.animate);
    }
  }
};
</script>

<style scoped>
.discovered-cube-container {
  z-index: 998; /* Juste en dessous du special-cube-container */
  display: flex;
  align-items: center;
  justify-content: center;
}

.discovered-cube-container img {
  width: 80%;
  height: 80%;
  object-fit: contain;
  pointer-events: none;
}
</style>