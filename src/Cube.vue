<template>
  <div
    class="cube-container" 
    :style="cubeStyle" v-if="!cubeData.find"
  >
    <EncryptedImage
      alt="cube"
      :src="cubeData.img_src.replace('/assets/', '/assets-encrypted/').replace(/\.(png|jpe?g|gif|svg)$/, '.$1.enc')"
      @mousedown.stop="startDrag"
      draggable="false"
      />
  </div>
</template>
<script>
// --- Constantes pour la physique de l'animation ---
import EncryptedImage from './EncryptedImage.vue';
const GRAVITY = 0.5; // Accélération verticale
const DAMPING = 0.8; // Facteur d'amortissement (0.8 = 80% de l'énergie conservée après un rebond).

export default {
  components: { EncryptedImage },
  props: {
    /** Données du cube, incluant sa source d'image, sa position, et son état (trouvé ou non). */
    cubeData: {
      type: Object,
      required: true,
    },
    floorWidth: {
      type: Number,
      default: 800, // Valeur par défaut pour la page d'accueil
      note: "Largeur de la zone de rebond.",
    },
    floorHeight: {
      type: Number,
      default: 920, // Valeur par défaut pour la page d'accueil
      note: "Hauteur de la zone de rebond.",
    },
    overrideSize: {
      type: String,
      default: null,
      note: "Permet de forcer une taille pour le cube (ex: '50px')."
    }
  },
  data() {
    return {
      // Position et vitesse locales pour l'animation
      currentLeft: 0,
      currentTop: 0,
      velocityX: 0,
      velocityY: 0,
      isDragging: false, // Pour savoir si le cube est en cours de déplacement
    };
  },
  computed: {
    cubeStyle() {
      // Applique le style dynamiquement en fonction de l'état du cube.
      return {
        left: this.isDragging ? `${this.currentLeft}px` : this.cubeData.x_out,
        top: this.isDragging ? `${this.currentTop}px` : this.cubeData.y_out,
        opacity: this.cubeData.find ? 1 : this.cubeData.opacity,
        width: this.overrideSize || this.cubeData.width,
        height: this.overrideSize || this.cubeData.height,
        position: this.isDragging ? 'fixed' : 'absolute',
    };
    }
  },
  created() {
    // Initialise la position du cube lors de sa création.
    // Si le cube est dans l'inventaire et a des coordonnées de départ, on les utilise.
    // Sinon, on utilise les coordonnées de base.
    this.currentLeft = (this.cubeData.isInInventory && this.cubeData.inventoryStartX) || parseInt(this.cubeData.x_out, 10);
    this.currentTop = (this.cubeData.isInInventory && this.cubeData.inventoryStartY) || parseInt(this.cubeData.y_out, 10);
  },
  methods: {
    startDrag(event) {
      // Empêche le comportement par défaut du navigateur (comme la sélection ou le glisser-déposer d'image)
      event.preventDefault();

      this.isDragging = true;
      // Arrête toute animation en cours
      // Empêche la sélection de texte/images pendant le drag
      document.body.classList.add('no-select');

      // Ajoute les écouteurs d'événements pour le déplacement et le relâchement
      window.addEventListener('mousemove', this.onDrag);
      window.addEventListener('mouseup', this.stopDrag);
    },

    onDrag(event) {
      if (!this.isDragging) return;

      // Met à jour la position du cube pour suivre le curseur de la souris.
      // Comme le cube est en 'position: fixed', on peut utiliser directement les coordonnées du client.
      this.currentLeft = event.clientX - (parseInt(this.cubeData.width) / 2);
      this.currentTop = event.clientY - (parseInt(this.cubeData.height) / 2);
    },

    stopDrag(event) {
      if (!this.isDragging) return;

      this.isDragging = false;

      // Au lieu de gérer l'inventaire ici, on émet simplement l'événement de découverte.
      // Le composant parent (App.vue) créera un DiscoveredCube qui gérera sa propre physique.
      this.cubeData.find = true;
      this.$emit('state-changed');
      this.$emit('discovered', { id: this.cubeData.id, img_src: this.cubeData.img_src });

      // Réactive la sélection de texte/images
      document.body.classList.remove('no-select');

      // Retire les écouteurs d'événements
      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.stopDrag);
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