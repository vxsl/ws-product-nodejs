<template>
  <div>
    <RateLimitTester class="padded" :endpoints="endpoints"/>
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

<style lang="scss">
</style>
