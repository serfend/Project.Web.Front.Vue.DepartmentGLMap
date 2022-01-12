<template>
  <div>
    <NormalPanel title="系统主配置" :can-save="canSave" :height="'20rem'" @requireSave="requireSave">
      <el-form class="normal-form" label-width="6rem">
        <el-form-item label="应用策略">
          <el-select v-model="data.strategy">
            <el-option v-for="i in strategies" :key="i" :label="i" :value="i" />
          </el-select>
        </el-form-item>

        <el-tooltip content="发布节点失败，无法切换到生产环境，请检查。">
          <el-form-item label="模拟环境">
            <el-switch v-model="data.isStageDev" disabled />
          </el-form-item>
        </el-tooltip>
      </el-form>
    </NormalPanel>
    <NormalPanel title="其他配置" :can-save="canSave" :height="'15rem'" @requireSave="requireSave">
      <el-form class="normal-form" label-width="6rem">
        <el-form-item label="资产发现">
          <el-switch v-model="data.resDetect" />
        </el-form-item>
        <el-form-item label="健康监测">
          <el-switch v-model="data.helthDetect" />
        </el-form-item>
      </el-form>
    </NormalPanel>
  </div>
</template>

<script>
import NormalPanel from '../../components/NormalPanel'
export default {
  name: 'Config',
  components: { NormalPanel },
  data: () => ({
    strategies: ['默认策略', '1103测试', '全量数据', '仅tcp数据'],
    canSave: false,
    data: {
      strategy: '1103测试',
      isStageDev: true,
      resDetect: false,
      helthDetect: true
    }
  }),
  watch: {
    data: {
      handler(val) {
        this.canSave = true
      }, deep: true
    }
  }, methods: {
    requireSave(cb) {
      cb()
      this.canSave = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style';
</style>
