<template>
  <div class="overlay" @click.self="$emit('close-Overlay')">
    <div class="overlay-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
    defineEmits(['close-Overlay']);

</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* z-index élevé pour être au-dessus de tout */
}

.overlay-content {
  position: relative;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
</style>