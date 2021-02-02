<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: {
  },
  methods: {
    draw(data, options) {
      this.renderChart(data, options)
    }
  }
}
</script>
