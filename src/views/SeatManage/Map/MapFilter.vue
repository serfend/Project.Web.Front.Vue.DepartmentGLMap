<template>
  <DefaultSearchPanel :loading.sync="loading" :filtered_data.sync="filtered_data" style="margin-top:5rem" />
</template>

<script>
export default {
  name: 'MapFilter',
  components: {
    DefaultSearchPanel: () => import('@/views/CommonField/DefaultSearchView/DefaultSearchPanel')
  },
  data: () => ({
    loading: false,
    filtered_data: null
  })
}
</script>
