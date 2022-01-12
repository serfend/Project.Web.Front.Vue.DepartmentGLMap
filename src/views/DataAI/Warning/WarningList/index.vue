<template>
  <div>
    <el-table
      highlight-current-row
      header-align="center"
      :header-row-style="{'text-align':'center'}"
      :data="list"
      max-height="50rem"
    >
      <el-table-column label="uid">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机" width="280rem">
        <template slot-scope="scope">
          <span>{{ scope.row.host }}</span>
        </template>
      </el-table-column>
      <el-table-column label="威胁数" width="80rem">
        <template slot-scope="scope">
          <span>{{ scope.row.package.warning }}</span>
        </template>
      </el-table-column>
      <el-table-column label="威胁等级" width="80rem">
        <template slot-scope="scope">
          <span>{{ scope.row.warning_rank.alias }}</span>
        </template>
      </el-table-column>
      <el-table-column label="连接数" width="80rem">
        <template slot-scope="scope">
          <span>{{ scope.row.connection.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据包数" width="80rem">
        <template slot-scope="scope">
          <span>{{ scope.row.package.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180rem">
        <template slot-scope="scope">
          <el-tooltip content="转发">
            <el-button type="text" icon="el-icon-position" @click="$emit('forward',scope.row.id)" />
          </el-tooltip>
          <el-tooltip content="详情">
            <el-button type="text" icon="el-icon-more" @click="$emit('forward',scope.row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :pagesetting.sync="ipagesetting"
      :total-count="pagesTotalCount"
      :hidden="list.length === 0"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'WarningList',
  components: { Pagination },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    pagesetting: {
      type: Object,
      default: () => { }
    },
    pagesTotalCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ipagesetting: {
      get() { return this.pagesetting },
      set(val) { this.$emit('update:pagesetting', val) }
    },
    ipagesTotalCount: {
      get() { return this.pagesTotalCount },
      set(val) { this.$emit('update:pagesTotalCount', val) }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
