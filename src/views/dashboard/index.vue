<template>
  <CommonContainer class="dashboard-container">
    <Statistics />
  </CommonContainer>
</template>

<script>

export default {
  name: 'Dashboard',
  components: {
    Statistics: () => import('./Statistics'),
    CommonContainer: () => import('@/components/CommonContainer')
  },

}
</script>
