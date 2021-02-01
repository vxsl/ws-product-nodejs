<template>
  <b-container>
    <div class="charts-grid">
      <ChartCard
        class="chart-card"
        v-for="e in endpoints"
        :key="e.uri"
        :endpoint="e"
      />
    </div>
  </b-container>
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
    return {};
  },
};
</script>

<style lang="scss" scoped>
.charts-grid {
  float: right;
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  justify-content:center;
  .chart-card {
      min-width:100%;
  }
}
</style>