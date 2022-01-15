<template>
  <div class="frame-container">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="6">
        <el-card shadow="hover">
          <h3 slot="header">
            <span>筛选方式</span>
            <el-button :disabled="!canRefresh" :class="['btn-refresh',canRefresh?'active':'']" type="text" @click="doRefreshFilter">有新数据 点击刷新</el-button>
          </h3>
          <CommonFilter ref="commonFilter" v-model="filter" :fields="field_list" :data="field_data" type="query" @filterChange="canRefresh = true" />
        </el-card>
      </el-col>
      <el-col :sm="24" :lg="18">
        <el-card shadow="hover">
          <CommonList v-model="filtered_data" v-loading="loading" :fields="field_list" :pagesetting.sync="pagesetting" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'DefaultSearchView',
  components: {
    CommonFilter: () => import('../CommonFilter'),
    CommonList: () => import('../CommonList'),
  },
  data: () => ({
    loading: false,
    filter: {},
    filtered_data: [],
    canRefresh: false,
    firstRefresh: true,
    pagesetting: {}
  }),
  computed: {
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
  mounted() {
    this.$store.dispatch('common_fields/init')
  },
  methods: {
    doRefreshFilter() {
      this.loading = true
      this.canRefresh = false
      const result = this.$refs.commonFilter.doFilter()
      // console.log('refresh load data', result)
      this.filtered_data = result
      setTimeout(() => { this.loading = false }, 1e3)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/views/DataAI/style';
.center-letter {
  letter-spacing: 1rem;
  text-align: center;
}
</style>
