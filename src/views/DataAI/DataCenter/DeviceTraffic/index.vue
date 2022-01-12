<template>
  <div id="chart" v-loading="loading" style="width:100%;height:100%" />
</template>

<script>
import * as echarts from 'echarts'
import { createLinerSeries } from '@/views/dashboard/Statistics/js/linerGradient'
import { parseTime } from '@/utils'
import { formatSciItem } from '@/utils/math'
import { get_device_detail } from '@/api/devices'
import { debounce } from '@/utils'
export default {
  name: 'DevicesStatus',
  props: {
    id: {
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
    requireUpdate() {
      return debounce(() => {
        this.reload()
      }, 1000)
    }
  },
  watch: {
    id: {
      handler(val) {
        this.loading = true
        this.requireUpdate()
      },
      immediate: true
    },
  },
  destroyed() {
    this.dispose()
  },
  methods: {
    reload() {
      this.loading = false
      this.dispose()
      this.initChart()
    },
    dispose() {
      if (!this.chart) return
      this.chart.dispose()
      this.chart = null
      clearInterval(this.refresher)
    },
    async initRefresh() {
      if (this.refresher) clearInterval(this.refresher)
      const cDate = new Date()
      for (let i = 0; i < 50; i++) {
        this.refresh(cDate - 55 + i * 10e2)
      }
      this.refresher = setInterval(() => { this.refresh(new Date(), true) }, 1000)
    },
    refresh(targetDate, update) {
      const date = new Date(targetDate) || new Date()
      get_device_detail(this.id).then(data => {
        for (let i = 0; i < this.runtime.length; i++) {
          const curValue = data.traffic[i]
          const total = formatSciItem(Math.floor(curValue.current))
          const cDate = parseTime(date)
          this.series[i].data.push([cDate, curValue.current, `${Math.floor(total.value * 100) / 100}${total.suffix}`])
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
        if (update) this.setOpt()
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.initChartSkeleton()
    },
    initChartSkeleton() {
      this.chart.showLoading(null, {
        text: '加载流量情况中'
      })
      this.initChartOption()
      setTimeout(() => { this.initData() }, 2500)
    },
    initData() {
      get_device_detail(this.id).then(data => {
        this.runtime = data.traffic
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
        this.initRefresh().then(() => {
          this.refresh(new Date(), true)
          this.chart.hideLoading()
        })
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
              const label = `${s.seriesName}:${s.value[2]}`
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
