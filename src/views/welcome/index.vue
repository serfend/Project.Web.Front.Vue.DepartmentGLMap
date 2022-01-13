<template>
  <el-container>
    <div style="width:100%;height:100%">
      <el-main style="height:100%;user-select:none">
        <el-row v-if="showTitle" type="flex">
          <div>
            <span style="color:#ffffff;font-size:2em">{{ $store.state.settings.title }}</span>
            <el-popover trigger="hover" placement="right">
              <div>
                <h2>版本：{{ $store.state.settings.version }}</h2>
                <span>更新时间：{{ formatTime($store.state.settings.create) }}</span>
                <div v-for="l in $store.state.settings.description.split('\n')" :key="l">{{ l }}</div>
              </div>
              <el-link
                slot="reference"
                type="info"
                href="#/about/version"
                style="font-size:0.8em"
              >{{ $store.state.settings.version }}</el-link>
            </el-popover>
          </div>
        </el-row>
        <el-divider v-if="showTitle" />
        <el-row>
          <el-col
            v-for="i in innerList"
            :key="i.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            style="display:flex;justify-content:center"
          >
            <AppIcon
              style="margin:3em 2em;"
              :size="12"
              v-bind="i"
              @click="lintTo(i)"
            />
          </el-col>
        </el-row>
        <Footer />
      </el-main>
    </div>
  </el-container>
</template>

<script>
import AppIcon from '@/components/AppIcon'
import Footer from './Footer'
import { formatTime } from '@/utils'
export default {
  name: 'Welcome',
  components: { AppIcon, Footer },
  props: {
    showTitle: {
      type: Boolean,
      default: true,
    },
    list: {
      type: Array,
      default() {
        return [
          {
            label: this.$t('data-center.title'),
            description: this.$t('data-center.title'),
            svg: 'duoqudaojicheng',
            disabled: true,
            // icon: '/favicon.png',
            href: '/home/data-center',
          },
          {
            label: this.$t('model-config.title'),
            description: this.$t('model-config.description'),
            disabled: true,
            svg: 'APIceshi',
            href: '/home/model-config',
          },
          {
            label: this.$t('warning.title'),
            description: this.$t('warning.description'),
            // icon: '/favicon.png',
            svg: 'anquan',
            href: '/home/warning',
          },
          {
            label: this.$t('dashboard.title'),
            description: this.$t('dashboard.description'),
            // icon: '/favicon.png',
            svg: 'wangluocuowushuai',
            href: '/home/dashboard',
          },
        ]
      },
    },
  },
  data() {
    return {
      qrCodeUrl: '',
      innerList: [],
    }
  },
  watch: {
    list: {
      handler(val) {
        if (!val) return
        var result = []
        var vLen = val.length
        for (var j = 0; j < vLen; j++) {
          result.push(Object.assign(val[j], { id: Math.random() }))
        }
        this.innerList = result
      },
      immediate: true,
    },
  },
  methods: {
    formatTime,
    lintTo(item) {
      if (item.callback) {
        item.callback()
      }
      if (item.href) {
        this.$router.push(item.href)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-container {
  background-color: #cccccc;

  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: url(~@/assets/jpg/app/reg_bg_min_blur.jpg) no-repeat;
}
</style>
