<template>
  <div id="page">
    <RateLimitTester class="padded module" :endpoints="endpoints"/>
  </div>
</template>

<script>
import RateLimitTester from '@/components/RateLimitTester.vue'
import {endpoints} from '@/js/endpointConfig.js'

export default {
  name: 'RateLimitTestingPage',
  data() {
    return {
      endpoints: endpoints
    }
  },
  components: {
    RateLimitTester,
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
