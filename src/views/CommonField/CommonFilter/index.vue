<template>
  <div class="search-form">
    <MagicForm v-model="magic_model" :form-attrs="{'label-width':'5rem'}" />
  </div>
</template>

<script>
import { arrayToDict } from '@/utils'
import { getProp } from '@/utils/data-handle'

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
      const item_value = (i, field) => {
        const value = i && i.extend_fields[field]
        return (value && value.v) || value
      }
      // console.log('current enable fields', fields)
      fields.map(i => {
        const { value, id, type } = i
        if (!value) return
        switch (type) {
          case 'BaseSelect': {
            if (!value.length) return
            const filter_value_merge = value.reduce((prev, cur) => prev + cur, 0)
            result = result.filter(d => Number(filter_value_merge) & Number(item_value(d, id)))
            break
          }
          case 'el-input': {
            result = result.filter(d => {
              const v = item_value(d, id)
              return v && v.indexOf(value) > -1
            })
            break
          }
          default: {
            console.warn('invalid filter type', type)
            break
          }
        }
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
