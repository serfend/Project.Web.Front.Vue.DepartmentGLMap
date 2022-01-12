import mock from './index'
import { getNumberInNormalDistribution } from '@/utils/math'
const Random = mock.Mock.Random
import warning from '@/api/connection/warning'
import { getSortedByWeight, getRandomByWeightWithSortedList } from '@/utils/math/random'
const weights_warning_rank = warning.warning_rank.map((i, index) => ({
  v: i,
  w: Math.pow(warning.warning_rank.length - index, 3)
}))

const warning_rank = getSortedByWeight(weights_warning_rank.map(i => i.v), weights_warning_rank.map(i => i.w))
const new_connection = function (count) {
  const result = []
  for (let i = 0; i < count; i++) {
    const pkg_total = Math.floor(getNumberInNormalDistribution(4 * 10e3, 10e3, 0))
    result.push({
      id: Random.guid(),
      host: Random.ip(),
      warning_rank: getRandomByWeightWithSortedList(warning_rank),
      warning: Math.floor(getNumberInNormalDistribution(0, 80, 0)),
      connection: {
        total: Math.floor(getNumberInNormalDistribution(4 * 10e1, 10e1, 0))
      },
      package: {
        total: pkg_total,
        warning: Math.floor(pkg_total * (0.5 * Math.random() + 0.5) * 0.002)
      }
    })
  }
  return result
}
let last_update = new Date('2020-11-1')
let connections_raw = []
// 懒加载数据数量
let base_count = 0
const connections = function (pageIndex, pageSize) {
  for (let i = 0; connections_raw[i] && !connections_raw[i].handled; i++) {
    connections_raw[i].handled = true
  }
  if (!pageIndex) pageIndex = 0
  if (!pageSize) pageSize = 20
  let new_count = (new Date() - last_update) / 350
  last_update = new Date()
  if (new_count > 10) base_count += Math.floor(new_count - 10)
  else new_count += Math.random() * 3
  const l = new_connection(new_count > 10 ? 10 : Math.floor(new_count))
  connections_raw = l.concat(connections_raw)
  const start = pageIndex * pageSize
  const end = start + pageSize
  const result = {
    totalCount: connections_raw.length + base_count,
    list: connections_raw.slice(start, end)
  }
  return result
}

export default {
  'get|/connection/list': option => {
    const pageSize = mock.getUrlParam(option.url, 'pageSize')
    const pageIndex = mock.getUrlParam(option.url, 'pageIndex')
    return mock.toResult(connections(pageIndex, pageSize))
  }
}
