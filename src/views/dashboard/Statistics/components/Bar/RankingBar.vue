<template>
  <div
    :style="{height:height,width:width}"
    @mouseenter="userSelect = true"
    @mouseleave="userSelect = false"
  />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'RankingBar',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    color: {
      type: Array,
      default() {
        return ['#ff3333', '#33ff33', '#3333ff']
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    legend: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      chart: null,
      refresher: null,
      nowIndex: 0,
      userSelect: false
    }
  },
  mounted() {
    this.initChart()
    this.refresh()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.checkTimeOut()
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    checkTimeOut() {
      if (this.refresher) clearTimeout(this.refresher)
      this.refresher = null
    },
    async nextShowOfData() {
      if (!this.userSelect) {
        this.checkTimeOut()
        if (this.data && this.data.length > 0) {
          this.nowIndex++
          if (this.nowIndex >= this.data.length) this.nowIndex = 0
          this.refresh(true)
        }
      }
      this.refresher = setTimeout(() => {
        this.nextShowOfData()
      }, 5000)
    },
    refresh(directClear = true) {
      this.chart.showLoading()
      this.setOpt(directClear)
      this.chart.hideLoading()
    },
    setOpt(directClear) {
      if (!this.data) return
      const nowGroup = this.data[this.nowIndex]
      if (!nowGroup) return
      const series = nowGroup.series.map(d => ({
        name: d.ip,
        type: 'bar',
        data: [d.v],
      }))
      if (directClear || this.nowIndex === 0) this.chart.clear()
      const option = {
        title: {
          text: nowGroup.name,
          textStyle: {
            color: '#fff'
          },
          textAlign: 'center',
          left: '50%',
          top: '2%',
        },
        color: this.color,
        tooltip: {
          show: true,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          type: 'scroll',
          bottom: '0%',
          textStyle: {
            color: '#fff'
          },
          inactiveColor: '#aaa'
        },
        // 修改图表的大小
        grid: {
          left: '5%',
          top: '10%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            axisTick: {
              alignWithLabel: true
            },
            // 修改刻度标签 相关样式
            axisLabel: {
              color: 'rgba(255,255,255,.6) ',
              fontSize: '12'
            },
            // 不显示x坐标轴的样式
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            // 修改刻度标签 相关样式
            axisLabel: {
              color: 'rgba(255,255,255,.6) ',
              fontSize: 12
            },
            // y轴的线条改为了 2像素
            axisLine: {
              show: false,
              lineStyle: {
                color: 'rgba(255,255,255,.1)',
                width: 2
              }
            },
            // y轴分割线的颜色
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            }
          }
        ],
        series: series
      }
      this.chart.setOption(option)
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.initChartSkeleton()
      this.nextShowOfData()
    },
    initChartSkeleton() {
      this.refresh()
    }
  }
}
</script>
