<template>
  <div id="app">
    <RateLimitTester :intensityValue.sync="intensity"/>
  </div>
</template>

<script>
import RateLimitTester from './components/RateLimitTester.vue'

export default {
  name: 'App',
  data() {
    return {
      intensity: Number
    }
  },
  components: {
    RateLimitTester
  },
}
</script>

<style lang="scss">
@use '@/scss/custom.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  min-height:100vh;
  padding:5vh;
}


</style>
