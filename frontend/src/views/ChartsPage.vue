<template>
  <div>
    <ChartArea :endpoints="endpoints"/>
  </div>
</template>

<script>
import ChartArea from '@/components/ChartArea.vue'
import {endpoints} from '@/js/endpointConfig.js'

export default {
  name: 'RateLimitTestingPage',
  data() {
    return {
      endpoints: endpoints
    }
  },
  components: {
    ChartArea,
  },
}
</script>

<style lang="scss">
</style>
