<template>
  <div id="outer-container">
    <div id="right-column" cols=9>
      <b-row class="table-header">
        <b-col>
          <span class="table-title">{{ endpoint.title }}</span>
          <span class="monospace table-subtitle">{{ endpoint.uri }}</span>
        </b-col>
        <b-col class="d-flex justify-content-end align-items-center">
          <b-button
            class="tooltip-button"
            v-b-tooltip.hover
            title="Refresh table data"
          >
            <b-icon-refresh class="icon-button" />
          </b-button>
          <b-button class="tooltip-button" v-b-tooltip.hover title="Close">
            <b-icon-x-circle @click="$emit('close')" class="close-button" />
          </b-button>
        </b-col>
      </b-row>
      <div id="autocomplete-container">
        <AutoCompleteWrapper
          v-if="false"
          class="autocomplete"
          :endpoint="endpoint"
        />
      </div>
      <b-card
        id="table-container"
        class="d-flex justify-content-center align-items-center"
      >
        <b-table-simple
          fixed
          small
          striped
          hover
          id="response-table"
          class="monospace"
        >
          <b-thead>
            <b-tr id="table-header">
              <b-th />
              <b-th v-for="key in dataKeys" :key="key">
                {{ key }}
              </b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="(obj, key) in dataSource" :key="key">
              <b-th>{{ parseKey(key) }}</b-th>
              <b-td v-for="val in dataKeys" :key="val">
                {{ obj[val] }}
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-card>
    </div>
  </div>
</template>

<script>
// third-party requirements
const axios = require("axios");
const moment = require("moment");

// local imports
import AutoCompleteWrapper from "@/components/util/AutoCompleteWrapper.vue";
import dataOperations from "@/mixins/dataOperations.js";

export default {
  name: "DataTable",
  props: {
    endpoint: Object,
  },
  components: {
    AutoCompleteWrapper,
  },
  mixins: [dataOperations],
  data() {
    return {
      moment: moment,
      dataSource: Object, // to store the result obtained from the API
      rawData:String,
      dataKeys: [], // to store the field(s) that will be displayed as y-axes
    };
  },
  computed: {},
  async mounted() {
    // make API request
    this.dataSource = await axios.get(this.endpoint.uri).then((r) => r.data);
    this.rawData = JSON.stringify(this.dataSource)

    // determine which fields are eligible for y-axes and place these strings in dataKeys[]
    Object.keys(this.dataSource[0]).forEach(
      function (key) {
        if (key !== this.endpoint.xAxis.key) {
          this.dataKeys.push(key);
        }
      }.bind(this)
    );

    // sort data numerically according to the preconfigured 'xAxis.key' value
    this.dataSource.sort(
      (a, b) =>
        parseFloat(a[this.endpoint.xAxis.key]) -
        parseFloat(b[this.endpoint.xAxis.key])
    );

    // if the 'group' property is set to 'true' for this chart's endpoint in @/js/endpointsConfig.js,
    // replace the retrieved data with a mutated version that is grouped according to the key.
    if (this.endpoint.xAxis.group) {
      this.dataSource = this.groupData(
        this.endpoint.xAxis.key,
        this.dataKeys,
        this.dataSource
      );
    }
  },
};
</script>

<style lang="scss">
@import "@/scss/custom.scss";

#outer-container {
  display: flex;
  padding: 2em;
  padding-top:1em;
  background:$light-grey-color;
  #right-column {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    .table-header {
      text-align: left;
      * {
        display: block;
      }
      margin-bottom: 1em;
    }
    #autocomplete-container {
      border: solid;
      border-width: 2px;
      margin-bottom: 1em;
      
      .autocomplete {
        height: 100%;
      }
      height: 3em;
    }
    #table-container {
      border-radius: 1em;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      max-height: 60vh;
      overflow: auto;
      .card-body {
        padding: 0 !important;
      }
      flex: 1;
      font-size: 0.8em;
      height: 100%;
      position: relative;
      #response-table {
        border-radius: 1em;
        height: 100% !important;
        margin-bottom: 0;
        &.break {
          transition: filter 0.4s;
          filter: blur(0.4em);
        }
        #table-header {
          th {
            border-top: none;
            vertical-align: middle;
          }
        }
      }
    }
  }
}

#control-box {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .control-label {
    width: 100%;
    color: theme-color("dark");
    border-radius: 0.3em;
    padding: 0.5em;
    display: inline-block;
    text-align: left;
    font-size: 0.9em;
    font-weight: bold;
  }
  text-align: right;
  .control-detail {
    font-size: 0.8em;
  }
}

#query-options,
#frequency-slider {
  flex: 1;
  background: theme-color("light-grey");
  border-top-right-radius: 2em;
  border-bottom-right-radius: 2em;
  .card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
}

#query-options {
  flex-basis: 60%;
  margin-bottom: 1em;
  width: 100%;
  .btn {
    width: 100%;
    label {
      font-size: 0.8em;
      width: 100%;
      background: theme-color("light");
      color: theme-color("dark");
      &.active {
        border: none;
        background: theme-color("primary");
        color: theme-color("light");
      }
    }
  }
}

.tooltip-button {
  background: transparent;
  border: none;
  color: $dark-color;
  font-size: 1.3em;
  &:hover {
    background: transparent;
    color: $primary-color;
  }
}

.raw-data {
  font-size:0.5em;
  line-height:0.5em !important;
}
</style>