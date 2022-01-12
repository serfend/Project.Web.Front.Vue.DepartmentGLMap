<template>
  <div class="frame-container">
    <el-row :gutter="20" class="full-panel">
      <el-col :span="current_device?6:12" class="full-panel">
        <el-card v-loading="!devices" shadow="hover" class="left-panel" style="padding:0">
          <template slot="header">
            <h2 class="center-letter">
              <span>集群设备管理</span>
            </h2>
          </template>
          <el-collapse v-model="activeNames" accordion @change="handleChange">
            <el-collapse-item
              v-for="(i,index) in devices"
              :key="index"
              :name="index+1"
              style="user-select:none"
            >
              <Device
                slot="title"
                :data="i"
                :is-active="current_device && current_device.id==i.id"
              />
              <el-progress
                v-if="activeNames==index+1"
                :percentage="loading_device_progress"
                :show-text="false"
              />
            </el-collapse-item>
          </el-collapse>
          <el-button
            type="success"
            style="width:100%;margin-top:1rem"
            @click="()=>$alert('设备选项已被管理员锁定，无法编辑。', '添加失败')"
          >添加设备</el-button>
        </el-card>
      </el-col>
      <el-col :span="current_device?18:12" class="left-panel">
        <el-card v-if="current_device" v-loading="summaryLoading" shadow="hover" style="height:30%">
          <DeviceSummary :id="current_device.id" :loading.sync="summaryLoading" />
        </el-card>
        <Square v-else style="height:47%">
          <DevicesStatus ref="DevicesStatusTraffic" slot="chart" type="traffic" class="full-panel" />
        </Square>
        <el-row v-if="current_device" :gutter="20" style="margin-top:1.5%;height:67.5%">
          <el-col class="full-panel" :span="16">
            <DeviceTraffic :id="current_device.id" ref="DeviceTraffic" style="height:100%" />
          </el-col>
          <el-col class="full-panel" :span="8">
            <el-card shadow="hover" style="height:100%">
              <DeviceConfig :data="current_device.config" />
            </el-card>
          </el-col>
        </el-row>
        <Square v-else style="height:50%;margin-top:2.5%">
          <DevicesStatus ref="DevicesStatusRuntime" slot="chart" type="runtime" class="full-panel" />
        </Square>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Square from '@/views/dashboard/Statistics/components/Square'
import Device from './Device'
import DeviceSummary from './DeviceSummary'
import DeviceConfig from './DeviceConfig'
import DeviceTraffic from './DeviceTraffic'
import DevicesStatus from './DevicesStatus'
import { get_device_list } from '@/api/devices'
import { debounce } from '@/utils'
import { refsDoAction } from '@/utils/component-action'
export default {
  name: 'DataCenter',
  components: { Square, Device, DevicesStatus, DeviceSummary, DeviceConfig, DeviceTraffic },
  data: () => ({
    activeNames: null,
    summaryLoading: false,
    loading_device_progress: 100,
    loading_device_timer: null,
    devices: null,
    current_device: null,
    flex: null
  }),
  computed: {
    requireResize() {
      return debounce(() => {
        this.resize()
      }, 500)
    }
  },
  mounted() {
    get_device_list().then(data => {
      this.devices = data
    })
    this.$nextTick(() => {
      window.addEventListener('resize', this.requireResize)
    })
    // this.flex = new Flexible(window, document)
    // this.flex.init()
  },
  destroyed() {
    // this.flex.terminate()
    window.removeEventListener('resize', this.requireResize)
  },
  methods: {
    resize() {
      refsDoAction(this.$refs, (c) => {
        if (c && c._data && c._data.chart) {
          c._data.chart.resize()
        }
      })
    },
    load_next() {
      const v = Math.floor(this.loading_device_progress + 20 + 0.4 * Math.random() * (100 - this.loading_device_progress))
      this.loading_device_progress = v > 100 ? 100 : v
      if (v >= 100) {
        setTimeout(() => { this.activeNames = null }, 500)
        return
      }
      this.loading_device_timer = setTimeout(() => this.load_next(), Math.random() * 20 + 50)
    },
    handleChange(val) {
      if (this.loading_device_timer) clearTimeout(this.loading_device_timer)
      this.loading_device_progress = 0
      this.current_device = this.devices[this.activeNames - 1]
      if (val) this.loading_device_timer = setTimeout(() => this.load_next(), 500)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style';
.center-letter {
  letter-spacing: 1rem;
  text-align: center;
}
</style>
