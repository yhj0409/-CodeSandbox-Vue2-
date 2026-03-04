<template>
  <div :style="{ width: width, height: height }" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ECharts',
  props: {
    options: {
      type: Object,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    theme: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    options: {
      handler(newVal) {
        if (this.chart) {
          this.chart.setOption(newVal, { notMerge: false });
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chart) {
      this.chart.dispose();
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart, this.theme);
      this.chart.setOption(this.options);
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    }
  }
};
</script>
