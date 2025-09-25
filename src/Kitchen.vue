<template>
  <div id="kitchen_container">
    <div class="config-container">
      <button class="close-button" @click="close">Close</button>
    </div>
    <div class="content-wrapper">
      <EncryptedImage
        id="kitchen_page"
        src="/assets/page.png"
        alt="kitchen page"
        width="600"
        height="auto"
      />
      <div class="star-area">
        <EncryptedImage
          class="star-image"
          src="/assets/star.png"
          alt="star"
        />
        <!-- Le chaudron remplace le premier bouton -->
        <IngredientCauldron v-if="cauldron" :style="cauldron.style" :cubes="cauldronCubes" />

        <!-- Les autres boutons restent des boutons normaux -->
        <button
          v-for="button in regularButtons"
          :key="button.id"
          class="star-button"
          :style="button.style"
          @click="onButtonClick(button)"
        >
          <span class="button-icon">{{ button.icon }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EncryptedImage from './EncryptedImage.vue';
import IngredientCauldron from './IngredientCauldron.vue';

export default {
  name: 'Kitchen',
  components: { EncryptedImage, IngredientCauldron },
  data() {
    const radius = 200; // Rayon pour positionner les boutons
    const center = { x: 50, y: 50 }; // Centre en pourcentage

    // Données pour chaque bouton (icône, couleur, etc.)
    const buttonData = [
      { id: 1, icon: '🔥', name: 'Feu' },
      { id: 2, icon: '💧', name: 'Eau' }, // Le premier est maintenant le chaudron
      { id: 3, icon: '🍃', name: 'Terre' },
      { id: 4, icon: '☀️', name: 'Lumière' },
      { id: 5, icon: '🌙', name: 'Ombre' },
    ];

    // Angles pour une étoile à 5 branches (en degrés, 0° vers le haut)
    const angles = [-90, -18, 54, 126, 198];

    const buttons = angles.map((angle, index) => {
      const angleRad = (angle * Math.PI) / 180;
      // Le calcul de la position est ajusté pour être plus précis par rapport à la taille de l'étoile
      const x = center.x + (radius / 300) * 50 * Math.cos(angleRad); // 300 est la largeur de l'étoile
      const y = center.y + (radius / 285) * 50 * Math.sin(angleRad); // 285 est la hauteur approx. de l'étoile

      return {
        ...buttonData[index],
        style: {
          left: `${x}%`,
          top: `${y}%`,
        },
      };
    });

    return {
      // Sépare le chaudron des autres boutons
      cauldron: buttons.find(b => b.id === 1),
      regularButtons: buttons.filter(b => b.id !== 1),
    }; // La virgule manquante était ici
  },
  props: {
    cauldronCubes: {
      type: Array,
      default: () => [], // Le point-virgule superflu a été retiré ici
    },
  },
  methods: {
    close() {
      this.$emit('close-book');
    },
    onButtonClick(button) {
      console.log(`Bouton '${button.name}' (ID: ${button.id}) cliqué !`);
      // Logique pour les autres boutons
    },
  },
};
</script>

<style scoped>
#kitchen_container {
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.content-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.star-area {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.star-image {
  width: 300px; /* Ajustez la taille de l'étoile */
  height: auto;
}

.star-button {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #c0a060;
  background-color: #f0e0c0;
}

.button-icon {
  font-size: 24px;
  line-height: 1;
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
  background-color: #e02929;
  color: white;
  border: none;
  border-radius: 5px;
}
</style>