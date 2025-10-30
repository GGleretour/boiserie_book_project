import { watch, nextTick, ref } from 'vue';

export function useKitchen(isVisible, kitchenBagCubeRefs, bagZone, emit) {
  const close = () => {
    emit('close-book');
  };

  const isBagImageLoaded = ref(false);

  watch(isVisible, (newValue) => {
    if (newValue) {
      // Charge l'image de fond du sac la première fois que la cuisine est visible
      if (!isBagImageLoaded.value) {
        bagZone.updateDecryptedImage(null);
        isBagImageLoaded.value = true;
      }

      // Repositionne les cubes dans le sac
      nextTick(() => {
        kitchenBagCubeRefs.value?.forEach(cube => cube.recenterInParent());
      });
    }
  });

  return {
    close,
  };
}
