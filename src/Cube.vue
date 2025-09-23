<template>
  <div
    class="cube-container" 
    v-if="!cubeData.find"
    :style="cubeStyle"
  >
    <img
      alt="cube"
      :src="cubeData.img_src"
      @mousedown.stop="startDrag"
      draggable="false"
      />
  </div>
</template>
<script>
// --- Constantes pour la physique de l'animation ---
const GRAVITY = 0.5; // Accélération verticale
const DAMPING = 0.8; // Facteur d'amortissement (0.8 = 80% de l'énergie conservée après un rebond).

export default {
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
        // Utilise la position locale si le cube est trouvé
        left: this.cubeData.x_out, // Positionne le cube
        top: this.cubeData.y_out,
        opacity: this.cubeData.find ? 1 : this.cubeData.opacity,
        width: this.overrideSize || this.cubeData.width,
        height: this.overrideSize || this.cubeData.height,
        // Passe en position 'fixed' pendant le drag pour un positionnement fiable
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

      if (!this.cubeData.find) {
        this.cubeData.find = true;
        // On sauvegarde l'état 'find' du cube original dans le localStorage
        this.$emit('state-changed');
        // Emet un événement pour signaler qu'un cube a été découvert
        this.$emit('discovered', { id: this.cubeData.id, img_src: this.cubeData.img_src });
        // On n'a plus besoin de gérer le drag pour le cube original,
        // car il disparaît et est remplacé par le DiscoveredCube.
        // On arrête donc la fonction ici.
        return;
      }

      this.isDragging = true;
      // Arrête toute animation en cours
      this.velocityY = 0;
      this.velocityX = 0;

      // On ne réinitialise PAS la position ici, on la conserve.
      // La position sera mise à jour par onDrag.
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
      this.currentLeft = event.clientX;
      this.currentTop = event.clientY;
    },

    stopDrag(event) {
      if (!this.isDragging) return;

      this.isDragging = false;

      // Vérifie si le cube est lâché sur le SpecialCube (qui agit comme un inventaire)
      const inventoryEl = document.getElementById('special-cube-container');
      if (inventoryEl) {
        const rect = inventoryEl.getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom) { // Le cube est lâché DANS l'inventaire
          this.cubeData.isInInventory = true; // Marque le cube comme étant "contenu"
          // On stocke les coordonnées RELATIVES au conteneur pour l'initialisation du nouveau cube
          this.cubeData.inventoryStartX = event.clientX - rect.left;
          this.cubeData.inventoryStartY = event.clientY - rect.top;
        } else if (this.cubeData.isInInventory) {
          // Le cube était dans l'inventaire et est lâché DEHORS
          this.cubeData.isInInventory = false;
          // Réinitialise sa position là où la souris l'a lâché
          this.currentLeft = event.clientX;
          this.currentTop = event.clientY;
        }
      }

      // Réactive la sélection de texte/images
      document.body.classList.remove('no-select');

      // Retire les écouteurs d'événements
      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.stopDrag);

      // Initialise une vitesse aléatoire pour l'animation de chute
      this.velocityX = (Math.random() - 0.5) * 10;
      this.velocityY = (Math.random() - 0.5) * 5;

      // Démarre l'animation de chute
      this.animate();
    },

    /**
     * Gère la boucle d'animation pour la physique du cube (gravité et rebonds).
     */
    animate() {
      // Si le cube est en train d'être déplacé par l'utilisateur, on arrête l'animation.
      if (this.isDragging) {
        // On s'assure que la vélocité est nulle pour qu'il ne bouge pas tout seul
        this.velocityX = 0;
        this.velocityY = 0;
        return;
      }
      // Applique la gravité à la vitesse verticale
      this.velocityY += GRAVITY;

      // Met à jour la position
      this.currentLeft += this.velocityX;
      this.currentTop += this.velocityY;

      // Calcule les demi-dimensions pour la détection de collision
      const halfWidth = parseInt(this.cubeData.width, 10) / 2;
      const halfHeight = parseInt(this.cubeData.height, 10) / 2;

      // --- Détection des rebonds ---

      // Rebond sur les murs (gauche/droite)
      if (this.currentLeft < halfWidth || this.currentLeft > this.floorWidth - halfWidth) {
        this.velocityX *= -1 * DAMPING; // Inverse la vitesse et applique l'amortissement
        this.currentLeft = Math.max(halfWidth, Math.min(this.currentLeft, this.floorWidth - halfWidth)); // Bloque le cube à l'intérieur
      }

      // Rebond sur le sol et le plafond
      if (this.currentTop < halfHeight || this.currentTop > this.floorHeight - halfHeight) {
        this.velocityY *= -1 * DAMPING; // Inverse la vitesse et applique l'amortissement
        this.currentTop = Math.max(halfHeight, Math.min(this.currentTop, this.floorHeight - halfHeight)); // Bloque le cube à l'intérieur
      }

      // Continue l'animation à la prochaine frame
      // On arrête l'animation si le cube est presque immobile pour économiser les ressources
      if (Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1 || this.currentTop < this.floorHeight - halfHeight - 1) {
        requestAnimationFrame(this.animate);
      }
    }
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