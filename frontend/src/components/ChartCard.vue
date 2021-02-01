<template>
  <div ref="outerContainer" class="chart-outer-container">
    <div ref="chartContainer" class="chart-container">
      <div class="chart-header">
        <span class="chart-title">{{ endpoint.title }}</span>
        <span class="monospace chart-subtitle">{{endpoint.uri}}</span>
      </div>
      <LineChart ref="chart"/>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
import LineChart from "@/components/charts/LineChart.vue";
//eslint-disable-next-line
import colors from "@/scss/custom.scss"

export default {
  components: {
    LineChart,
  },
  props: {
    endpoint: Object,
  },
  data() {
    return {
      dataSource: Object,
      chartData: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  async created() {
    await axios
      .get(this.endpoint.uri)
      .then((r) => r.data)
      .then((data) => {
        this.dataSource = data;
      });

    this.chartData = {
      labels: this.dataSource.map((obj) => obj.date),
      datasets:this.createDatasets()
    };
    this.$refs.chart.draw(this.chartData, this.chartOptions)
  },
  methods: {
    createDatasets() {
      let i = 0
      let result = []
      for (let key in this.dataSource[0]) {
        if (key !== this.endpoint.xAxis) {
          result.push({
            label:key.charAt(0).toUpperCase() + key.slice(1),
            backgroundColor:Object.values(colors)[i], 
            data:this.dataSource.map((obj) => obj[key])
          })
        }
        i++
      }
      return result
    }
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
  border-radius: 0.5em;
  position: relative;
  width: 20%;
  margin: 1em;
  user-select: none;
  .chart-container {
    filter: none;
    transition: filter 0.5s;
    border-radius: 0.5em;
    overflow: hidden;
    padding: 3em;
    padding-top:1.5em;
    border: solid;
    border-color: $dark-color;
    border-width: 1px;
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
