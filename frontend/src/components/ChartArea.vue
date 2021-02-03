<template>
  <div class="padded">
    <b-row id="charts-module-header" class="d-flex align-items-center padded">
      <p>Here you can compare as many different charts as you'd like. Try out the different toggles on each chart, or enabling and disabling an individual dataset by clicking on its label.</p>
    </b-row>
    <div id="charts-module">
      <div id="collapse-container">
        <b-button v-b-toggle.collapse id="collapse-button">
          <b-icon-plus-circle v-if="!collapseVisible" aria-hidden="true"></b-icon-plus-circle>
          <b-icon-arrow-down v-else aria-hidden="true"></b-icon-arrow-down>
        </b-button>
        <b-collapse visible id="collapse" v-model="collapseVisible">
          <div id="collapse-content">
            <p>{{charts.length? 'Create another chart to compare with.' : 'Select an endpoint to begin.'}}</p>
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
      <ChartCard
        v-if="!charts.length"
        :endpoint="endpoints[0]"
        class="chart-card dummy"
      />
    </div>
  </div>
</template>

<script>
import ChartCard from "@/components/ChartCard.vue";

export default {
  name:'ChartArea',
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
    &.dummy {
      filter:blur(0.3em);
      opacity:0.6;
    }
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