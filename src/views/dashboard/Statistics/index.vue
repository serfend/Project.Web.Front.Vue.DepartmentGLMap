<template>
  <div id="container" class="container">
    <el-button
      type="text"
      icon="el-icon-full-screen"
      class="on-right-menu"
      @click="show_only_map = !show_only_map"
    >{{ show_only_map ? "取消全屏" : "全屏" }}</el-button>
    <div v-if="!show_only_map" v-loading="loading" class="container-bg">
      <div class="statistics-title">
        <h1 class="content" style="margin:0.1rem">{{ $t('dash.t.title') }}</h1>
        <TimeCenter :time-sync-method="timeZone" />
      </div>
      <Breadcrumb style="position:absolute;margin-left:2rem;margin-top:-1rem" />
      <section class="mainbox">
        <div class="column">
          <div class="map">
            <div class="map1" />
            <div class="map2" />
            <div class="map3" />
            <VacationMap3D height="100%" :data="default_map_data" />
          </div>
        </div>
        <div class="column">
          <Square>
            <CommonFilter slot="chart" v-model="filter" :fields="field_list" :data="field_data" />
          </Square>
          <Square>1</Square>
        </div>
      </section>
      <div class="on-right-menu">
        <SettingEngine ref="setting" :setting.sync="setting" @closed="settingUpdated" />
      </div>
    </div>
    <VacationMap3D v-else height="87%" :data="default_map_data" />
  </div>
</template>

<script>

import { timeZone } from '@/api/common/static'
import { getProp, modify } from '@/utils/data-handle'
import { debounce } from '@/utils'
export default {
  name: 'Statistics',
  components: {
    Breadcrumb: () => import('@/components/Breadcrumb'),
    Square: () => import('./components/Square'),
    TimeCenter: () => import('./components/NumberCounter/TimeCenter'),
    SettingEngine: () => import('./components/Engine/SettingEngine'),
    VacationMap3D: () => import('./components/Geo/VacationMap3D'),
    CommonFilter: () => import('@/views/CommonField/CommonFilter')
  },
  data: () => ({
    loading: false,
    data: null,
    lastUpdate: new Date(),
    show_only_map: false,
    default_map_data: {
      main: [{ name: 'test', value: 15 }, { name: 'GGG', value: 22 }]
    },
    filter: {}
  }),
  computed: {
    updatedSetting () {
      return debounce(() => {
        this.settingUpdated()
      }, 1000)
    },
    field_data() {
      const d = this.$store.state.common_fields.data
      return d && d.list
    },
    field_list() {
      const d = this.$store.state.common_fields.fields
      return d && d.list
    },
    setting: {
      get () {
        return this.$store.state.dashboard.setting
      },
      set (n) {
        this.$store.state.dashboard.setting = n
      }
    },
    color_card () {
      return getProp(this.setting, ['color', 'memberCard'])
    },
    color_main () {
      return getProp(this.setting, ['color', 'barChart'])
    },
    dateRange () {
      return {
        start: getProp(this.setting, ['dateRange', 'start']),
        end: getProp(this.setting, ['dateRange', 'end'])
      }
    },
    memberSetting () {
      return {
        setting: getProp(this.setting, ['memberCard']),
        data: {
          main: [{ value: 1 }]
        }
      }
    }
  },
  created () {
  },
  mounted () {
    setTimeout(() => {
      this.init()
    }, 2000)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    timeZone,
    modify,
    requireUpdateItems (items) {
      this.$refs.warningLine.updateItems(items)
    },
    async init () {
      this.$nextTick(() => {
        window.addEventListener('resize', this.resize)
        // this.$refs.echartGeoDriver.refresh()
      })
    },
    settingUpdated () {
      const dataDriver = this.$refs.dataDriver
      if (dataDriver) {
        dataDriver.refresh().then(() => {
          this.refresh(true)
        })
      }
    },
    refresh () {
      this.chartsDoAction(c => {
        if (c._data && c._data.chart && c.refresh) {
          c.refresh()
        }
      })
    },
    resize () {
      this.chartsDoAction(c => {
        if (!c || !c.data) return
        const data = c._data
        if (data.chart) data.chart.resize()
      })
    },
    chartsDoAction (method) {
      const lastUpdate = new Date()
      this.lastUpdate = lastUpdate
      setTimeout(() => {
        if (this.lastUpdate !== lastUpdate) return
        for (var component of Object.keys(this.$refs)) {
          const c = this.$refs[component]
          method(c)
        }
      }, 500)
    },
    updateLayout (val) {
      this.show_only_map = val
    }
  }
}
</script>

<style lang="scss">
@import "./style/index.scss";
.on-right-menu {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
}
</style>
