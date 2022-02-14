<template>
  <el-card shadow="hover" style="overflow:hidden" class="floating-search-panel">
    <h3 slot="header">
      <span>筛选方式</span>
      <el-button :disabled="!canRefresh" :class="['btn-refresh',canRefresh?'active':'']" type="text" @click="doRefreshFilter">有新数据 点击刷新</el-button>
    </h3>
    <slot v-if="$slots.content" ref="commonFilter" name="content" />
    <CommonFilter v-else ref="commonFilter" v-model="filter" :fields="field_list" :data="field_data" type="query" @filterChange="canRefresh = true" />
  </el-card>
</template>

<script>
export default {
  name: 'DefaultSearchPanel',
  components: {
    CommonFilter: () => import('../CommonFilter'),
  },
  data: () => ({
    canRefresh: false,
    filter: {},
    firstRefresh: true,
    filtered_data: [],
    loading: false,
  }),
  computed: {
    Loading: {
      get () { return this.loading },
      set (v) { this.loading = v }
    },
    field_data() {
      const d = this.$store.state.common_fields.data
      return d && d.list
    },
    field_list() {
      const d = this.$store.state.common_fields.fields
      return d && d.list
    },
  },
  watch: {
    filtered_data(v) {
      this.$emit('update:filtered_data', v)
    },
    canRefresh: {
      handler(v) {
        if (!v) return
        if (!this.firstRefresh) return
        this.firstRefresh = false
        this.doRefreshFilter()
      },
      immediate: true
    },
  },
  methods: {
    doRefreshFilter () {
      this.Loading = true
      this.canRefresh = false
      const result = this.$refs.commonFilter.doFilter()
      // console.log('refresh load data', result)
      this.filtered_data = result
      setTimeout(() => { this.Loading = false }, 1e3)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/views/DataAI/style';
</style>

<style lang="scss" scoped>
@import "@/styles/panel.scss";
</style>
