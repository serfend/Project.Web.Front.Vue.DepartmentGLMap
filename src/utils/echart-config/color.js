import * as echarts from 'echarts'

export function getGradient(primaryColor) {
  var c = Object.values(hexTorgb(primaryColor)).join(',')
  var r = [{
    offset: 0,
    color: `rgba(${c}, 0.4)` // 渐变色的起始颜色
  }, {
    offset: 0.8,
    color: `rgba(${c}, 0.1)` // 渐变线的结束颜色
  }]
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, r, false)
}

const rgbIndex = ['r', 'g', 'b']

/**
 * #ff00ff to {r:,g:,b:}
 *
 * @export
 * @param {*} rgbHEX
 * @returns
 */
export function hexTorgb(rgbHEX) {
  var r = {}
  for (var i = 0; i < rgbIndex.length; i++) {
    var index = i * 2 + 1
    r[rgbIndex[i]] = hexToint(rgbHEX.slice(index, index + 2))
  }
  return r
}

export function hexToint(hex) {
  return parseInt(`0x${hex}`)
}
