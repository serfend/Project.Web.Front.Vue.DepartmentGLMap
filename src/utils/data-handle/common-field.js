
/**
 * 生成一个数据获取函数
 *
 * @export
 * @param {*} dict
 * @param {*} lambda
 * @return {*}
 */
export function to_property_getter (dict, lambda) {
  return v => lambda(dict, v)
}
