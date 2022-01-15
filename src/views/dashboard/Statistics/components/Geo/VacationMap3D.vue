<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'
import { build_scatter } from '../../js/scatter'
import { debounce, arrayToDict } from '@/utils'
export default {
  name: 'VacationMap3D',
  props: {
    width: { type: String, default: '100%' },
    height: { type: String, default: '800px' },
    speed: { type: Number, default: 1 },
    color: { type: Array, default: () => [] },
    data: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false }
  },
  data: () => ({
    chart: null,
    series: [],
    rootLoading: false
  }),
  computed: {
    fields_prop() {
      return this.$store.state.common_fields
    },
    fields_dict() {
      const f = this.fields_prop
      return arrayToDict(f && f.list)
    },
    prop_dict() {
      const f = this.fields_prop
      const l = this.fields_list
      if (!f || !l) return []
      const c = f && f.color_field
      const s = f && f.size_field
      return [c, s]
    },
    location_dict() {
      return this.$store.state.dashboard.locations
    },
    innerLoading: {
      get() { return this.rootLoading },
      set(val) {
        if (val) this.chart.showLoading()
        else this.chart.hideLoading()
        this.rootLoading = val
      }
    },
    updatedData() {
      return debounce(() => {
        this.updateData()
      }, 100)
    }
  },
  watch: {
    loading(val) {
      this.innerLoading = val
    },
    data: {
      handler(v) {
        this.$nextTick(() => {
          this.updatedData()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initChart()
    setTimeout(() => {
      this.refresh()
    }, 1e3)
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
      this.$store.dispatch('dashboard/loadLocations')
      this.$store.dispatch('dashboard/loadMap', { name: 'china', code: '0' }).then(() => {
        this.initChartSkeleton()
      })
    },
    async refresh() {
      this.innerLoading = true
      this.refreshData()
      this.innerLoading = false
    },
    updateData() {
      const convertData = (data) => {
        debugger
        return {
          name: data.name,
          value: [116, 28, data.value]
        }
      }
      const series = Object.keys(this.data)

      const groupList = series.map(list_key => {
        const list = this.data[list_key].map(convertData)
        const t = build_scatter(list)
        return t
      })

      this.series = groupList
      this.refresh()
    },
    refreshData() {
      const series = this.series
      console.log(series)
      this.chart.setOption({
        series: series
      })
    },
    initChartSkeleton() {
      const titleStyle = {
        color: '#18ffff',
        fontSize: 48,
        textShadowBlur: 50,
        textShadowColor: 'rgba(200,255,200,0.5)'
      }
      const option = {
        title: {
          text: this.$t('dash.t.map.title'),
          textStyle: titleStyle,
          subtext: this.$t('dash.t.map.subtitle'),
          top: '20', left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        geo: {
          map: 'china',
          roam: true,
          environment: 'auto',
          shading: 'realistic',
          light: {
            main: {
              intensity: 1,
              alpha: 30
            },
            ambient: {
              intensity: 0.5
            }
          },
          postEffect: {
            enable: true
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
          label: {
            show: true,
            textStyle: {
              fontSize: 10,
              color: '#ffffff3c'
            }
          },
          emphasis: {
            label: {
              show: true,
              textStyle: {
                fontSize: 18,
                color: '#fff'
              }
            }
          },
          center: [100, 35],
          zoom: 3
        },
        series: []
      }
      this.chart.setOption(option)
    }
  }
}
</script>
