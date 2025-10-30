import { ref, computed, watch } from 'vue';
import { getDecryptedImage } from './image-service.js';

export function useZone(cube, defaultPath, emit, zoneName) {
  const decryptedImage = ref(null);

  const updateDecryptedImage = async (newCube) => {
    const path = newCube ? newCube.img_src : defaultPath;
    if (path) {
      decryptedImage.value = await getDecryptedImage(path);
    } else {
      decryptedImage.value = null;
    }
  };

  const zoneStyle = computed(() => {
    const style = {
      backgroundImage: `url(${decryptedImage.value || ''})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
    if (cube.value) {
      style.backgroundSize = 'cover';
      style.border = 'none';
    }
    return style;
  });

  const releaseCube = () => {
    if (cube.value) {
      emit('release-discovered-cube', cube.value.id);
    }
  };

  const handleDrop = () => {
    emit('drop-on-zone', zoneName);
  };

  watch(cube, (newCube) => {
    updateDecryptedImage(newCube);
  });

  return {
    zoneStyle,
    releaseCube,
    handleDrop,
    updateDecryptedImage, // Exposer la fonction
  };
}
