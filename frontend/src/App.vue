<template>
  <div id="app">
    <ChartArea :endpoints="endpoints"/>
    <RateLimitTester v-if="false" :endpoints="endpoints"/>
  </div>
</template>

<script>
import ChartArea from '@/components/ChartArea.vue'
import RateLimitTester from '@/components/RateLimitTester.vue'

export default {
  name: 'App',
  data() {
    return {
      endpoints: [
        { 
          title: 'POI', 
          uri: '/poi',
          chartType:'line',
          xAxis:'' 
        },
        {
          title: 'Hourly Events', 
          uri: '/events/hourly',
          chartType:'line',
          xAxis:'hour' 
           
        },
        { 
          title: 'Daily Events', 
          uri: '/events/daily',
          chartType:'line',
          xAxis:'date'  
        },
        { 
          title: 'Hourly Statistics', 
          uri: '/stats/hourly',
          chartType:'line',
          xAxis:'hour' 
        },
        { 
          title: 'Daily Statistics', 
          uri: '/stats/daily',
          chartType:'line',
          xAxis:'date' 
        }
      ]
    }
  },
  components: {
    ChartArea,
    RateLimitTester,
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
  min-height:100vh;
  //padding:5vh;
}

.monospace {
  font-family:'Source Code Pro', 'Courier New', Courier, monospace
}


</style>
