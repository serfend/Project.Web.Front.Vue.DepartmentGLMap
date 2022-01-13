<template>
  <div id="container" class="container">
    <Header :style="{height:isActive?'5rem':0,transition:'all ease 0.5s'}" />
    <div class="container-bg">
      <Breadcrumb style="margin-left:2rem;margin-top:-0.5rem;position:absolute" />
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
export default {
  name: 'DashboardContainer',
  components: {
    Header: () => import('@/views/welcome/Header'),
    Footer: () => import('@/views/welcome/Footer'),
    Breadcrumb: () => import('@/components/Breadcrumb'),
  },
  data: () => ({
    isActive: false,
    wattingHide: null
  }),
  mounted () {
    window.addEventListener('mousemove', this.callback)
  },
  destroyed() {
    window.removeEventListener('mousemove', this.callback)
  },
  methods: {
    callback(e) {
      const should_hide = e.clientY > 50
      if (this.isActive && should_hide) {
        if (!this.wattingHide) {
          this.wattingHide = setTimeout(() => {
            this.wattingHide = null
            this.isActive = false
          }, 2e3)
        }
      } else if (!this.isActive && !should_hide) {
        this.isActive = true
        clearTimeout(this.wattingHide)
        this.wattingHide = null
      }
    }
  }
}
</script>
<style lang="scss" >
@import './Statistics/style/index.scss';
</style>
