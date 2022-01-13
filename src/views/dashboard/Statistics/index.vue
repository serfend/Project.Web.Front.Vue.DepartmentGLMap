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
            <VacationMap3D height="100%" :file-load="requestFile" />
          </div>
        </div>
        <div class="column">
          <Square>
            <RankingBar
              slot="chart"
              :data="ranking_data.data"
              :legend="ranking_data.legend"
              height="100%"
            />
          </Square>
          <Square>
            <WarningLine ref="warningLine" slot="chart" height="100%" />
          </Square>
        </div>
      </section>
      <div class="on-right-menu">
        <EchartGeoLoader
          ref="echartGeoDriver"
          :file-load="requestFile"
          :complete.sync="echartGeoComplete"
        />
        <SettingEngine ref="setting" :setting.sync="setting" @closed="settingUpdated" />
      </div>
    </div>
    <VacationMap3D v-else height="87%" :file-load="requestFile" />
  </div>
</template>

<script>
// import Flexible from './js/flexible'
import Square from './components/Square'

import TimeCenter from './components/NumberCounter/TimeCenter'
import { timeZone } from '@/api/common/static'
import SettingEngine from './components/Engine/SettingEngine'
import { getProp, modify } from '@/utils/data-handle'

import { requestFile, download } from '@/api/common/file'
import { debounce } from '@/utils'
import RankingBar from './components/Bar/RankingBar'
import WarningLine from './components/Bar/WarningLine'
import Breadcrumb from '@/components/Breadcrumb'
const cmp = (a, b) => b.v - a.v
const Mock = require('mockjs')
const legend = new Array(10).fill(0).map(i => Mock.Random.ip())
export default {
  name: 'Statistics',
  components: {
    Breadcrumb,
    Square,
    TimeCenter,
    EchartGeoLoader: () => import('./components/Engine/EchartGeoLoader'),
    SettingEngine,
    RankingBar,
    WarningLine,
    VacationMap3D: () => import('./components/Geo/VacationMap3D')
  },
  data: () => ({
    // flexible: new Flexible(window, document),
    loading: false,
    echartGeoComplete: false,
    data: null,
    lastUpdate: new Date(),
    ranking_data: {
      data: [
        {
          name: '端口占用',
          series: new Array(10)
            .fill(0)
            .map((v, i) => ({
              v: Mock.Random.natural(0, 100),
              ip: legend[i]
            }))
            .sort(cmp)
        },
        {
          name: '连接数',
          series: new Array(10)
            .fill(0)
            .map((v, i) => ({
              v: Mock.Random.natural(0, 100),
              ip: legend[i]
            }))
            .sort(cmp)
        },
        {
          name: '数据包数',
          series: new Array(10)
            .fill(0)
            .map((v, i) => ({
              v: Mock.Random.natural(0, 100),
              ip: legend[i]
            }))
            .sort(cmp)
        }
      ],
      legend: legend
    },
    show_only_map: false
  }),
  computed: {
    dash () {
      return this.$store.state.dashboard.dash
    },
    updatedSetting () {
      return debounce(() => {
        this.settingUpdated()
      }, 1000)
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
    // this.flexible.init()
  },
  mounted () {
    setTimeout(() => {
      this.init()
    }, 2000)
  },
  beforeDestroy () {
    // this.flexible.terminate()
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    timeZone,
    modify,
    requireUpdateItems (items) {
      this.$refs.warningLine.updateItems(items)
    },
    requestFile (file) {
      return requestFile('/dataview', file).then(data => {
        return download(data.file.id)
      })
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
