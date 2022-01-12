
// 获取url中的参数
export function getUrlParam(url, name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`) // 构造一个含有目标参数的正则表达式对象
  url = url.substring(url.indexOf('?')).replace('?', '&')
  const r = url.match(reg) // 匹配目标参数
  if (r != null) return decodeURI(r[2])
  return null // 返回参数值
}
const Mock = require('mockjs')
export function useMock() {
  // 首先引入Mock

  // 设置拦截ajax请求的相应时间
  Mock.setup({
    timeout: '200-600'
  })

  let configArray = []

  // 使用webpack的require.context()遍历所有mock文件
  const files = require.context('.', true, /\.js$/)
  files.keys().forEach((key) => {
    if (key === './index.js') return
    configArray = configArray.concat(files(key).default)
  })

  // 注册所有的mock服务
  configArray.forEach((item) => {
    for (var [path, target] of Object.entries(item)) {
      const protocol = path.split('|')
      Mock.mock(new RegExp(protocol[1]), protocol[0], target)
    }
  })
}
export function toResult(result) {
  return {
    status: 0,
    message: null,
    data: result
  }
}
export default {
  getUrlParam,
  useMock,
  toResult,
  Mock
}
