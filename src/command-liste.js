import { reactive } from 'vue';
import { getDecryptedImage } from './image-service';

export const decryptedZoneImages = reactive({
  display: null,
  receptacle: null,
  outil: null,
  rune: null,
  carburant: null,
  bag: null,
});
export async function updateDecryptedImage(cube, zoneKey, defaultPath) {
  const path = cube ? cube.img_src : defaultPath;
  if (path) {
    decryptedZoneImages[zoneKey] = await getDecryptedImage(path);
  } else {
    decryptedZoneImages[zoneKey] = null;
  }
};
export function getZoneStyle(cube, zoneKey, defaultPath) {
  const imageUrl = decryptedZoneImages[zoneKey];
  const finalStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };
  if (cube && cube.img_src) {
    finalStyle.backgroundSize = 'cover';
    finalStyle.border = 'none';
  }
  return finalStyle;
};