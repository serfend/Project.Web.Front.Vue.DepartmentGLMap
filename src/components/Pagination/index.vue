<template>
  <div v-show="!hidden" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page="innerPages.pageIndex"
      :page-size="innerPages.pageSize"
      :small="small"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="totalCount"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
const default_setting = () => ({ pageIndex: 1, pageSize: 10, totalCount: 0 })
export default {
  name: 'Pagination',
  props: {
    pagesetting: {
      required: true,
      type: Object,
      default() {
        return this.innerPages
      }
    },
    pageSizes: {
      type: Array,
      default() {
        return [5, 10, 20, 30, 50, 100]
      }
    },
    totalCount: { type: Number, default: 0 },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: { type: Boolean, default: false },
    autoScroll: { type: Boolean, default: true },
    hidden: { type: Boolean, default: false },
    small: { type: Boolean, default: false }
  },
  data: () => ({ innerPages: default_setting() }),
  watch: {
    pagesetting: {
      handler(val) {
        if (!val)val = default_setting()
        this.innerPages.pageIndex = (val.pageIndex || 0) + 1
        this.innerPages.pageSize = val.pageSize || 10
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.handleChange()
    })
  },
  methods: {
    handleSizeChange(val) {
      this.innerPages.pageSize = val
      this.handleChange()
    },
    handlePageChange(val) {
      this.innerPages.pageIndex = val
      this.handleChange()
    },
    handleChange() {
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
      this.$emit('update:pagesetting', {
        pageSize: this.innerPages.pageSize,
        pageIndex: this.innerPages.pageIndex - 1
      })
    }
  }
}
</script>

<style scoped>
</style>
