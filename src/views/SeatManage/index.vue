<template>
  <CommonContainer>
    <DefaultSearchPanel style="margin-top:5rem" />
    <Map />
  </CommonContainer>
</template>

<script>
export default {
  name: 'SeatManage',
  components: {
    Map: () => import('./Map'),
    CommonContainer: () => import('@/components/CommonContainer'),
    DefaultSearchPanel: () => import('@/views/CommonField/DefaultSearchView/DefaultSearchPanel')
  }
}
</script>
