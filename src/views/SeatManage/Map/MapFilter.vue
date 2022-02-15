<template>
  <DefaultSearchPanel ref="defaultSearchPanel" :loading.sync="loading" :filtered_data.sync="filtered_data" :raw-data="rawData" style="margin-top:5rem" />
</template>

<script>
export default {
  name: 'MapFilter',
  components: {
    DefaultSearchPanel: () => import('@/views/CommonField/DefaultSearchView/DefaultSearchPanel')
  },
  props: {
    rawData: { type: Array, default: null }
  },
  data: () => ({
    loading: false,
    filtered_data: null
  }),
  watch: {
    filtered_data: {
      handler(val) {
        this.$emit('update:filtered_data', val)
      }
    },
    rawData: {
      handler(val) {
        this.$nextTick(() => {
          const t = this.$refs.defaultSearchPanel
          if (t)t.doRefreshFilter()
        })
      },
      immediate: true
    }
  }
}
</script>
