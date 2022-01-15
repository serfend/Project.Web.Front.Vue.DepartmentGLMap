/**
 * 获取中心时间配置
 *
 * @export
 * @returns
 */
export function timeZone() {
  return new Promise((res, rej) => {
    const d = {
      left: {
        name: '天文时间',
        value: new Date()
      },
      right: {
        name: '北京时间',
        value: new Date()
      }
    }
    res(d)
  })
}
