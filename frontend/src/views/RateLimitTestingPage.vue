<template>
  <div>
    <b-row id="module-header" class="d-flex align-items-center padded">
      <p>See the requisite rate limiter in action. The API is currently configured to deny requests exceeding either a) 40 within a period of 20 seconds, or b) 3 within 5 seconds to the same endpoint. To see more rejections, try enabling more endpoints or increasing the request frequency.</p>
    </b-row>
    <div id="page">
      <RateLimitTester class="padded module" :endpoints="endpoints"/>
    </div>
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
