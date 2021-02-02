<template>
  <div class="padded">
    <b-row id="charts-module-header" class="d-flex align-items-center padded">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..</p>
    </b-row>
    <div id="charts-module">
      <div id="collapse-container">
        <b-button v-b-toggle.collapse id="collapse-button">
          <b-icon-plus-circle aria-hidden="true"></b-icon-plus-circle>
        </b-button>
        <b-collapse visible id="collapse" v-model="collapseVisible">
          <div id="collapse-content">
            <p>Select a chart to compare with.</p>
            <b-button  v-for="e in endpoints" :key="e.title" @click="addChart(e)" class="m-1 btn" variant="primary">
              {{e.title}}
            </b-button>
          </div>
        </b-collapse>
      </div>
      <ChartCard
        v-for="chart in charts"
        :key="chart.id"
        :endpoint="chart.endpoint"
        class="chart-card"
        @close="deleteChart(chart.id)"
      />
    </div>
  </div>
</template>

<script>
import ChartCard from "@/components/ChartCard.vue";

export default {
  components: {
    ChartCard,
  },
  props: {
    endpoints: Array, 
  },
  data() {
    return {
      collapseVisible:true,
      charts:[],
      idCount:0,
      tests:false,
      active:this.endpoints[0],
      refresh:false
    };
  },
  methods: {
    addChart(e) {
      this.charts.unshift({
        endpoint:e,
        id:++this.idCount
      })
      this.collapseVisible = false
    },
    deleteChart(id) {
      this.charts = this.charts.filter(item => item.id !== id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/scss/custom.scss';

#charts-module-header {
  background:$dark-grey-color;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  max-width:100vw;
  text-align:left;
  padding-top:1em;
  padding-bottom:1em;

  p {
    color:$light-grey-color;
    font-size:0.9em;
    margin:0;
    padding-left:3em !important;
    padding-right:3em !important;
  }
}

#charts-module {
  width:100%;
  padding-top:2vh;
  padding-bottom:2vh;
  .chart-card {
    margin-bottom:2em;
  }
  #collapse-container {
    width:100%;
    padding:1em;
    #collapse-button {
      background:$medium-grey-color;
      border:none;
      width:100%;
      margin-bottom:1em;
      padding:1em;
    }
    #collapse {
      background:$light-grey-color;
      border-radius:1em;
      #collapse-content {
        padding:1em;
        p {
          margin-bottom:1em;
        }
      }
    }
  }
}
</style>