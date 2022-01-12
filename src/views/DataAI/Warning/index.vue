<template>
  <div class="frame-container">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="6">
        <el-card shadow="hover">
          <h3 slot="header">筛选方式</h3>
          <WarningSearchCommon :filter.sync="filter" />
        </el-card>
        <NewWarningContainer :list="list" style="margin-top:2rem" />
      </el-col>
      <el-col :sm="24" :lg="18">
        <el-card shadow="hover">
          <WarningList
            :list="list"
            :pages-total-count.sync="pagesTotalCount"
            :pagesetting.sync="pagesetting"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WarningList from './WarningList'
import NewWarningContainer from './NewWarningContainer'
import WarningSearchCommon from './WarningSearchCommon'
import { get_connection_list } from '@/api/connection'
export default {
  name: 'Warning',
  components: { NewWarningContainer, WarningSearchCommon, WarningList },
  data: () => ({
    list: [],
    filter: {},
    pages: { pageIndex: 0, pageSize: 25 },
    pagesTotalCount: 0,
    refresher: null
  }),
  computed: {
    pagesetting: {
      get() {
        return this.pages
      },
      set(val) {
        this.$emit('update:pages', val)
      },
    },
  },
  mounted() {
    this.refresh()
  },
  methods: {
    forward() {
      this.$message('转发')
    },
    refresh() {
      if (this.refresher) clearTimeout(this.refresher)
      const { pageIndex, pageSize } = this.pages
      get_connection_list(pageIndex, pageSize).then(data => {
        this.list = data.list
        this.pagesTotalCount = data.totalCount
      })
      this.refresher = setTimeout(() => this.refresh(), 1500)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style';
.center-letter {
  letter-spacing: 1rem;
  text-align: center;
}
</style>
