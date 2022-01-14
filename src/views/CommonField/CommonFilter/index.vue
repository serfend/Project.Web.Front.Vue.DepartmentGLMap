<template>
  <div class="search-form">
    <MagicForm v-model="magic_model" />
  </div>
</template>

<script>
import { arrayToTree } from '@/utils'
import conver_component_type from './conver_component_type'
export default {
  name: 'CommonSearch',
  components: {
    MagicForm: () => import('@/components/MagicForm')
  },
  props: {
    fields: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    type: { type: String, default: 'filter' } // filter/query
  },
  data: () => ({
    magic_model: {}
  }),
  computed: {},
  watch: {
    fields: {
      handler() {
        this.getFilters()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    doFilter(list) {
    },
    getFilters() {
      const fields = this.fields
      const type = this.type
      const enable_fields = fields.filter(i => i[`${type}_enable`])
      const result = {}
      enable_fields.map(i => {
        result[i.name] = {
          label: i.alias,
          __setting: {
            default: [],
            dictionary: arrayToTree(i.values),
            type: conver_component_type[i.type] || i.type
          },
          value: {

          }
        }
      })
      debugger
    }
  }
}
</script>
<style lang="scss" scoped>
.search-form{
	padding:0.5rem 0 0 0.5rem;
}
</style>
