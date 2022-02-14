<template>
  <div class="frame-container">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="6">
        <DefaultSearchPanel :loading.sync="loading" :filtered_data.sync="filtered_data" />
      </el-col>
      <el-col :sm="24" :lg="18">
        <el-card shadow="hover">
          <CommonList v-model="filtered_data" v-loading="loading" :fields="field_list" :pagesetting.sync="pagesetting" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'DefaultSearchView',
  components: {
    CommonList: () => import('../CommonList'),
    DefaultSearchPanel: () => import('./DefaultSearchPanel')
  },
  data: () => ({
    loading: false,
    pagesetting: {},
    filtered_data: []
  }),
  computed: {
    field_list() {
      const d = this.$store.state.common_fields.fields
      return d && d.list
    },
  },
  mounted() {
    this.$store.dispatch('common_fields/init')
  },
}
</script>
<style lang="scss" scoped>
@import '@/views/DataAI/style';
</style>
