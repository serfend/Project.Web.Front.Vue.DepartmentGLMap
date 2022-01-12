<template>
  <li>
    <el-row>
      <el-col :span="4">
        <el-tag :type="type">{{ info }}</el-tag>
      </el-col>
      <el-col :span="14">
        <span>{{ data.host }}</span>
      </el-col>
      <el-col :span="6">
        <el-popover trigger="hover">
          <div style="text-align:center">
            <div>加载失败</div>
          </div>
          <el-button slot="reference" size="mini" type="text">详情</el-button>
        </el-popover>
        <el-button size="mini" type="text">处置</el-button>
      </el-col>
    </el-row>
  </li>
</template>

<script>
export default {
  name: 'SingleWarning',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  computed: {
    type() {
      const r = this.data.warning_rank.value
      switch (r) {
        case 0: return 'primary'
        case 1: return 'info'
        case 2: return 'warning'
        case 3:
        case 4: return 'danger'
      }
      return ''
    },
    info() {
      return this.data.warning_rank.alias
    }
  }
}
</script>
