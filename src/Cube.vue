<template>
  <div 
    class="cube-container" 
    :style="cubeStyle"
  >
    <img
      alt="cube"
      :src="cubeData.img_src"
      width="100"
      height="auto"
    />
  </div>
</template>

<script>
export default {
  props: {
    cubeData: {
      type: Object,
      required: true,
    }
  },
  computed: {
    cubeStyle() {
      return {
        left: this.cubeData.x_out,
        top: this.cubeData.y_out,
      };
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
</style>