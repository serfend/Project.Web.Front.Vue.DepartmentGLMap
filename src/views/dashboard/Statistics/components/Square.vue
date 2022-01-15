<template class="mainbox">
  <div v-waves class="panel" :style="innerstyle" :class="innerclass">
    <div class="h2-title">
      <slot name="title" />
    </div>
    <slot name="chart" />
    <div class="panel-footer" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
export default {
  name: 'Square',
  directives: {
    waves
  },
  props: {
    innerstyle: { type: Object, default: () => {} },
    innerclass: { type: [Object, Array], default: () => {} },
  }
}
</script>

<style lang="scss" scoped>
.h2-title {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  margin: auto;
}
</style>
