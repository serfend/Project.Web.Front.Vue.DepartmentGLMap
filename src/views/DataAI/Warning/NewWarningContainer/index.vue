<template>
  <el-card shadow="hover" style="height:33rem">
    <div>
      <h2>最新威胁概览</h2>
      <transition-group
        name="slide-fade"
        tag="ul"
        class="slide-container"
        @enter="enter"
        @before-enter="beforeEnter"
      >
        <SingleWarning
          v-for="(i,index) in last_list"
          :key="i.id"
          :data="i"
          :style="{opacity:caculateOpacity(last_list,index)}"
          :data-index="index"
          class="slide-fade-item"
        />
      </transition-group>
    </div>
  </el-card>
</template>

<script>
import SingleWarning from './SingleWarning'
import Velocity from 'velocity-animate'
export default {
  name: 'NewWarningContainer',
  components: {
    SingleWarning
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    last_list: [], // 用于检查新增的项，删除多余的项
  }),
  watch: {
    list: {
      handler(val) {
        for (let i = 0; i < val.length; i++) {
          const item = val[i]
          if (!this.last_list[0]) {
            this.last_list = val
          } else if (item.id === this.last_list[0].id) {
            this.last_list = val.slice(0, i).concat(this.last_list).slice(0, 20) // 更新后取前10个
            return
          }
        }
      }, deep: true
    }
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0
      el.style['margin-left'] = '5rem'
    },
    enter(el, done) {
      const delay = el.dataset.index * 150
      setTimeout(() => {
        Velocity(
          el,
          { 'margin-left': '', opacity: 1 },
          { complete: done }
        )
      }, delay)
    },
    caculateOpacity(lst, index) {
      const half = lst.length / 2
      return index < half ? 1 : (lst.length - index) / half
    }
  }
}
</script>
<style lang="scss" scoped>
// .slide-fade-move {
//   transition: transform 1s;
// }
.slide-container {
  text-align: left;
}
.slide-fade-item {
  transition: all 1s;
  font-size: 1.5rem;
}
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-to {
  transform: translateX(5rem);
  transform: scale(0);
  // opacity: 0;
}
</style>
