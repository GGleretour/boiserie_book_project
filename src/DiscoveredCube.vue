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
const DAMPING = 0.80;

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
      default: 'assets/ronge_bois_symbole.png' // Une image par défaut
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
    },
    // NOUVELLES PROPS pour des limites asymétriques depuis le centre
    inventoryOffsetLeft: {
      type: Number,
      default: null, // Distance du centre au mur GAUCHE
    },
    inventoryOffsetRight: {
      type: Number,
      default: null, // Distance du centre au mur DROIT
    },
    inventoryOffsetTop: {
      type: Number,
      default: null, // Distance du centre au mur HAUT (plafond)
    },
    inventoryOffsetBottom: {
      type: Number,
      default: null, // Distance du centre au mur BAS (sol)
    },
    inventoryCenterX: {
      type: Number,
      default: null, // Position X du centre de la zone de rebond
    },
    inventoryCenterY: {
      type: Number,
      default: null, // Position Y du centre de la zone de rebond
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
      animationFrameId: null, // Pour stocker l'ID de l'animation
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
  watch: {
    isInInventory(newValue, oldValue) {
      // Si le cube vient d'entrer dans un inventaire
      if (newValue === true && oldValue === false) {
        // On attend que le DOM soit mis à jour pour que le parentElement soit le bon
        this.$nextTick(() => {
          this.recenterInParent();
        });
      }
    }
  },
  created() {
    // --- Optimisation : Cache pour les dimensions du parent ---
    this.parentRectCache = null;
  },
  mounted() {
    // Si le cube est créé directement dans l'inventaire, on initialise sa position au centre.
    if (this.isInInventory) {
      this.$nextTick(() => {
        this.recenterInParent();
      });
    }
    this.animate();
  },
  beforeUnmount() {
    // On s'assure d'arrêter la boucle d'animation avant que le composant ne soit détruit.
    // C'est la clé pour corriger l'erreur.
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.stopDrag);
  },
  methods: {
    // --- NOUVELLE MÉTHODE D'OPTIMISATION ---
    // Met à jour le cache des dimensions du parent.
    updateParentRectCache() {
      if (this.isInInventory && this.$el.parentElement) {
        this.parentRectCache = this.$el.parentElement.getBoundingClientRect();
      }
    },

    // --- NOUVELLE MÉTHODE ---
    // Recalcule la position centrale du cube par rapport à son parent.
    recenterInParent() {
      if (this.isInInventory && this.$el.parentElement) {
        const parentRect = this.$el.parentElement.getBoundingClientRect();
        this.currentLeft = parentRect.width / 2;
        this.currentTop = parentRect.height / 2;
        this.updateParentRectCache(); // Met à jour le cache avec les bonnes dimensions
      }
    },
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
      const specialCubeEl = document.getElementById('special-cube-container');
      const kitchenBagEl = document.getElementById('kitchen-bag-zone');
      const kitchenDisplayEl = document.getElementById('kitchen-display-zone');
      const kitchenReceptacleEl = document.getElementById('kitchen-receptacle-zone');
      const kitchenOutilEl = document.getElementById('kitchen-outil-zone');
      const kitchenRuneEl = document.getElementById('kitchen-rune-zone');
      const kitchenCarburantEl = document.getElementById('kitchen-carburant-zone');


      const checkDropZone = (element, zoneName) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        if (!this.isInInventory && event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom) {
          this.$emit('stored', { cubeId: this.cubeId, zone: zoneName });
          return true; // Le cube a été déposé
        }
        return false;
      };

      if (
        checkDropZone(specialCubeEl, 'mainBag') ||
        checkDropZone(kitchenBagEl, 'kitchenBag') ||
        checkDropZone(kitchenDisplayEl, 'kitchenDisplay') ||
        checkDropZone(kitchenReceptacleEl, 'kitchenReceptacle') ||
        checkDropZone(kitchenOutilEl, 'kitchenOutil') ||
        checkDropZone(kitchenRuneEl, 'kitchenRune') ||
        checkDropZone(kitchenCarburantEl, 'kitchenCarburant')
      ) {
          this.updateParentRectCache(); // Met à jour le cache quand le cube est stocké
          return; // On arrête la fonction car le cube est stocké
        } else if (this.isInInventory) {
          // Le cube est dans l'inventaire et est relâché dehors
          this.$emit('released', this.cubeId);
          return;
        }

      this.animate();
    },

    animate() {
      if (this.isDragging) return;

      // --- UTILISATION DU CACHE ---
      // Si le cache n'existe pas (ex: au premier rendu), on le crée.
      if (this.isInInventory && !this.parentRectCache) {
        this.updateParentRectCache();
      }
      const parentHeight = this.isInInventory ? (this.parentRectCache ? this.parentRectCache.height : 0) : window.innerHeight;

      // --- OPTIMISATION ---
      // Si le cube est quasiment immobile, on arrête la boucle d'animation.
      if (Math.abs(this.velocityX) < 0.1 && Math.abs(this.velocityY) < 0.1 && this.currentTop >= (this.inventoryFloor || parentHeight) - (parseInt(this.height, 10) / 2) - 1) {
        return; // Arrête la boucle
      }

      this.velocityY += GRAVITY;
      this.currentLeft += this.velocityX;
      this.currentTop += this.velocityY;

      // Les limites de rebond dépendent de si le cube est dans l'inventaire ou non
      const parentRect = this.isInInventory ? { width: this.inventoryFloorWidth || (this.parentRectCache ? this.parentRectCache.width : 0), height: parentHeight } : { width: window.innerWidth, height: window.innerHeight };
      const floorWidth = parentRect.width; // La largeur de la zone de rebond
      const floorHeight = parentRect.height;

      const halfWidth = parseInt(this.width, 10) / 2;
      const halfHeight = parseInt(this.height, 10) / 2;

      // --- NOUVELLE LOGIQUE DE REBOND ASYMÉTRIQUE DEPUIS LE CENTRE ---
      const hasCustomBounds = this.inventoryOffsetLeft !== null || this.inventoryOffsetRight !== null || this.inventoryOffsetTop !== null || this.inventoryOffsetBottom !== null;

      if (this.isInInventory && hasCustomBounds) {
        const centerX = this.inventoryCenterX !== null ? this.inventoryCenterX : parentRect.width / 2;
        const centerY = this.inventoryCenterY !== null ? this.inventoryCenterY : parentRect.height / 2;

        // Rebond sur les murs gauche/droit
        if (this.inventoryOffsetLeft !== null && this.currentLeft < (centerX - this.inventoryOffsetLeft) + halfWidth) {
          this.velocityX *= -1 * DAMPING;
          this.currentLeft = (centerX - this.inventoryOffsetLeft) + halfWidth;
        }
        if (this.inventoryOffsetRight !== null && this.currentLeft > (centerX + this.inventoryOffsetRight) - halfWidth) {
          this.velocityX *= -1 * DAMPING;
          this.currentLeft = (centerX + this.inventoryOffsetRight) - halfWidth;
        }

        // Rebond sur le plafond/sol
        if (this.inventoryOffsetTop !== null && this.currentTop < (centerY - this.inventoryOffsetTop) + halfHeight) {
          this.velocityY *= -1 * DAMPING;
          this.currentTop = (centerY - this.inventoryOffsetTop) + halfHeight;
        }
        if (this.inventoryOffsetBottom !== null && this.currentTop > (centerY + this.inventoryOffsetBottom) - halfHeight) {
          this.velocityY *= -1 * DAMPING;
          this.currentTop = (centerY + this.inventoryOffsetBottom) - halfHeight;
          this.velocityX *= DAMPING; // Friction au sol
        }
      } else {
        // --- ANCIENNE LOGIQUE DE REBOND (pour le plein écran) ---
        const isGrounded = this.currentTop >= floorHeight - halfHeight;
        if (this.currentLeft < halfWidth || this.currentLeft > floorWidth - halfWidth) {
          this.velocityX *= -1 * DAMPING;
          this.currentLeft = Math.max(halfWidth, Math.min(this.currentLeft, floorWidth - halfWidth));
        }
        if (isGrounded) {
          this.velocityX *= DAMPING;
        }
        const effectiveFloor = this.isInInventory && this.inventoryFloor !== null ? this.inventoryFloor : floorHeight;
        if (this.currentTop < (this.isInInventory ? this.inventoryCeiling : halfHeight) || this.currentTop > effectiveFloor - halfHeight) {
          this.velocityY *= -1 * DAMPING;
          this.currentTop = Math.max((this.isInInventory ? this.inventoryCeiling : halfHeight), Math.min(this.currentTop, effectiveFloor - halfHeight));
        }
      }

      this.animationFrameId = requestAnimationFrame(this.animate);
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