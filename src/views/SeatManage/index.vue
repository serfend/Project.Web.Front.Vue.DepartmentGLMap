<template>
  <CommonContainer>
    <Map />
  </CommonContainer>
</template>

<script>
export default {
  name: 'SeatManage',
  components: {
    Map: () => import('./Map'),
    CommonContainer: () => import('@/components/CommonContainer'),
  },
}
</script>
