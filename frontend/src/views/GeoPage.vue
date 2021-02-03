<template>
  <div id="page">
    <Geo class="padded module" :endpoints="endpoints"/>
  </div>
</template>

<script>
import Geo from '@/components/Geo.vue'
import {endpoints } from '@/js/endpointConfig.js'

export default {
  name: 'GeoPage',
  data() {
    return {
        endpoints:endpoints
    }
  },
  props: {

  },
  components: {
    Geo,
  },
}
</script>

<style lang="scss" >
#page {
  height:93vh;
  display:flex;
  align-items:center;
  .module {
    height:65vh;
  }
}
</style>
