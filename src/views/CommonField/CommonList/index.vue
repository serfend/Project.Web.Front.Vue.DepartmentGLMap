<template>
  <div v-loading="loading">
    <el-table
      v-if="fields"
      highlight-current-row
      header-align="center"
      :header-row-style="{'text-align':'center'}"
      :data="list"
      max-height="45rem"
      style="overflow-y: auto;"
    >
      <el-table-column v-for="i in fields.filter(i=>i.show_enable)" :key="i.id" :label="i.alias">
        <span slot-scope="{row}">{{ getValue(row.extend_fields,i) }}</span>
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="{row}">
          <el-button type="text" disabled @click="showDetail(row)">详情</el-button>
          <el-button type="text" disabled @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" disabled style="color:#c31010" @click="handleDelete(row)">删除</el-button>
        </div>
      </el-table-column>
    </el-table>
    <Pagination
      :pagesetting.sync="ipagesetting"
      :total-count="filtered_data.length"
    />
  </div>
</template>

<script>
import { debounce } from '@/utils'
export default {
  name: 'CommonList',
  components: {
    Pagination: () => import('@/components/Pagination')
  },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: { type: Array, default: () => [] },
    fields: { type: Array, default: () => [] },
    pagesetting: {
      type: Object,
      default: () => { }
    }
  },
  data: () => ({
    loading: false,
    list: []
  }),
  computed: {
    ipagesetting: {
      get() { return this.pagesetting || {} },
      set(val) { this.$emit('update:pagesetting', val) }
    },
    filtered_data() {
      return this.data
    },
    requireRefresh() {
      return debounce(() => {
        this.refresh()
      }, 1e2)
    }
  },
  watch: {
    data: {
      handler(val) {
        if (!val) return
        this.requireRefresh()
      },
      deep: true
    },
    ipagesetting: {
      deep: true,
      handler(val) {
        this.requireRefresh()
      }
    }
  },
  methods: {
    getValue(values, prop) {
      const { id, values_dict } = prop
      const v = values[id]
      const result = (values_dict && values_dict[v]) || v
      return result.alias || result
    },
    showDetail(row) {},
    refresh() {
      this.loading = true
      setTimeout(() => {
        const list = this.filtered_data
        const s = this.ipagesetting || { pageSize: 20, pageIndex: 0 }
        const { pageSize, pageIndex } = s
        this.list = list.slice(pageSize * pageIndex, pageSize * (pageIndex + 1))
        this.loading = false
      }, 2e2)
    }
  }
}
</script>
