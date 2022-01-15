<template>
  <div id="container" class="container">
    <el-button
      type="text"
      icon="el-icon-full-screen"
      class="on-right-menu"
      @click="show_only_map = !show_only_map"
    >{{ show_only_map ? "取消全屏" : "全屏" }}</el-button>
    <div v-if="!show_only_map" class="container-bg">
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
            <VacationMap3D :loading="loading" height="100%" :data="filtered_data" />
          </div>
        </div>
        <div class="column">
          <Square :innerstyle="{height:'auto','max-height':'20rem'}" :innerclass="['use-scroll']">
            <div slot="chart">
              <div style="font-size:2rem;color:#fff;padding:1rem 0 0 0.5rem">
                <span>筛选字段</span>
                <el-button :disabled="!canRefresh" type="text" @click="doRefreshFilter">刷新</el-button>
              </div>
              <div class="menu-divider" style="margin:0.3rem 0 0.3rem 0" />
              <CommonFilter ref="commonFilter" v-model="filter" :fields="field_list" :data="field_data" @filterChange="canRefresh = true" />
            </div>
          </Square>
          <Square :innerstyle="{height:'auto','max-height':'20rem'}" :innerclass="['use-scroll']">
            <div slot="chart">
              <div style="font-size:2rem;color:#fff;padding:1rem 0 0 0.5rem">当前数据</div>
              <div class="menu-divider" style="margin:0.3rem 0 0.3rem 0" />
              <CommonStatistics v-model="filtered_data" />
            </div>
          </Square>
        </div>
      </section>
      <div class="on-right-menu">
        <SettingEngine ref="setting" :setting.sync="setting" @closed="settingUpdated" />
      </div>
    </div>
    <VacationMap3D v-else :loading="loading" height="87%" :data="filtered_data" />
  </div>
</template>

<script>

import { timeZone } from '@/api/config/static'
export default {
  name: 'Statistics',
  components: {
    Breadcrumb: () => import('@/components/Breadcrumb'),
    Square: () => import('./components/Square'),
    TimeCenter: () => import('./components/NumberCounter/TimeCenter'),
    SettingEngine: () => import('./components/Engine/SettingEngine'),
    VacationMap3D: () => import('./components/Geo/VacationMap3D'),
    CommonFilter: () => import('@/views/CommonField/CommonFilter'),
    CommonStatistics: () => import('@/views/CommonField/CommonStatistics')
  },
  data: () => ({
    loading: false,
    data: null,
    lastUpdate: new Date(),
    show_only_map: false,
    filter: {},
    filtered_data: [],
    canRefresh: false,
    firstRefresh: true
  }),
  computed: {
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
  },
  watch: {
    canRefresh: {
      handler(v) {
        if (!v) return
        if (!this.firstRefresh) return
        this.firstRefresh = false
        this.doRefreshFilter()
      },
      immediate: true
    },
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
    settingUpdated(v) {},
    doRefreshFilter() {
      this.loading = true
      this.canRefresh = false
      const result = this.$refs.commonFilter.doFilter()
      // console.log('refresh load data', result)
      this.filtered_data = result
      setTimeout(() => { this.loading = false }, 1e3)
    },
    requireUpdateItems (items) {
      this.$refs.warningLine.updateItems(items)
    },
    async init () {
      this.$nextTick(() => {
        window.addEventListener('resize', this.resize)
        // this.$refs.echartGeoDriver.refresh()
      })
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
@import '@/layout/components/menu-divider.scss';

.on-right-menu {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
}
</style>
<style lang="scss">
.use-scroll{
  &:hover{
    overflow-y: auto;
  }
  overflow-y: hidden;
}
</style>
