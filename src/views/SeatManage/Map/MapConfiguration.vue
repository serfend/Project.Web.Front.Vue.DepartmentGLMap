<template>
  <div style="background:#f00;height:2rem">
    <el-button @click="switchMap()">测试</el-button>
    <el-card class="floating-search-panel">
      213
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MapConfiguration',
  components: {
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: { type: Number, default: 0 },
    groups: { type: Array, default: () => [] }
  },
  methods: {
    switchMap() {
      this.$emit('requireSwitch')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/panel.scss";
</style>
