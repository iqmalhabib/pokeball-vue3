<template>
  <div class="loading-spinner" ref="lottieContainer"></div>
</template>

<script>
import lottie from 'lottie-web'
import animationData from '@/assets/pikachu.json'

export default {
  name: 'LoadingSpinner',
  mounted() {
    this.anim = lottie.loadAnimation({
      container: this.$refs.lottieContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
    })
  },
  beforeUnmount() {
    this.anim.destroy()
  },
}
</script>

<style scoped>
.loading-spinner {
  width: 150px;
  height: 150px;
  margin: 20px auto;
  display: block;
}
</style>
