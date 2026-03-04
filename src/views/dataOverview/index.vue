<template>
  <div class="data-overview">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in cards" :key="item.label">
        <div class="card-shadow stat-card">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <div class="card-shadow chart-container">
          <div class="chart-title">实时车位趋势</div>
          <ECharts :options="realtimeChartOption" height="260px" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card-shadow chart-container">
          <div class="chart-title">车位统计占比</div>
          <ECharts :options="pieChartOption" height="260px" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <div class="card-shadow traffic-flow">
          <div
            style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            "
          >
            <div>
              <span class="flow-label">当日总通行量</span>
              <span class="flow-number">{{
                statistics.trafficFlow ? statistics.trafficFlow.total : 0
              }}</span>
            </div>
            <div>
              <span class="flow-label">入场通行量</span>
              <span class="flow-number">{{
                statistics.trafficFlow ? statistics.trafficFlow.entry : 0
              }}</span>
            </div>
            <div>
              <span class="flow-label">出场通行量</span>
              <span class="flow-number">{{
                statistics.trafficFlow ? statistics.trafficFlow.exit : 0
              }}</span>
            </div>
          </div>
          <div class="chart-title">近7日通行量</div>
          <ECharts :options="weeklyTrafficOption" height="180px" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card-shadow chart-container">
          <div class="chart-title">缴费数据趋势</div>
          <ECharts :options="paymentOption" height="260px" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ECharts from "@/components/ECharts/index.vue";

export default {
  name: "DataOverview",
  components: { ECharts },
  computed: {
    ...mapState(["statistics"]),
    cards() {
      return [
        { label: "车位总数", value: this.statistics.totalSpaces || 0 },
        { label: "已用车位数", value: this.statistics.usedSpaces || 0 },
        { label: "空闲车位数", value: this.statistics.freeSpaces || 0 },
        { label: "车位利用率", value: this.statistics.utilization || "0%" },
      ];
    },
    realtimeChartOption() {
      const trend = this.statistics.realtimeTrend || {
        times: [],
        occupied: [],
      };
      return {
        tooltip: { trigger: "axis" },
        grid: {
          left: "8%",
          right: "5%",
          top: 40,
          bottom: 30, // 增大底部留白，防止文字遮挡
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: trend.times,
          axisLabel: {
            rotate: 30, // 旋转30度避免重叠
            margin: 10, // 增加标签与轴的距离
          },
        },
        yAxis: { type: "value", name: "占用数" },
        series: [
          {
            name: "占用车位",
            type: "bar",
            data: trend.occupied,
            itemStyle: { color: "#5470c6" },
          },
        ],
      };
    },
    pieChartOption() {
      const data = this.statistics.parkingType || [];
      return {
        tooltip: { trigger: "item" },
        legend: { orient: "vertical", right: 10, top: 20, bottom: 20 },
        series: [
          {
            name: "车位占比",
            type: "pie",
            radius: ["55%", "75%"],
            avoidLabelOverlap: false,
            label: { show: false },
            emphasis: { scale: false },
            data: data,
            color: [
              "#5470c6",
              "#91cc75",
              "#fac858",
              "#ee6666",
              "#73c0de",
              "#fc8452",
            ],
          },
        ],
      };
    },
    // 近7日通行量
    weeklyTrafficOption() {
      const daily = this.statistics.dailyTraffic || [];
      const dates = daily.map((d) => d.date);
      return {
        tooltip: { trigger: "axis" },
        grid: {
          left: "8%",
          right: "5%",
          top: 20,
          bottom: 30,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: dates,
          axisLabel: {
            rotate: 30,
            margin: 10,
          },
        },
        yAxis: { type: "value" },
        series: [
          {
            name: "进场",
            type: "bar",
            data: daily.map((d) => d.entry),
            color: "#5470c6",
          },
          {
            name: "入场",
            type: "bar",
            data: daily.map((d) => d.exit),
            color: "#91cc75",
          },
        ],
      };
    },
    paymentOption() {
      const payment = this.statistics.paymentTrend || {
        times: [],
        amounts: [],
      };
      return {
        tooltip: { trigger: "axis" },
        grid: { left: "8%", right: "5%", top: 40, bottom: 20 },
        xAxis: { type: "category", data: payment.times },
        yAxis: { type: "value", name: "金额(¥)" },
        series: [
          {
            name: "缴费金额",
            type: "line",
            data: payment.amounts,
            smooth: true,
            color: "#5470c6",
          },
        ],
      };
    },
  },
  mounted() {
    this.$store.dispatch("fetchStatistics");
  },
};
</script>

<style scoped>
.data-overview {
  background-color: #f5f7fa;
}
.stat-card {
  text-align: center;
  padding: 20px 0;
}
.stat-card .label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.stat-card .value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}
.chart-container {
  padding: 15px;
}
.chart-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
  border-left: 4px solid #409eff;
  padding-left: 12px;
}
.traffic-flow {
  padding: 20px;
}
.flow-label {
  font-size: 14px;
  color: #666;
  margin-right: 10px;
}
.flow-number {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}
</style>
