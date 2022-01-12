<template>
  <div v-if="data">
    <el-progress type="dashboard" :percentage="value" :color="colors" />
    <div class="status-label">{{ data.name }}</div>
    <div v-if="data.total" class="status-label">
      <el-tooltip :content="data.current.toString()">
        <span>{{ sciNum(data.current) }}</span>
      </el-tooltip>
      <span>/</span>
      <el-tooltip :content="data.total.toString()">
        <span>{{ sciNum(data.total) }}</span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { formatSciItem } from '@/utils/math'
export default {
  name: 'DeviceRuntime',
  props: {
    data: {
      type: Object,
      default: null,
      required: true
    },
    colors: {
      type: Array,
      default: null,
      required: true
    }
  },
  computed: {
    value() {
      const cur = this.data.current
      const total = this.data.total
      let result = 0
      if (!total) result = cur
      else result = (cur / total) * 100
      return Math.floor(result)
    }
  },
  methods: {
    sciNum(val) {
      const result = formatSciItem(val)
      return `${Math.round(result.value * 100) / 100}${result.suffix}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/element-variables.scss';
.status-label {
  width: 100%;
  color: $--color-primary;
  font-size: 1.2rem;
}
</style>
