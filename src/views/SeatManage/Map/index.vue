<template>
  <div :style="{height:height,width:width}">
    <MapConfiguration />
    <div v-waves :style="{height:height,width:width}" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'
import { build_scatter } from '@/utils/echart-config/scatter'
import { arrayToDict } from '@/utils'
import { to_property_getter } from '@/utils/data-handle/common-field'
import { groupByPredict } from '@/utils/data-handle'
import { loadRoomList } from '@/api/config/geo'
import waves from '@/directive/waves'
export default {
  name: 'SeatMap',
  components: {
    MapConfiguration: () => import('./MapConfiguration')
  },
  directives: {
    waves
  },
  props: {
    width: { type: String, default: '100%' },
    height: { type: String, default: '1080px' },
    speed: { type: Number, default: 1 },
    color: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },
  data: () => ({
    chart: null,
    data: null,
    series: [],
    lastSeriersDict: {}, // 用于记录上次的系列，避免出现空序列导致不刷新的情况
    rootLoading: false,
    roomGroups: []
  }),
  computed: {
    dict_ready () {
      const { fields_prop, fields_dict } = this
      return !!(fields_prop && fields_dict)
    },
    fields_prop () {
      const f = this.$store.state.common_fields
      return f && f.fields
    },
    fields_dict () {
      const f = this.fields_prop
      return arrayToDict(f && f.list)
    },
    innerLoading: {
      get () { return this.rootLoading },
      set (val) {
        if (val) this.chart.showLoading()
        else this.chart.hideLoading()
        this.rootLoading = val
      }
    }
  },
  watch: {
    series: {
      handler (val) {
        this.refresh()
      },
      deep: true
    },
    dict_ready (v) {
      if (!v) return
      this.updateData()
    },
    loading (val) {
      this.innerLoading = val
    },
    data: {
      handler (v) {
        if (!v) return
        this.updateData()
      },
      deep: true
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async initChart () {
      this.chart = echarts.init(this.$el)
      await this.loadRoomList()
      await this.loadRoomGroup(this.roomGroups[0])
    },
    loadRoomList() {
      // TODO split-page
      this.innerLoading = true
      return loadRoomList({}).then((data) => {
        let index = 0
        const groupDict = groupByPredict(data.rooms, v => {
          if (!v.group) {
            v.group = { name: `group-${index++}` }
          }
          return v.group.name
        })
        this.roomGroups = Object.keys(groupDict).map(k => {
          const r = { k, list: groupDict[k] }
          r.name = r.list[0].alias || 'unknown'
          return r
        })
      }).finally(() => {
        this.innerLoading = false
      })
    },
    async loadRoomGroup(maps) {
      this.innerLoading = true
      const { name, k, list } = maps
      const mapsDataPromise = list.map(i => this.$store.dispatch('dashboard/loadMap', { name: i.name, code: i.name, isRoom: true }))
      // TODO 需要变换坐标
      const mergeFeatures = features => {
        features.map((i, index) => {
          const { geometry, properties, alias } = i
          const size = i.size || 1
          const offset = i.offset || [0, 0]
          properties.name = alias
          const coordinates = geometry.coordinates
          coordinates.map(coordinate => {
            coordinate.map(positions => {
              positions.map(pos => {
                pos[0] *= size
                pos[1] *= size
                pos[0] += (offset[0] || 0)
                pos[1] += (offset[1] || 0)
              })
            })
          })
          return i
        })
        return features
      }
      const mergeSeats = seats => {
        return seats
      }
      const datas = await Promise.all(mapsDataPromise)
      datas.map((i, index) => {
        list[index].room = i
      })
      const rooms = list.map((i, index) => {
        const { alias, group } = list[index]
        const { offset, size } = group
        i.room.features.map(i => {
          i.alias = alias
          i.offset = offset
          i.size = size
        })
        return i.room
      })
      const mergeRoom = {
        features: mergeFeatures(rooms.map(i => i.features).flat()),
        seats: mergeSeats(rooms.map(i => i.seats)),
        type: rooms[0].type,
        name
      }
      debugger
      await this.$store.dispatch('dashboard/loadMap', { name: k, directMapDatas: mergeRoom, isRoom: true })
      this.initChartSkeleton(k)
      this.data = mergeRoom.seats.flat().filter(i => i)
      console.log('data is set', this.data)
      this.innerLoading = false
    },
    async refresh () {
      console.log('refresh is call')
      this.innerLoading = true
      this.refreshData()
      this.innerLoading = false
    },
    updateData () {
      if (!this.dict_ready || !this.data) return
      const { fields_prop, fields_dict } = this
      const { color_field, size_field, position_field, shape_field, group_field, division_field } = fields_prop
      const dict_getter = to_property_getter(fields_dict, (dict, v) => dict[v] && dict[v].values_dict || {})
      const color_field_dict = dict_getter(color_field)
      const size_field_dict = dict_getter(size_field)
      const shape_field_dict = dict_getter(shape_field)
      const division_field_dict = dict_getter(division_field)
      const group_field_dict = dict_getter(group_field)
      const convertData = (data) => {
        const fields = data.extend_fields
        if (!fields) return null
        const l = fields[position_field]
        const p_color = fields[color_field]
        const p_size = fields[size_field]
        const p_shape = fields[shape_field]
        const p_division = fields[division_field]
        const p_group = fields[group_field]

        return {
          name: data.alias,
          value: [
            ...l,
            (size_field_dict[p_size] && size_field_dict[p_size].size) || p_size,
            color_field_dict[p_color] || p_color,
            (shape_field_dict[p_shape] && shape_field_dict[p_shape].shape),
            (division_field_dict[p_division] && division_field_dict[p_division].division),
            group_field_dict[p_group] || p_group,
            fields
          ]
        }
      }
      const dict = {}
      const list = this.data.map(convertData).filter(i => i)
      list.map(i => {
        const item = i.value[6] // 分组
        const key = (item && item.alias || item.name) || 'unknown'
        if (!dict[key]) dict[key] = { group: item, data: [] }
        dict[key].data.push(i)
      })
      this.series = Object.keys(dict).map(key => {
        const { data, group } = dict[key]
        const t = build_scatter({ data, group })
        return t
      })
    },
    refreshData () {
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
    initChartSkeleton (mapName) {
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
          map: mapName,
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
            opacity: 0.8,
          },
          label: {
            show: true,
            textStyle: {
              fontSize: 24,
              color: '#ffffff3c'
            }
          },
          emphasis: {
            label: {
              show: true,
              textStyle: {
                fontSize: 30,
                color: '#fff'
              }
            }
          },
          aspectScale: 1,
          zoom: 1
        },
        legend: {
          type: 'scroll',
          top: '10%',
          right: '10%',
          textStyle: {
            color: '#fff'
          }
        },
        series: []
      }
      this.chart.setOption(option)
    }
  }
}
</script>
