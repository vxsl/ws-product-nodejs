<template>
  <div>
    <DataTableArea :endpoints="endpoints"/>
  </div>
</template>

<script>
import DataTableArea from '@/components/DataTableArea.vue'
import {endpoints} from '@/js/endpointConfig.js'

export default {
  name: 'TablePage',
  data() {
    return {
      endpoints: endpoints
    }
  },
  components: {
    DataTableArea,
  },
}
</script>

<style lang="scss">
</style>
