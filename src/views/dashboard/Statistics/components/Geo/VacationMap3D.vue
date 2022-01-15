<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'
import { build_scatter } from '../../js/scatter'
import { arrayToDict } from '@/utils'
export default {
  name: 'VacationMap3D',
  props: {
    width: { type: String, default: '100%' },
    height: { type: String, default: '800px' },
    speed: { type: Number, default: 1 },
    color: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },
  data: () => ({
    chart: null,
    series: [],
    lastSeriersDict: {}, // 用于记录上次的系列，避免出现空序列导致不刷新的情况
    rootLoading: false
  }),
  computed: {
    dict_ready() {
      const { prop_dict, location_dict, fields_dict } = this
      return !!(prop_dict && location_dict && fields_dict)
    },
    fields_prop() {
      const f = this.$store.state.common_fields
      return f && f.fields
    },
    fields_dict() {
      const f = this.fields_prop
      return arrayToDict(f && f.list)
    },
    prop_dict() {
      const f = this.fields_prop
      if (!f) return []
      const c = f.color_field
      const s = f.size_field
      const d = f.division_field
      return [c, s, d]
    },
    location_dict() {
      const d = this.$store.state.dashboard.locations
      return d && d.locations
    },
    innerLoading: {
      get() { return this.rootLoading },
      set(val) {
        if (val) this.chart.showLoading()
        else this.chart.hideLoading()
        this.rootLoading = val
      }
    }
  },
  watch: {
    series: {
      handler(val) {
        this.refresh()
      },
      deep: true
    },
    dict_ready(v) {
      if (!v) return
      this.updateData()
    },
    loading(val) {
      this.innerLoading = val
    },
    data: {
      handler(v) {
        if (!v) return
        this.updateData()
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
      this.$store.dispatch('dashboard/loadLocations')
      this.$store.dispatch('dashboard/loadMap', { name: 'china', code: '0' }).then(() => {
        this.initChartSkeleton()
      })
    },
    async refresh() {
      console.log('refresh is call')
      this.innerLoading = true
      this.refreshData()
      this.innerLoading = false
    },
    updateData() {
      if (!this.dict_ready || !this.data) return
      const { prop_dict, location_dict, fields_dict } = this
      const [color_prop, size_prop, division_field] = prop_dict
      const color_prop_value = fields_dict[color_prop] && fields_dict[color_prop].values_dict
      const size_prop_value = fields_dict[size_prop] && fields_dict[size_prop].values_dict

      const convertData = (data) => {
        const fields = data.extend_fields
        if (!fields) return null
        const l = fields[division_field]
        const district = l && location_dict[l]
        const location = district && district.location
        if (!location) return null
        const p_color = fields[color_prop]
        const p_size = fields[size_prop]
        return {
          name: data.alias,
          value: [
            ...location,
            (size_prop_value[p_size] && size_prop_value[p_size].size) || p_size,
            color_prop_value[p_color] || p_color,
            fields
          ]
        }
      }
      const dict = {}
      const list = this.data.map(convertData).filter(i => i)
      list.map(i => {
        const item = i.value[3] // 分组
        const key = item.alias || item
        if (!dict[key])dict[key] = { group: item, data: [] }
        dict[key].data.push(i)
      })
      this.series = Object.keys(dict).map(key => {
        const { data, group } = dict[key]
        const t = build_scatter({ data, group })
        return t
      })
    },
    refreshData() {
      const series = this.series
      const lastSeriersDict = this.lastSeriersDict
      series.map(i => {
        delete lastSeriersDict[i.name]
      })
      const to_empty = Object
        .keys(lastSeriersDict)
        .map(alias => build_scatter({ group: { alias }}))
      this.chart.setOption({
        series: series.concat(to_empty)
      })
      this.lastSeriersDict = arrayToDict(series, i => i.name)
      console.log('series to_empty lastSeriersDict', series, to_empty, this.lastSeriersDict)
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
