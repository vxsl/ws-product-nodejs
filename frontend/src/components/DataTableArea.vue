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
      <FuzzyChildTable 
        v-for="t in fuzzyChildTables"
        :key="t.title"
        :id="t.id"
        :title="t.title"
        :columns="t.columns"
        :rows="t.rows"
        :searchString="searchString"
      />
    </b-col>
    <div id="tables-module" sm='6'> 
      <div id="endpoint-select-container">
        <div id="endpoint-select-content">
          <p>{{tables.length? 'Create another table to compare with.' : 'Select an endpoint to begin.'}}</p>
          <b-button v-for="e in endpoints" :key="e.title" @click="addTable(e)" class="m-1 btn" variant="primary">
            {{e.title}}
          </b-button>
        </div>
      </div>
      <div id="content-container">
        <DataTable
          v-for="table in tables"
          :key="table.id"
          :endpoint="table.endpoint"
          :id="table.id"
          class="table-card"
          :ref="'table'+table.id"
          @loaded="addToFuzzyTable"
          @close="deleteTable(table.id)"
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
import FuzzyChildTable from '@/components/FuzzyChildTable.vue';

export default {
  components: {
    DataTable,
    FuzzyChildTable
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
      fuzzyChildTables:[],
      showFuzzy:false
    };
  },
  methods: {
    setSearchString() {
      this.searchString = this.$refs.searchBox.value
    },
    addToFuzzyTable(obj) {
      if (!this.fuzzyChildTables.map(c => c.title).includes(obj.title)) {
        this.fuzzyChildTables.push(obj)
      }
    },
    toggleSearchFocus(v) {
      this.searchFocus = v
    },
    addTable(e) {
      this.tables.unshift({
        endpoint:e,
        id:++this.idCount
      })
    },
    deleteTable(id) {
      this.fuzzyChildTables = this.fuzzyChildTables.filter(item => item.id !== id);
      this.tables = this.tables.filter(item => item.id !== id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/custom.scss';


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