<template>
  <div id="app" class="bg-light">
    <b-navbar type="dark" variant="dark" id="nav" class="padded">
      <img id="logo" src="@/assets/eqworks.svg"/>
      <div class="d-flex align-items-top">
        <a class="text-light monospace" href="https://github.com/vxsl/ws-product-nodejs">ws-product-nodejs</a>
      </div>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#">Rate Limit Testing Module</b-nav-item>
        <b-nav-item href="#">Charts</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
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
@import '@/scss/custom.scss';

#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height:100vh;
  font-weight:300;
  font-size:1.1em;
}

.monospace {
  font-family:'Source Code Pro', 'Courier New', Courier, monospace
}

.padded {
  padding-left:9% !important;
  padding-right:9% !important;
}

#nav {
  height:7vh;
  #logo {
    padding:0.25vh;
    filter:invert(100%);
    max-height:100%;
    width:auto;
    margin-right:1em;
  }
}

</style>
