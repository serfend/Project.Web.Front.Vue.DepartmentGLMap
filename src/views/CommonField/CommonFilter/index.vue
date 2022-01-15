<template>
  <div class="search-form">
    <MagicForm v-model="magic_model" :form-attrs="{'label-width':'5rem'}" />
  </div>
</template>

<script>
import { arrayToDict } from '@/utils'
import { getProp } from '@/utils/data-handle'
import { data_compare } from './data_compare'
import conver_component_type from './conver_component_type'
export default {
  name: 'CommonSearch',
  components: {
    MagicForm: () => import('@/components/MagicForm')
  },
  props: {
    fields: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    type: { type: String, default: 'filter' }, // filter/query
  },
  data: () => ({
    magic_model: {}
  }),
  computed: {
    data_filter_ready() {
      return !!(this.data && this.fields && this.magic_model)
    },
    enable_fields() {
      const fields = this.fields
      const type = this.type
      if (!fields || !type) return []
      const result = fields.filter(i => i[`${type}_enable`]) || []
      const v = this.magic_model
      return result.map(i => {
        const value = getProp(v, [i.name])
        const t = Object.assign({ value }, i)
        return t
      })
    }
  },
  watch: {
    magic_model: {
      handler(val) {
        if (!val || !this.data_filter_ready) return
        this.$emit('filterChange')
      }
    },
    data_filter_ready: {
      handler(val) {
        if (!val) return
        this.$emit('filterChange')
      }, immediate: true
    },
    fields: {
      handler(v) {
        if (!v) return
        this.$nextTick(() => {
          this.initSettingModel()
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 根据当前筛选条件筛选出符合项
    doFilter() {
      const fields = this.enable_fields
      let result = this.data
      // console.log('current enable fields', fields)
      fields.map(i => {
        const { value, id, type } = i
        if (!value) return
        result = data_compare({ list: result, id, type, value })
      })
      return result
    },
    initSettingModel() {
      // console.log('initSettingModel')
      const result = {}
      this.enable_fields.map(i => {
        result[i.name] = {
          label: i.alias,
          type: conver_component_type[i.type] || i.type,
          __setting: {
            default: i.default,
            props: {
              types: i.values,
              dictionary: arrayToDict(i.values, i => i.value || i),
              config: {},
              multi: true
            }
          },
          value: null
        }
      })
      this.magic_model = result
    }
  }
}
</script>
<style lang="scss" scoped>
.search-form{
	padding:1rem 1rem 0 0.5rem;
}
</style>
