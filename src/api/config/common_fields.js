import request from '@/utils/request'

/**
 * 加载字段
 *
 * @export
 * @return {*}
 */
export function loadFields () {
  return request.get(`/data/extend_fields.json`)
}

/**
 * 获取数据库
 *
 * @export
 * @return {*}
 */
export function loadDatas() {
  return request.get(`/data/targets.json`)
}
