<template>
  <div class="loading-overlay">
    <div class="loading-box">
      <p>Chargement des grimoires...</p>
      <img src="/assets/loading_the_castor.gif" alt="Chargement..." />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-box {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  color: #333;
}

</style>
