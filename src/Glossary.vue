<template>
  <div class="glossary-container" :class="{ 'is-open': isOpen }">
    <GlossaryHandle @toggle-glossary="toggleGlossary"/>
    <GlossaryContent :cubes="cubes" @spawn-from-glossary="$emit('spawn-from-glossary', $event)"/>
  </div>
</template>

<script setup>
/* --- Imports --- */
import { ref} from 'vue';
import GlossaryContent from '../components/GlossaryContent.vue';
import GlossaryHandle from '../components/GlossaryHandle.vue';

/* --- Props --- */
defineProps(['cubes']);

/* --- State --- */
const isOpen = ref(false);

/* --- Computed properties --- */
function toggleGlossary() {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.glossary-container {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translate(-90%, -50%);
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* Effet rebondissant */
  z-index: 400;
  display: flex;
  align-items: center;
}

.glossary-container.is-open {
  transform: translate(0, -50%);
}
</style>