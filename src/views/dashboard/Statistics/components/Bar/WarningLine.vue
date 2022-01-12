<template>
  <div
    :style="{height:height,width:width}"
    @mouseenter="userSelect = true"
    @mouseleave="userSelect = false"
  />
</template>

<script>
import * as echarts from 'echarts'
import { createLinerSeries } from '../../js/linerGradient'
import { parseTime } from '@/utils'
export default {
  name: 'VacationStatisticsLine',
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
      default: () => []
    },
  },
  data() {
    return {
      chart: null,
      nowIndex: 0,
      userSelect: false,
      series: [],
      dates: [],
      register_series: {},
      refresher: null
    }
  },
  mounted() {
    this.initChart()
    this.refresh()
    this.chart.showLoading(null, { info: '加载趋势图中' })
    setTimeout(() => {
      if (this.chart) {
        this.chart.hideLoading()
      }
    }, 3000)
  },
  beforeDestroy() {
    if (!this.chart) return
    this.chart.dispose()
    this.chart = null
    clearTimeout(this.refresher)
  },
  methods: {
    updateItems(items) {
      const index = this.register_data(items.title, items.color)
      this.push_data(index, items.value, items.time)
    },
    register_data(title, primary_color, max_count = 200) {
      let s = this.register_series[title]
      if (s) return s.index
      s = createLinerSeries(title, primary_color, [])
      s.max_count = max_count
      this.series.push(s)
      s.index = this.series.length - 1
      this.register_series[title] = s
      return s.index
    },
    push_data(index, value, time) {
      if (index > this.series.length) return
      time = time || new Date()
      time = parseTime(time, '{y}/{m}/{d} {h}:{i}:{s}.{l}')
      const s = this.series[index]
      if (!s) {
        console.log('not register ', index)
        return
      }
      if (s.data.length > s.max_count) {
        s.data.shift()
        if (index === 0) this.dates.shift()
      }
      s.data.push([time, value])
      this.dates.push(time)
    },
    refresh() {
      if (this.refresher) clearTimeout(this.refresher)
      this.setOpt()
      this.refresher = setTimeout(() => { this.refresh() }, 500)
    },
    setOpt() {
      if (!this.series) return
      const data = this.series
      const option = {
        series: data,
        xAxis: {
          data: this.dates
        }
      }
      this.chart.setOption(option)
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.initChartSkeleton()
    },
    initChartSkeleton() {
      this.chart.setOption({
        title: {
          text: `趋势图`,
          textStyle: {
            color: '#fff'
          },
          textAlign: 'center',
          left: '50%'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (series, ticket, callback) {
            const result = []
            result.push(series[0].data[0])
            result.push('</br>')
            for (var s of series) {
              const label = `${s.seriesName}:${s.value[1]}`
              result.push(s.marker)
              result.push(label)
              result.push('<br/>')
            }
            return result.join('')
          }
        },
        legend: {
          type: 'scroll',
          bottom: 0,
          inactiveColor: '#aaa',
          textStyle: { color: '#fff' }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          }
        ],
        grid: [{ x: '15%', bottom: '13%', width: '80%', height: '80%' }],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            // x轴更换数据
            // data: date,
            // 文本颜色为rgba(255,255,255,.6)  文字大小为 12
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,.6)',
                fontSize: 12
              }
            },
            // x轴线的颜色为   rgba(255,255,255,.2)
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.2)'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: function (value) {
              const v = value.min - 20
              return v < 0 ? 0 : v
            },
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,.6)',
                fontSize: 12
              }
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.1)'
              }
            }
          }
        ]
      })
    }
  }
}
</script>
