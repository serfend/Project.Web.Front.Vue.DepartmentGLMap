<template>
  <el-card v-delay="({e,isHide})=>active = !isHide" :class="['search-panel-right',active?'search-panel-active':'']" style="margin-top:5rem;">
    <template #header>
      <h2>房间组选取</h2>
    </template>
    <div style="max-height: 30rem;overflow-y: auto;overflow-x: hidden;">
      <CommonGroup
        v-for="g in innerGroups"
        :key="g.k"
        :data="g"
        :selected.sync="g.selected"
        :is-selector="true"
        @click="handleClick(g)"
      />
    </div>
  </el-card>
</template>

<script>
import delay from '@/directive/delay'
export default {
  name: 'MapConfiguration',
  components: {
    CommonGroup: () => import('@/components/BaseDictionaryType/CommonGroup')
  },
  directives: {
    delay
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: { type: Number, default: 0 },
    groups: { type: Array, default: () => [] }
  },
  data: () => ({
    innerGroups: [],
    active: false
  }),
  watch: {
    groups: {
      handler(val) {
        this.innerGroups = (val || []).map(i => {
          const t = Object.assign({
            selected: false
          }, i)
          t.alias = i.name
          t.level = `${i.list.length}间`
          return t
        })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    switchMap () {
      this.$emit('requireSwitch')
    },
    handleClick(v) {
      this.$emit('roomChanged', v)
      const { selected } = v
      if (!selected) return
      this.innerGroups.map(i => {
        i.selected = !selected
      })
      v.selected = selected
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/panel.scss';
</style>
