<template>
  <div>
    <CommonContainer>
      <DefaultSearchPannel class="floating-search-pannel" style="margin-top:5rem" />
      <Map />
    </CommonContainer>
  </div>
</template>

<script>
export default {
  name: 'SeatManage',
  components: {
    Map: () => import('./Map'),
    CommonContainer: () => import('@/components/CommonContainer'),
    DefaultSearchPannel: () => import('@/views/CommonField/DefaultSearchView/DefaultSearchPannel')
  }
}
</script>
<style lang="scss" scoped>
@import "./style/option.scss"
</style>
