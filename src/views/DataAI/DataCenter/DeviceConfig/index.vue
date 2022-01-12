<template>
  <div v-if="innerData">
    <h3 style="margin-left:0.5rem">{{ $t('data-center.config.title') }}</h3>
    <el-divider />
    <el-card shadow="never" class="operation-panel" style="margin-top:2rem">
      <el-button type="warning">{{ $t('data-center.config.restart') }}</el-button>
      <el-button type="success">立即扩容</el-button>
      <el-button type="text" class="danger-item">{{ $t('data-center.config.remove') }}</el-button>
      <el-button type="text" class="danger-item">恢复出厂设置</el-button>
    </el-card>
    <el-form label-width="8rem">
      <el-form-item :label="$t('data-center.config.cluste_sync')">
        <el-switch v-model="innerData.active" />
      </el-form-item>
      <el-form-item label="加入组建的集群">
        <el-tooltip content="是否启用集群自适应管理">
          <el-switch v-model="innerData.join_cluste" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="数据处理负载模式">
        <el-select v-model="innerData.payload">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="弹性扩容阈值">
        <el-tooltip content="扩容和恢复的最大最小负载范围">
          <el-slider
            v-model="innerData.expand_range"
            :format-tooltip="format_expand_range"
            range
            :max="100"
          />
        </el-tooltip>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'DeviceConfig',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    innerData: null,
    options: [
      { label: '数据采集优先', value: 1 },
      { label: '模型学习优先', value: 2 },
      { label: '威胁预警优先', value: 3 },
      { label: '协调控制优先', value: 4 },
    ]
  }),
  watch: {
    data: {
      handler(val) {
        this.innerData = val
      }, immediate: true, deep: true
    }
  },
  methods: {
    format_expand_range(val) {
      return `${val}%`
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style';
.danger-item {
  color: $--color-danger;
}
</style>

