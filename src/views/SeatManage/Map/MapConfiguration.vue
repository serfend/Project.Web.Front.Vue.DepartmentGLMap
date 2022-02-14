<template>
  <div style="background:#f00;height:2rem">
    <el-button @click="switchMap()">测试</el-button>
    <el-card class="floating-search-panel-right" style="margin-top:5rem;">
      <template #header>
        <h2>房间组选取</h2>
      </template>
      <div style="max-height: 30rem;overflow-y: auto;overflow-x: hidden;">
        <div v-for="g in groups.concat(new Array(80).fill(0).map((i,index)=>({k:index})))" :key="g.k">{{ g }}</div>
      </div>
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
    switchMap () {
      this.$emit('requireSwitch')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/panel.scss';
</style>
