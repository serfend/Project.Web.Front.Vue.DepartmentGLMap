<template>
  <el-card v-loading="loading" class="normal-panel" :style="{height}" shadow="hover">
    <el-row>
      <span v-if="title">{{ title }}</span>
      <transition name="el-fade-in">
        <el-tooltip
          v-show="canSave"
          content="保存"
          class="tool-btn"
          :style="{opacity:Math.abs(Math.sin(opacity))}"
        >
          <el-button type="text" icon="el-icon-upload" @click="handleClick" />
        </el-tooltip>
      </transition>
    </el-row>
    <slot />
  </el-card>
</template>

<script>
export default {
  name: 'NormalPanel',
  props: {
    title: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: '25rem'
    },
    canSave: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loading: false,
    opacity: 0
  }),
  mounted() {
    setInterval(() => {
      this.opacity += 0.1
    }, 100)
  },
  methods: {
    handleClick() {
      this.loading = true
      const cb = (message) => {
        setTimeout(() => {
          if (!message) message = '已保存'
          this.$message.success(message)
          this.loading = false
        }, 500)
      }
      this.$emit('requireSave', cb)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style';
.tool-btn {
  float: right;
  position: absolute;
  font-size: 1.8rem;
  padding: 0;
  transition: all 0.5s ease;
}
</style>
