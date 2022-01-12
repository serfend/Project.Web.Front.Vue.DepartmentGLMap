
/**
 * 判断当前值并缩小值范围，同时带上单位
 *
 * @export
 * @param {int} value
 * @param {int} decimal
 */
export function formatSciItem(value, decimal = 2) {
  let suffix = ''
  if (value > 10e12) {
    suffix = 'T'
    value /= 10e11
  } else if (value > 10e9) {
    suffix = 'G'
    value /= 10e8
  } else if (value > 10e6) {
    suffix = 'M'
    value /= 10e5
  } else if (value > 10e3) {
    suffix = 'K'
    value /= 10e2
  }
  const f = Math.pow(10, decimal)
  return { value: Math.round(value * f) / f, suffix }
}

/**
 * 获取一个指定范围的正态随机值
 *
 * @export
 * @param {*} mean 均值
 * @param {*} std_dev 标差
 * @param {*} min 限定最小值
 * @param {*} max 限定最大值
 * @returns
 */
export function getNumberInNormalDistribution(mean, std_dev, min, max) {
  const r = mean + (uniform2NormalDistribution() * std_dev)
  return r < min ? min : (r > max ? max : r)
}

export function uniform2NormalDistribution(precision_iteration = 12) {
  let sum = 0.0
  for (let i = 0; i < precision_iteration; i++) {
    sum = sum + Math.random()
  }
  return sum - precision_iteration / 2
}
