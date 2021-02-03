<template>
  <div class="padded" id="data-table-outer-container">
    <div sm='4' id="sidebar">
      <div id="endpoint-select-container">
        <div id="endpoint-select-content">
          <p>{{tables.length? 'Create another table to compare with.' : 'Select an endpoint to begin.'}}</p>
          <b-button  v-for="e in endpoints" :key="e.title" @click="addChart(e)" class="m-1 btn" variant="primary">
            {{e.title}}
          </b-button>
        </div>
      </div>
    </div>
    <div id="tables-module" sm='8'> 
      <div id="content-container">
        <AutoCompleteWrapper />
        <DataTable
          v-for="table in tables"
          :key="table.id"
          :endpoint="table.endpoint"
          class="table-card"
          @close="deleteChart(table.id)"
        />
        <DataTable
          v-if="!tables.length"
          :endpoint="endpoints[0]"
          class="table-card dummy"
        />
      </div>
    </div>
  </div>
</template>

<script>
// local imports
import DataTable from "@/components/DataTable.vue";
import AutoCompleteWrapper from './util/AutoCompleteWrapper.vue';

export default {
  components: {
    DataTable,
    AutoCompleteWrapper
  },
  props: {
    endpoints: Array, 
  },
  data() {
    return {
      tables:[],
      idCount:0,
      tests:false,
      active:this.endpoints[0],
      refresh:false
    };
  },
  methods: {
    addChart(e) {
      this.tables.unshift({
        endpoint:e,
        id:++this.idCount
      })
    },
    deleteChart(id) {
      this.tables = this.tables.filter(item => item.id !== id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/custom.scss';

#invisible {
  height:1000vh !important;
  position:absolute;
  top:0;
  opacity:0;
}

#data-table-outer-container {
  display: flex;
  justify-content: space-between;
}
#sidebar {
  border-radius:1em;
  padding:1em;
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 0 !important;
  width:25%;
  height:25vh;
  #endpoint-select-container {
    width:100%;
    padding:1em;
    margin-bottom:1em;
    #endpoint-select-button {
      background:$medium-grey-color;
      border:none;
      width:100%;
      margin-bottom:1em;
      padding:1em;
    }
    #endpoint-select {
      background:$light-grey-color;
      border-radius:1em;
      #endpoint-select-content {
        padding:1em;
        p {
          margin-bottom:1em;
        }
      }
    }
  }
}

#tables-module {
  width:100%;
  padding-top:2vh;
  padding-bottom:2vh;
  height: 200vh;
  .table-card {
    margin-bottom:2em;
    max-height:70vh;
    &.dummy {
      opacity:0.6;
    }
  }
  .dummy {
    filter:blur(0.3em);
  }
  
}
</style>