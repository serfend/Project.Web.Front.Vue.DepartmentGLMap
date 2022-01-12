<template>
  <div class="no">
    <div class="no-hd">
      <ul>
        <li v-for="(i,index) in formatedList" :key="index" :style="{color:i.color}" class="counter">
          <el-tooltip effect="light">
            <template slot="content">{{ i.description }}</template>
            <CountTo
              :start-val="i.prev"
              :end-val="i.value"
              :duration="5000"
              :suffix="i.suffix"
              :decimals="i.suffix?2:0"
            />
          </el-tooltip>
        </li>
      </ul>
    </div>
    <div class="no-bd">
      <ul>
        <li v-for="(i,index) in formatedList" :key="index">
          <el-tooltip effect="light">
            <template slot="content">{{ i.description }}</template>
            <span>{{ i.title }}</span>
          </el-tooltip>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { debounce } from '@/utils'
import { formatSciItem } from '@/utils/math'
export default {
  name: 'MembersCounter',
  components: { CountTo },
  props: {
    setting: {
      type: Object,
      default: null
    },
    autoplay: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    color: ['#ff0', '#f0f', '#0ff', '#0f0', '#f00'],
    list: [],
    rawSetting: null,
    refresher: null
  }),
  computed: {
    updatedItems() {
      return debounce(() => {
        new Promise(() => {
          this.updateItems()
        }).catch(e => {
          let current = localStorage.getItem('dashboard.settings')
          if (current) {
            current = JSON.parse(current)
            const key = `dashboard.setting[${current.name}]`
            current = localStorage.getItem(key)
            if (current) {
              this.$confirm('检测到无效的设置,是否重置设置?').then(() => {
                localStorage.removeItem(key)
                this.$message.success('已重置')
                location.reload()
              })
              return
            }
          }
          this.$confirm('发现未知异常')
        })
      }, 300)
    },
    formatedList() {
      return this.list.filter(i => i && i.title)
    }
  },
  watch: {
    setting: {
      handler(val) {
        if (val) {
          this.rawSetting = val
          this.updatedItems()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.refresh()
    setTimeout(() => {
      const count = 200
      for (let i = 0; i < count; i++) {
        this.updateItems(new Date(new Date() - (count + 7 - i) * 5 * 10e2))
      }
    }, 3000)
  },
  methods: {
    refresh() {
      if (this.refresher) clearTimeout(this.refresher)
      this.refresher = setTimeout(this.refresh, 5000)
      this.updatedItems()
    },
    updateItems(time) {
      const preItem = this.list
      const item = []
      if (!this.rawSetting) return
      const items = this.rawSetting.data
      if (!items) return item
      const memberCard = this.rawSetting.setting
      if (!memberCard) return item
      for (var card of memberCard) {
        const { title, description, color } = card
        let value = 0
        if (items[card.collection]) {
          const collect = items[card.collection]
          const collect_len = collect.length
          const filter = card.filter
          const expression = new Function('i', 'value', 'card', filter)
          for (let i = 0; i < collect_len; i++) {
            const tmp_item = collect[i]
            value = expression(tmp_item, value, card)
          }
        }
        const lastItem = preItem[item.length] ? preItem[item.length].value : 0
        const new_item = { title, prev: lastItem, value, raw_value: value, color, description, suffix: null, time }
        const sci = formatSciItem(new_item.value)
        new_item.value = sci.value
        new_item.suffix = sci.suffix
        // console.log(JSON.stringify(new_item))
        this.$emit('updateItems', new_item)
        item.push(new_item)
      }
      this.list = item
    },
    updateItem(title, value, color) {
      let r = this.findItem(title)
      if (!r) {
        r = {
          i: -1,
          item: {}
        }
      }
      r.item.prev = r.item.value ? r.item.value : 0
      r.item.value = value
      if (color) {
        r.item.color = color
      } else if (!r.item.color) {
        var cIndex = (r.i ? r.i : this.list.length + 1) % this.color.length
        r.item.color = color = this.color[cIndex]
      }

      if (r.i === -1) this.list.push(r.item)
    },
    removeItem(title) {
      var r = this.findItem(title)
      if (!r) return
      this.list.splice(r.i, 1)
    },
    findItem(title, list) {
      if (!list) list = this.list
      for (var i = 0; i < list.length; i++) {
        if (list[i].title === title) return { i, item: list[i] }
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-select {
  position: absolute;
  opacity: 0.5;
  z-index: 1;
}
.counter {
  transition: all 0.5s;
  &:hover {
    background-color: #ffffff3f;
  }
}
</style>
