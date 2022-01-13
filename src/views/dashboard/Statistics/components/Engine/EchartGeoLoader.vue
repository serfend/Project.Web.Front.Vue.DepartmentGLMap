<template>
  <div v-loading="loading" class="display-item">geo data loader</div>
</template>
<script>
import * as echarts from 'echarts'
import geo from '@/api/config/geo'
export default {
  name: 'StatisticsDataDriver',
  props: {
    fileLoad: {
      type: Function,
      default: null
    }
  },
  data: () => ({
    loading: false
  }),
  methods: {
    initGeoLocations(){}
  }
}
</script>
<style lang="scss" scoped>
.display-item {
  color: #aaa;
  font-size: 0.05rem;
}
</style>
