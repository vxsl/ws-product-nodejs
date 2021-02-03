<template>
  <div>
    <b-row id="module-header" class="d-flex align-items-center padded">
      <p>View API data in table form -- add and delete as many tables as you'd like. On the left you'll find a global search bar that queries rows from all active tables.</p>
    </b-row>
    <DataTableArea id="data-table-area" :endpoints="endpoints"/>
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

<style lang="scss" scoped>
#data-table-area {
  padding-top:6em;
  display:flex;
}
</style>
