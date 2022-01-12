<template>
  <div v-if="data">
    <h2 style="white-space:nowrap">
      <SvgIcon icon-class="shujuku" style="margin-left:0.5rem" />
      <span :class="`title ${isActive?'active':'deactive'}`">{{ data.name }}</span>
    </h2>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'Device',
  components: { SvgIcon },
  props: {
    data: {
      type: Object,
      default: null
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
  })
}
</script>
<style lang="scss" scoped>
@import '@/styles/element-variables';
.title {
  transition: all 0.5s ease;
}
.active {
  margin-left: 1rem;
  color: $--color-primary;
  font-weight: bold;
}
.deactive {
  margin-left: 0.5rem;
}
</style>
