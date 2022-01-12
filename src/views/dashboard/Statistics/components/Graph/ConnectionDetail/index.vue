<template>
  <el-popover v-model="inner_visible">
    <el-card>2333</el-card>
    <div slot="reference" />
  </el-popover>
</template>

<script>
export default {
  name: 'ConnectionDetail',
  data: () => ({
    inner_visible: false
  }),
  methods: {
    show_dialog() {
      this.inner_visible = true
    }
  }
}
</script>

<style>
</style>
