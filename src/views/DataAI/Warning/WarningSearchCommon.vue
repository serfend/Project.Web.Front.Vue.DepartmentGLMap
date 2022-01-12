<template>
  <el-form class="normal-form" label-width="5rem">
    <el-form-item label="主机">
      <el-input v-model="data.host" />
    </el-form-item>
    <el-form-item label="告警等级">
      <el-select v-model="data.rank">
        <el-option v-for="i in warning_rank" :key="i.value" :label="i.alias" :value="i.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="威胁数">
      <el-slider
        v-model="data.warning_count"
        :max="config.warning_count.max"
        :min="config.warning_count.min"
        @change="requireUpdateWarningCountRange"
      />
    </el-form-item>
    <el-form-item label="协议">
      <el-select v-model="data.proto">
        <el-option v-for="i in proto" :key="i" :label="i" :value="i" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import warning from '@/api/connection/warning'
import { debounce } from '@/utils'
export default {
  name: 'WarningSearchCommon',
  data: () => ({
    proto: ['tcp', 'udp', 'arp', 'icmp'],
    warning_rank: warning.warning_rank,
    data: {
      rank: 1,
      host: '',
      proto: 'udp',
      warning_count: 0
    },
    config: {
      warning_count: {
        max: 100,
        min: 0
      }
    }
  }),
  computed: {
    requireUpdateWarningCountRange() {
      return debounce(() => {
        this.updateWarningCountRange()
      }, 500)
    }
  },
  methods: {
    updateWarningCountRange() {
      const c = this.data.warning_count
      const config = this.config.warning_count
      if (c > 0.9 * config.max) {
        config.min = config.max / 2
        config.max *= 4
      } else if (c - config.min < 0.2 * (config.max - config.min) && config.min > 0) {
        config.max /= 4
        if (config.min === 50) {
          config.min = 0
        } else {
          config.min = config.max / 2
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style';
</style>
