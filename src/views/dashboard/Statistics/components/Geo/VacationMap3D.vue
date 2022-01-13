<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'
import geo from '@/api/config/geo'
import { debounce } from '@/utils'
export default {
  name: 'VacationMap3D',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '800px'
    },
    speed: {
      type: Number,
      default: 1
    },
    color: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => {} // {#typeName#:{from,to,value}}省份对应的坐标
    }
  },
  data() {
    return {
      chart: null,
      series: []
    }
  },
  computed: {
    updatedData() {
      return debounce(() => {
        this.updateData()
      }, 1000)
    }
  },
  watch: {
    data: {
      handler(v) {
        this.$nextTick(() => {
          this.updatedData()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      // 加载中国
      this.loadMap('0').then(() => {
        this.initChartSkeleton()
      })
    },
    loadMap(code) {
      return geo.loadMap(code).then(data => {
        echarts.registerMap('china', data)
      })
    },
    async refresh() {
      this.chart.showLoading()
      this.refreshData()
      this.chart.hideLoading()
    },
    updateData() {
      const convertData = (data) => {
        return []
      }
      const groupList = [{
        name: 'pm2.5',
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: convertData(this.data),
        encode: {
          value: 2
        },
        symbolSize: function (val) {
          return val[2] / 10
        },
        label: {
          formatter: '{b}',
          position: 'right'
        },
        itemStyle: {
          color: '#ddb926'
        },
        emphasis: {
          label: {
            show: true
          }
        }
      }]

      this.series = groupList
      this.refresh()
    },
    refreshData() {
      const series = this.series
      // console.log(series)
      this.chart.setOption({
        series: series
      })
    },
    initChartSkeleton() {
      const option = {
        geo3D: {
          map: 'china',
          environment: 'auto',
          shading: 'realistic',
          light: {
            main: {
              intensity: 1,
              alpha: 30
            },
            ambient: {
              intensity: 0
            }
          },
          postEffect: {
            enable: false
          },
          groundPlane: {
            show: false
          },
          itemStyle: {
            color: '#0000003f',
            borderWidth: 1,
            borderColor: '#33f',
            opacity: 0.8
          },
          emphasis: {
            label: {
              show: true,
              distance: 2
            },
            textStyle: {
              color: '#fff',
              fontSize: 200
            }
          },
          viewControl: {
            // autoRotateDirection: this.rotateDirection,
            // autoRotate: this.speed > 0,
            // autoRotateSpeed: this.speed,
            damping: 0.8,
            distance: 50,
            maxDistance: 400,
            minDistance: 0
          },
          regionHeight: 0.1
        },
        legend: {
          right: '5%',
          bottom: '20%',
          orient: 'vertical'
        },
        series: []
      }
      this.chart.setOption(option)
    }
  }
}
</script>
