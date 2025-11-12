<template>
  <div class="config-container">
    <button class="close-button" @click="$emit('close')">Close</button>
  </div>
</template>

<script setup>
</script>

<style scoped>
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