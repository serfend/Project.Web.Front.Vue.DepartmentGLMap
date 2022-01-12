<template>
  <el-row :gutter="20">
    <el-col v-for="item in use_data" :key="item" :span="24/use_data.length">
      <NormalPanel height="10rem" :title="data[item].title">
        <el-tooltip :content="`本次累积:${data[item].value}`" style="margin-top:0.8rem;display:block">
          <CountTo
            :start-val="data[item].last"
            :end-val="data[item].cur"
            :suffix="data[item].suffix"
            :decimals="data[item].suffix?2:0"
            class="normal-counter"
            :style="{color:data[item].color}"
          />
        </el-tooltip>
        <el-tooltip :content="`总量累积:${data[`${item}_total`].value}`">
          <CountTo
            :start-val="data[`${item}_total`].last"
            :end-val="data[`${item}_total`].cur"
            :suffix="data[`${item}_total`].suffix"
            :decimals="data[`${item}_total`].suffix?2:0"
            class="normal-counter"
            :style="{color:data[item].color}"
          />
        </el-tooltip>
      </NormalPanel>
    </el-col>
  </el-row>
</template>

<script>
import NormalPanel from '../../components/NormalPanel'
import CountTo from 'vue-count-to'
import { formatSciItem } from '@/utils/math'
export default {
  name: 'Statistics',
  components: { NormalPanel, CountTo },
  data: () => ({
    use_data: ['count_sample', 'count_feature', 'count_checked'],
    data: {
      count_sample: { last: 0, cur: 0, value: 0, to_add: 8 * 10e2, title: '学习样本', suffix: '', color: '#f3f' },
      count_sample_total: { last: 0, cur: 0, value: 0, suffix: '', color: '#f3f' },
      count_feature: { last: 0, cur: 0, value: 0, to_add: 14, title: '形成特征', suffix: '', color: '#3f3' },
      count_feature_total: { last: 0, cur: 0, value: 0, suffix: '', color: '#3f3' },
      count_checked: { last: 0, cur: 0, value: 0, to_add: 5 * 10e1, title: '检验威胁', suffix: '', color: '#f33' },
      count_checked_total: { last: 0, cur: 0, value: 0, suffix: '', color: '#f33' },
    },
    refresher: null
  }),
  mounted() {
    const r = 2 + new Date().getMinutes() * 0.01 + new Date().getHours() * 0.6 + new Date().getDay() * 18
    this.refresh(r * 10e2)
  },
  methods: {
    handle_single(item, rate = 1, to_add_raw) {
      const to_add = to_add_raw !== undefined ? to_add_raw : item.to_add
      item.value = Math.floor(item.value + (Math.random() * 0.3 + 0.7) * (to_add * rate))
      const v = formatSciItem(item.value)
      item.last = item.cur
      item.cur = v.value
      item.suffix = v.suffix
      return to_add
    },
    refresh(rate_total = 1) {
      if (this.refresher) clearTimeout(this.refresher)
      for (let i = 0; i < this.use_data.length; i++) {
        const item_key = this.use_data[i]
        const item = this.data[item_key]
        const item_total = this.data[`${item_key}_total`]
        const to_add_raw = this.handle_single(item)
        this.handle_single(item_total, rate_total, to_add_raw)
      }
      this.refresher = setTimeout(() => this.refresh(), 5000)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style';
%size24 {
  font-size: 2.4rem;
}
.size-12 {
  font-size: 1.8rem;
}
.normal-counter {
  @extend %size24;
  letter-spacing: normal;
}
</style>
