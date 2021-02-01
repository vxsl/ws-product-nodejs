<template>
  <div id="app">
    <RateLimitTester :endpoints="endpoints"/>
  </div>
</template>

<script>
import RateLimitTester from './components/RateLimitTester.vue'

export default {
  name: 'App',
  data() {
    return {
      endpoints: [
        { title: 'POI', uri: '/poi' },
        { title: 'Hourly Events', uri: '/events/hourly' },
        { title: 'Daily Events', uri: '/events/daily' },
        { title: 'Hourly Statistics', uri: '/stats/hourly' },
        { title: 'Daily Statistics', uri: '/stats/daily' }
      ]
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
