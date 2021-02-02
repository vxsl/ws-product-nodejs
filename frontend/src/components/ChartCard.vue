<template>
  <div ref="outerContainer" class="chart-outer-container">
    <div ref="chartContainer" class="chart-container">
      <div class="chart-header">
        <span class="chart-title">{{ endpoint.title }}</span>
        <span class="monospace chart-subtitle">{{endpoint.uri}}</span>
      <LineChart v-if="endpoint.chartType == 'line'" ref="chart"/>
      <BarChart v-else-if="endpoint.chartType == 'bar'" ref="chart"/>
    </div>
  </div>
</template>

<script>
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
      chartColors:Object.values(colors).splice(0,5),
      dataSource: Object,
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes:[]
        }
      }
    };
  },
  mounted: async function () {
    this.dataSource = await axios
      .get(this.endpoint.uri)
      .then((r) => r.data)

    this.configureChart()
    this.$refs.chart.draw(this.chartData, this.chartOptions)
  },
  methods: {
    configureChart() {
      function* yieldArray(arr) { yield* arr }
      let chartColorsGen = yieldArray(this.chartColors)
      this.chartData.labels = this.dataSource.map((obj) => obj.date)
      Object.entries(this.dataSource[0]).forEach(
        function([key, val]) {
          if (key !== this.endpoint.xAxis && !isNaN(val)) {
            let id = key.charAt(0).toUpperCase() + key.slice(1)
            this.chartOptions.scales.yAxes.push({
              id:id,
              type:'linear',
              position:'left',
              ticks: {
                max:Math.max.apply(Math, this.dataSource.map(o => o[key])),
                min:Math.min.apply(Math, this.dataSource.map(o => o[key])),
              }
            })

            this.chartData.datasets.push({
              label:id,
              backgroundColor:chartColorsGen.next().value, 
              data:this.dataSource.map((obj) => obj[key]),
              yAxisID:id
            })         
          }
      }.bind(this))
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
    }
  }
}

</style>
