<template>
  <div v-if="data">
    <el-col :span="8">
      <h3 style="margin-left:0.5rem">设备状态</h3>
      <el-form label-width="3rem">
        <el-form-item label="ID">
          <span>{{ data.id }}</span>
        </el-form-item>
        <el-form-item label="名称">
          <span>{{ data.name }}</span>
        </el-form-item>
        <el-form-item label="地址">
          <span>{{ data.network.ip }}({{ data.network.mac }})</span>
        </el-form-item>
        <el-form-item label="系统">
          <span>{{ data.system }}</span>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="16">
      <el-col
        v-for="(i,index) in data.runtime"
        :key="index"
        style="text-align:center"
        :span="24/data.runtime.length"
      >
        <DeviceRuntime :data="i" :colors="colors" />
      </el-col>
    </el-col>
  </div>
</template>

<script>
import DeviceRuntime from './DeviceRuntime'
import { get_device_detail } from '@/api/devices'
export default {
  name: 'DeviceSummary',
  components: { DeviceRuntime },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading: false,
    have_load: false,
    colors: [
      { color: '#34f31a', percentage: 40 },
      { color: '#f5f115', percentage: 60 },
      { color: '#ff6e19', percentage: 75 },
      { color: 'rgb(255, 123, 0)', percentage: 90 },
      { color: '#f31a1a', percentage: 100 }
    ],
    data: null, refresher: null
  }),
  watch: {
    id: {
      handler() {
        this.have_load = false
        this.refresh()
      }, immediate: true
    }
  },
  mounted() {
    this.refresher = setInterval(() => {
      if (this.id && this.have_load) {
        this.refresh()
      }
    }, 1000)
  },
  destroyed() {
    if (this.refresher) clearInterval(this.refresher)
  },
  methods: {
    refresh() {
      this.loading = true
      if (this.loading && !this.have_load) {
        this.$emit('update:loading', true)
      }
      get_device_detail(this.id).then(data => {
        if (data) {
          this.data = data
        } else if (!this.have_load) {
          this.$message.warning('设备不存在')
        }
      }).finally(() => {
        this.have_load = true
        this.loading = false
        this.$emit('update:loading', false)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

