<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
  },
  methods: {
    draw(data, options) {
      this.renderChart(data, options)
    }
  }
}
</script>
