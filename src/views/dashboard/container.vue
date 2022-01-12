<template>
  <div id="container" class="container">
    <Header />
    <div class="container-bg">
      <Breadcrumb style="margin-left:2rem;margin-top:-0.5rem;position:absolute" />
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Header from '@/views/welcome/Header'
import Footer from '@/views/welcome/Footer'
export default {
  name: 'DashboardContainer',
  components: { Header, Footer, Breadcrumb }
}
</script>
<style lang="scss" >
@import './Statistics/style/index.scss';
</style>
