<template>
    <div>
        <div v-if="matchingRows.length" class="label">
            {{title}}
        </div>
        <b-table-simple class="fuzzy-results">
            <b-thead v-if="matchingRows.length">
                <th v-for="column in columns" :key="column">
                    {{column}}
                </th>
            </b-thead>
            <b-tbody>
                <tr v-for="row in matchingRows" :key="row[0]">
                    <th>
                    {{row[0]}}
                    </th> 
                    <td v-for="cell in row.slice(1)" :key="cell">
                    {{cell}}
                    </td>
                </tr>
            </b-tbody>
        </b-table-simple>
    </div>
</template>

<script>

export default {
  props: {
    searchString:String,
    title:String,
    rows:Array,
    columns:Array
  },
  computed: {
    matchingRows() {
      let result = []
      if (this.searchString.length) {
        try {
          for (let r of this.rows) {
            if (r.some(e => e.includes(this.searchString) 
              || e.toUpperCase().includes(this.searchString.toUpperCase()))) {
              result.push(r)
            }
          }
        }
        catch (e) {
          console.log(e.message)
          return []
        }
      }
      return result
    },
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/custom.scss';

.label {
    text-align:left;
    padding:0.5em;
    padding-left:1.5em;
    background:$dark-color;
    color:$light-color;
    border-radius:0.4em;
}
.fuzzy-results {
  z-index:5;
  width:100%;
  overflow:hidden;
}

</style>
