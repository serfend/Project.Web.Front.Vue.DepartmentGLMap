<template>
  <div class="search-form">
    <el-card>
      <div slot="header">
        <el-progress :percentage="percentage" :format="percentage_format" :stroke-width="26" text-inside />
      </div>
    </el-card>
  </div>

</template>

<script>
export default {
  name: 'CommonStatistics',
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: { type: Array, default: () => [] },
    fullData: { type: Array, default: () => [] }
  },
  computed: {
    fields() {
      const t = this.$store.state.common_fields.fields
      return (t && t.list) || []
    },
    counter() {
      const r = { f_len: 0, d_len: 0 }
      const { data, fullData } = this
      if (!data || !fullData) return r
      r.d_len = data.length
      r.f_len = fullData.length
      return r
    },
    percentage() {
      const { f_len, d_len } = this.counter
      if (f_len === 0) return 100
      return (d_len / f_len) * 100
    }
  },
  methods: {
    percentage_format(v) {
      const { counter } = this
      return `已筛选${counter.d_len}/${counter.f_len}条数据`
    },
  }
}
</script>
<style lang="scss" scoped>
.search-form{
	padding:1rem;
}
</style>
