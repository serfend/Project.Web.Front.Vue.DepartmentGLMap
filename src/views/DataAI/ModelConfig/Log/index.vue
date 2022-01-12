<template>
  <NormalPanel :can-save="canSave" :height="'25rem'" @requireSave="requireSave">
    <el-table :data="list_items" class="normal-text normal-form">
      <el-table-column label="时间" width="220rem">
        <template slot-scope="scope">{{ parseTime(scope.row.date,'{y}-{m}-{d} {h}:{i}:{s}.{l}') }}</template>
      </el-table-column>
      <el-table-column label="来源" width="150rem">
        <template slot-scope="scope">{{ scope.row.src }}</template>
      </el-table-column>
      <el-table-column label="事项">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100rem">
        <template slot-scope="scope">
          <el-tag :type="scope.row.result=='成功'?'success':'danger'">{{ scope.row.result }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </NormalPanel>
</template>

<script>
import NormalPanel from '../../components/NormalPanel'
import { parseTime } from '@/utils'
import { getSortedByWeight, getRandomByWeightWithSortedList } from '@/utils/math/random'
import { sortby } from '@/utils/math/algorithm'
const sortByDate = sortby('date', 'desc')
import Mock from 'mockjs'

const events_list = [{ v: '用户登录', w: 15 }, { v: '新的特征学习完成，投入检测', w: 8 }, { v: '修改密码', w: 1 }, { v: '服务访问', w: 10 }, { v: '高权值告警，可能存在异常流量', w: 55 }]
const events_list_sorted = getSortedByWeight(events_list.map(i => i.v), events_list.map(i => i.w))

const type_list_sorted = getSortedByWeight(['成功', '失败'], [90, 10])
const refreshInterval = 1500
export default {
  name: 'Log',
  components: { NormalPanel },
  props: {
    title: {
      type: String,
      default: null
    }
  },
  data: () => ({
    refresher: null,
    canSave: false,
    list_items: []
  }),
  mounted() {
    const list = this.generate('10')
    this.push_item(list)
    this.refresh()
  },
  methods: {
    parseTime,
    refresh() {
      if (this.refresher) clearTimeout(this.refresher)
      const list = this.generate('4-6')
      this.push_item(list)
      this.refresher = setTimeout(() => { this.refresh() }, refreshInterval + Math.random() * 1000)
    },
    push_item(list) {
      this.list_items = list.concat(this.list_items).slice(0, 10)
    },
    generate(countstr) {
      const item = {}
      item[`list|${countstr}`] =
        [{
          date: null,
          src: '@ip',
          content: () => getRandomByWeightWithSortedList(events_list_sorted),
          'result|1': () => getRandomByWeightWithSortedList(type_list_sorted)
        }]

      const list = Mock.mock(item).list.map(i => {
        i.date = new Date() - refreshInterval * Math.random()
        return i
      })
      return list.sort(sortByDate)
    },
    requireSave(cb) {
      cb()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style';
</style>
