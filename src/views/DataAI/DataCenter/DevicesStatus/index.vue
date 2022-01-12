<template>
  <div id="chart" v-loading="loading" style="width:100%;height:100%" />
</template>

<script>
import echarts from 'echarts'
import { createLinerSeries } from '@/views/dashboard/Statistics/js/linerGradient'
import { parseTimeFull } from '@/utils'
import { formatSciItem } from '@/utils/math'
import { get_device_summary } from '@/api/devices'
export default {
  name: 'DevicesStatus',
  props: {
    type: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading: false,
    chart: null,
    series: [],
    dates: [],
    refresher: null,
    runtime: [] // 使用情况目录
  }),
  computed: {
    isTraffic() {
      return this.type === 'traffic'
    },
    currentType() {
      return this.isTraffic ? 'traffic' : 'runtime'
    },
    name() {
      return this.isTraffic ? this.$t('data-center.traffic') : this.$t('data-center.runtime')
    }
  },
  mounted() {
    this.initChart()
  },
  destroyed() {
    this.chart.dispose()
    this.chart = null
    clearTimeout(this.refresher)
  },
  methods: {
    refresh() {
      if (this.refresher) clearTimeout(this.refresher)
      const date = new Date()
      get_device_summary(date).then(data => {
        const type = this.currentType
        for (let i = 0; i < this.runtime.length; i++) {
          const curValue = data.reduce((prev, cur) => {
            if (!cur || !cur[type][i]) return { value: 0, rate: 0 }
            const v = cur[type][i].current
            const curRate = this.isTraffic ? 0 : (cur[type][i].current / (cur[type][i].total || 100))
            return { value: prev.value + v, rate: prev.rate + curRate }
          }, { value: 0, rate: 0 })
          const total = formatSciItem(Math.floor(curValue.value))
          const cDate = parseTimeFull(date)
          this.series[i].data.push([cDate, this.isTraffic ? Math.floor(curValue.value) : Math.floor(100 * curValue.rate / data.length), `${Math.floor(total.value * 100) / 100}${total.suffix}`])
          if (i === 0) {
            this.dates.push(cDate)
          }
          if (this.series[i].data.length > 50) {
            this.series[i].data.shift()
            if (i === 0) {
              this.dates.shift()
            }
          }
        }
        this.setOpt()
        this.refresher = setTimeout(() => { this.refresh() }, 1000)
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.initChartSkeleton()
    },
    initChartSkeleton() {
      get_device_summary().then(data => {
        this.runtime = data[0][this.isTraffic ? 'traffic' : 'runtime']
        const runtime = this.runtime
        for (let i = 0; i < runtime.length; i++) {
          const type = runtime[i]
          const item = createLinerSeries(
            type.name,
            type.color,
            []
          )
          this.series.push(item)
        }
        this.initChartOption()
        this.refresh()
      })
    },
    initChartOption() {
      this.chart.setOption({
        title: {
          text: this.name,
          textStyle: {
            color: '#fff'
          },
          textAlign: 'center',
          left: '50%'
        },
        legend: {
          show: true,
          bottom: '2%',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (series, ticket, callback) {
            const result = []
            result.push(series[0].data[0])
            result.push('</br>')
            for (var s of series) {
              const item1 = s.value[1].length < 5 ? `${s.value[1]}%` : ''
              const label = `${s.seriesName}:${item1}(${s.value[2]})`
              result.push(s.marker)
              result.push(label)
              result.push('<br/>')
            }
            return result.join('')
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100
          }
        ],
        grid: [{ x: '8%', bottom: '14%', width: '86%', height: '75%' }],
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
      setTimeout(() => {
        this.chart.resize()
      }, 500)
    },
    setOpt() {
      if (!this.chart) return
      const option = {
        series: this.series,
        xAxis: {
          data: this.dates
        }
      }
      this.chart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
