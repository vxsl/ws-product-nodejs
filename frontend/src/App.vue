<template>
  <div id="app">
    <RateLimitTester/>
  </div>
</template>

<script>
import RateLimitTester from './components/RateLimitTester.vue'

export default {
  name: 'App',
  data() {
    return {
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

.monospace {
  font-family:'Source Code Pro', 'Courier New', Courier, monospace
}


</style>
