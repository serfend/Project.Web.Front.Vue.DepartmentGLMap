<template>
  <el-form v-bind="formAttrs">
    <el-form-item v-for="i in innerData" :key="i.key" :label="i.label">
      <el-tooltip slot="title" content="启用后将跟随父级默认值">
        <el-switch
          v-if="i.__setting&&i.__setting.useParent!==undefined"
          v-model="i.__setting.useParent"
        />
      </el-tooltip>
      <el-form-item v-if="i.__setting&&i.__setting.type" label="默认值">
        <component :is="i.__setting.type" v-model="i.__setting.default" />
      </el-form-item>
      <component
        :is="i.type"
        v-show="!i.__setting||(i.__setting&&!i.__setting.useParent)"
        v-model="i.value"
        :alias="i.key"
        v-bind="i.__setting&&i.__setting.props?i.__setting.props:$props"
      />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'MagicForm',
  model: {
    prop: 'data',
    event: 'changed'
  },
  props: {
    /* prop to defined formitems,for example you can use:
  {
    color:{
      label:'theme primary color',
      value:['#ff00ffff','#ff0000ff'],
      type:'el-color-picker' // would generate a color picker list,also you can use ()=>import(`components`)
    },
    server:{
      label:'api server',
      value:{
        __default:'server.com', // default value when child use `__useParent` it would effect
        server1:{
          label:'server primary',
          value:'google.com',
          type:'el-input',
          __useParent:false
        },
        server2:{
          label:'server emergency',
          value:'m1.google.com',
          type:'el-input',
          __useParent:true
        }
      }
    } // would generate 2 items in item `server`
  }
  to generate 2 formitems on which user can input custome value in it,
  and its would be emit by update:data
   */
    data: { type: Object, default: null },
    alias: { type: String, default: null },
    // leaf node will not emit change when setting modify
    // only root node will
    isLeafNode: { type: Boolean, default: false },
    formAttrs: { type: Object, default: () => {} }
  },
  data: () => ({
    innerData: null,
    setting: {
      useParent: false,
      default: null,
      type: null,
      attrs: null
    },
    loading: false
  }),
  watch: {
    innerData: {
      handler(val) {
        console.log('magic form data modified', val)
        this.$nextTick(() => {
          this.updateValue()
        })
      },
      deep: true
    },
    default: {
      handler(val) {
        this.$nextTick(() => {
          this.updateValue()
        })
      }
    },
    data: {
      handler(val) {
        console.log('magic form data=>', val)
        this.loading = true
        val = val || {}
        if (val.__setting) {
          this.setting = val.__setting
          delete val.__setting
        }
        const list = Object.keys(val)
        this.innerData = list.map(i => {
          const item = Object.assign({ key: i }, val[i])
          if (!item.type) {
            const isObj =
              Object.prototype.toString.call(item.value) === '[object Object]'
            if (!isObj) {
              throw new Error(
                `form item invalid:${item.key} is leaf node but its type not defined`
              )
            }
            item.type = 'MagicForm'
          }
          return item
        })
        setTimeout(() => {
          this.loading = false
        }, 500)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateValue() {
      if (this.isLeafNode) {
        console.log('leaf not change')
        return
      }
      this.$nextTick(() => {
        if (this.loading) return
        const val = this.innerData
        const changedItem = {}
        Object.keys(val).map(i => {
          const item = val[i]
          changedItem[item.key] = Object.assign({}, item)
          const setting = changedItem[item.key].__setting
          if (setting) {
            if (setting.useParent) {
              changedItem[item.key].value = this.setting.default
            }
            if (setting.freezing) {
              // console.log('freezing')
              return
            }
            // console.log('update', setting)
          }
        })
        const setting = this.setting
        changedItem.__setting = {
          useParent: setting.useParent,
          default: setting.default,
          type: setting.type
        }
        this.$emit('changed', changedItem)
      })
    }
  }
}
</script>

<style>
</style>
