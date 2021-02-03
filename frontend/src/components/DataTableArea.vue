<template>
  <div class="padded" id="data-table-outer-container">
    <b-col sm='6' id="sidebar">
      <div v-if="tables.length" id="search-container">
        <b-icon-search class="icon" v-if="!searchFocus"/>
        <b-icon-three-dots v-else animation="cylon" class="icon"/>
        <input
          ref="searchBox"
          @input="setSearchString"
          @focus="toggleSearchFocus(true)"
          @blur="toggleSearchFocus(false)"
        />
      </div>
      <b-table-simple class="fuzzy-results" v-if="searchString.length">
        <b-tbody>
          <tr v-for="row in matchingRows" :key="row">
            <td v-for="cell in row" :key="cell">
              {{cell}}
            </td>
          </tr>
        </b-tbody>
      </b-table-simple>
    </b-col>
    <div id="tables-module" sm='6'> 

      <div id="endpoint-select-container">
        <div id="endpoint-select-content">
          <p>{{tables.length? 'Create another table to compare with.' : 'Select an endpoint to begin.'}}</p>
          <b-button v-for="e in endpoints" :key="e.title" @click="addChart(e)" class="m-1 btn" variant="primary">
            {{e.title}}
          </b-button>
        </div>
      </div>
      
      <div id="content-container">
        <DataTable
          v-for="table in tables"
          :key="table.id"
          :endpoint="table.endpoint"
          class="table-card"
          :ref="'table'+table.id"
          @loaded="addToFuzzyTable"
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

export default {
  components: {
    DataTable,
  },
  props: {
    endpoints: Array, 
  },
  data() {
    return {
      tables:[],
      fuzzyTable:[],
      idCount:0,
      searchFocus:false,
      searchString:'',
    };
  },
  computed: {
    matchingRows() {
      if (this.searchString.length) {
        try {
          let result = []
          for (let r of this.fuzzyTable) {
            if (r.some(e => e.includes(this.searchString) 
              || e.toUpperCase().includes(this.searchString.toUpperCase()))) {
              result.push(r)
            }
          }
          return result
        }
        catch (e) {
          console.log(e.message)
        }
      }
      return []
    }
  },
  methods: {
    setSearchString() {
      this.searchString = this.$refs.searchBox.value
    },
    addToFuzzyTable(rows) {
      this.fuzzyTable = [...new Set(this.fuzzyTable.concat(rows))]
    },
    toggleSearchFocus(v) {
      this.searchFocus = v
    },
    addChart(e) {
      this.tables.unshift({
        endpoint:e,
        id:++this.idCount
      })
    },
    deleteChart(id) {
      let rm = this.$refs['table'+id][0].rows
      this.fuzzyTable = this.fuzzyTable.filter(row => !rm.some(r => r == row))
      this.tables = this.tables.filter(item => item.id !== id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/custom.scss';

.fuzzy-results {
  z-index:5;
  width:100%;
  
  overflow:hidden;
}

#search-container {
  border: solid;
  border-width: 2px;
  margin-bottom: 1em;
  margin-right:0.2em;
  height: 3em;
  display:flex;
  align-items:center;
  padding-left:1em;
  input {
    padding:0.5em;
    margin-left:1em;
    width:100%;
    height: 100%;
    background:transparent;
    border:none;
    outline:none;
  }
  .icon {
    font-size:1.2em;
  }
}

#data-table-outer-container {
  display: flex;
  justify-content: space-between;
  margin-top:1em;
}

#endpoint-select-container {
  margin-bottom:2em;
}

#sidebar {
  border-radius:1em;
  padding:1em;
  padding:3em;
  overflow:auto;
}
#tables-module {
  width:100%;
  padding-top:2vh;
  padding-bottom:2vh;
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