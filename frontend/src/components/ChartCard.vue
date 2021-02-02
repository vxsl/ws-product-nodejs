<template>
  <div ref="outerContainer" class="chart-outer-container">
    <div ref="chartContainer" class="chart-container">
      <b-row class="chart-header">
        <b-col>
            <span class="chart-title">{{ endpoint.title }}</span>
            <span class="monospace chart-subtitle">{{endpoint.uri}}</span>
        </b-col>
        <b-col class="d-flex justify-content-end align-items-center">
          <b-button 
          v-if="dataKeys.length > 1"
          @click="toggleAbsolute" 
          class="absolute-button">
            {{absolute? 'Absolute scale' : 'Relative scale'}}
          </b-button>
          <b-icon-x-circle @click="$emit('close')" class="close-button"/>
        </b-col>
      </b-row>
      <LineChart v-if="endpoint.chartType == 'line'" ref="chart"/>
      <BarChart v-else-if="endpoint.chartType == 'bar'" ref="chart"/>
    </div>
  </div>
</template>

<script>
const axios = require("axios")
const { Chart } = require('chart.js')
import LineChart from "@/components/charts/LineChart.vue"
import BarChart from "@/components/charts/BarChart.vue"

//eslint-disable-next-line
import colors from "@/scss/custom.scss"

export default {
  components: {
    LineChart,
    BarChart
  },
  props: {
    endpoint: Object,
  },
  data() {
    return {
      dataSource: Object, // to store the result obtained from the API
      dataKeys:[],  // to store the field(s) that will be displayed as y-axes
      chartColors:Object.values(colors).splice(0,5),
      absolute:false,
    };
  },
  mounted: async function () {

    // make API request
    this.dataSource = await axios
      .get(this.endpoint.uri)
      .then((r) => r.data)

    // determine which fields are eligible for y-axes and place these strings in dataKeys[]
    Object.entries(this.dataSource[0]).forEach(
      function([key, val]) {
        if (key !== this.endpoint.xAxis.key && !isNaN(val)) {
          this.dataKeys.push(key)
        }
    }.bind(this))
    
    // sort data numerically according to the preconfigured 'xAxis.key' value
    this.dataSource.sort((a, b) => parseFloat(a[this.endpoint.xAxis.key]) - parseFloat(b[this.endpoint.xAxis.key]));
    
    // create chart (initially relative by default)
    this.draw(this.absolute)
  },
  methods: {
    toggleAbsolute() {
      this.absolute = !this.absolute
      this.draw(this.absolute)
    },
    draw(absolute) {

      // prepare barebones chart config
      Chart.defaults.global.defaultColor = colors.darkColor;
      Chart.defaults.scale.gridLines.color = colors.mediumGreyColor;
      let chartData = { // standard data param
        labels: [],
        datasets: []
      }
      let chartOptions = {    // standard options param, with dynamic xAxes configuration.
        legend: {
          position: "top",
          align: "start",
        },
        responsive: true,
        maintainAspectRatio:false,
        scales:{
          // see @/js/endpointsConfig.js to see what kind of data is being passed to 'scales.xAxes'.
          xAxes:[this.endpoint.xAxis.config], 
          yAxes:[]
        },
        elements: {
            point: {
                radius: 0.8,
            },
        },
      }

      // create a generator for the primary/secondary/tertiary/etc.. colors defined in @/scss/custom.scss.
      function* yieldArray(arr) { yield* arr }
      let chartColorsGen = yieldArray(this.chartColors)

      // if the 'group' property is set to 'true' for this chart's endpoint in @/js/endpointsConfig.js,
      // replace the retrieved data with a mutated version that is grouped according to the key.
      if (this.endpoint.xAxis.group) {
        this.dataSource = this.groupData()
      }

      // populate the labels for the x-axis according to the various values of the primary key,
      // like 'hour' or 'date'. Additionally, all numeric values must be cast to Strings in order
      // to be parsed by moment.js 
      chartData.labels = this.dataSource.map((obj) => obj[this.endpoint.xAxis.key].toString())

      // draw the chart with the newly processed data and appropriate scaling
      absolute? this.drawAbsolute(chartData, chartOptions, chartColorsGen) : this.drawRelative(chartData, chartOptions, chartColorsGen)
    },
    
    // ex. for '/hourly/events,' we want to ignore the 'day' field and generate data that shows us how
    // many events occurred at a given hour, regardless of the day. This requires significant manipulation
    // of the original data.
    groupData() {
      let result = []
      let groups = new Set()  // ensure uniqueness of each group by collecting in a Set
      let groupBy = this.endpoint.xAxis.key
      let dataKeys = this.dataKeys // must define outside loop because VueComponent is not available inside
      for (let obj of this.dataSource) {
        let el
        let groupName = obj[groupBy]

        // locate element or create if does not exist, assign to 'el'
        if (groups.has(groupName)) {
          el = result.find(obj => obj[groupBy] == groupName)
        }
        else {
          groups.add(groupName)
          el = {
            [groupBy]:groupName
          }
          result.push(el)
        }

        // sum values of duplicate fields
        for (let k of dataKeys) {
          el[k] = el[k]? el[k] + parseFloat(obj[k]) : parseFloat(obj[k])
        }
      }
      return result
    },
    // augment the passed data and options params as required for an absolute-scale chart.
    drawAbsolute(data, options, colors) {
      // simply create a dataset for each dataKey.
      this.dataKeys.forEach(
        function(key) {
          let id = key.charAt(0).toUpperCase() + key.slice(1)
          data.datasets.push({
            label:id,
            backgroundColor:colors.next().value, 
            data:this.dataSource.map((obj) => obj[key]),
          })         
      }.bind(this))

      // finally,draw the chart
      this.$refs.chart.draw(data, options)
    },
    // augment the passed data and options params as required for a relative-scale chart.
    drawRelative(data, options, colors) {
      // create a dataset and y axis for each dataKey, correlate with id
      this.dataKeys.forEach(
        function(key) {
          let id = key.charAt(0).toUpperCase() + key.slice(1)
          let color = colors.next().value // get next color from generator
          options.scales.yAxes.push({
            id:id,
            type:'linear',
            position:'left',
            ticks: {  // ensure that the scale is relative to the range of the dataset.
              max:Math.max.apply(Math, this.dataSource.map(o => o[key])),
              min:Math.min.apply(Math, this.dataSource.map(o => o[key])),
              fontColor:color
            }
          })
          data.datasets.push({
            label:id,
            backgroundColor:color,
            data:this.dataSource.map((obj) => obj[key]),
            yAxisID:id
          })         
      }.bind(this))

      // finally, draw the chart
      this.$refs.chart.draw(data, options)
    },
  }
};

</script>

<style lang="scss">
@import "@/scss/custom.scss";

canvas {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.chart-outer-container {
  background:$light-grey-color;
  border-radius:3em;
  position: relative;
  height:100%;
  width:100%;
  margin: 1em;
  user-select: none;
  margin:0;

  .chart-container {
    filter: none;
    transition: filter 0.5s;
    overflow: hidden;
    padding: 3em;
    padding-top:1.5em;
    .chart-header {
      text-align: left;
      * {
        display:block;
      }
      margin-bottom:1em;
      .absolute-button {
        background:transparent;
        border:solid;
        border-width:1px;
        border-color:$grey-color;
        color:$grey-color;
      }
      .close-button {
        cursor:pointer;
        font-size:1.3em;
        margin-left:1em;
        margin-right:1em;
      }
    }
  }
}

</style>
