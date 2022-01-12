import { sortby, dichotomy } from './algorithm'
/**
 * 从指定集合中按权重选取
 *
 * @export
 * @param {*} range
 * @param {*} weights
 */
export function getRandomByWeight(range, weights) {
  const dict = getSortedByWeight(range, weights)
  if (!dict) return null
  // 区间设定
  return getRandomByWeightWithSortedList(dict)
}
const sortByWeight = sortby('w')
/**
 * 获取已排序的集合
 *
 * @export
 * @param {*} range
 * @param {*} weights
 * @returns
 */
export function getSortedByWeight(range, weights) {
  if (!range || !weights || range.length !== weights.length) return null
  const mapped = Object.keys(range).map((i) => ({ v: range[i], w: weights[i] }))
  // 排序列表，首项为权重为0
  const dict = [{ w: 0, v: null }].concat(mapped)
  const sorted_dict = dict.sort(sortByWeight)
  for (let i = 1; i < dict.length; i++) {
    const curW = dict[i - 1].w
    if (curW < 0) throw new RangeError(`${dict[i - 1].v} -> ${dict[i - 1].w} out of range`)
    dict[i].w = Number(dict[i].w) + Number(curW)
  }
  return sorted_dict
}
/**
 * 从已按权值排序的集合获取
 *
 * @export
 * @param {*} dict
 * @returns
 */
export function getRandomByWeightWithSortedList(dict) {
  // 总权重
  const total_weight = dict[dict.length - 1].w
  // 结果
  const val = Math.random() * total_weight
  const result = dichotomy(dict, (lst, i) => lst[i].w < val && lst[i + 1].w > val)
  return dict[result + 1].v
}
