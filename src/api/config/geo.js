import request from '@/utils/request'
import { cached_data } from '@/utils/cache'
const api = '/config/geo'
export function loadMap (codepath) {
  const path = `${api}/${codepath}`
  return cached_data(path, () => {
    return request.get(`${path}.geoJson`)
  })
}
const apiRoom = '/data/entity/room'

/**
 * 加载房间信息
 *
 * @export
 * @param {*} codepath
 * @return {*}
 */
export function loadRoom(codepath) {
  const path = `${apiRoom}/${codepath}`
  return request.get(`${path}.json`)
}

/**
 * 加载房间列表
 *
 * @export
 * @param {*} { pageIndex, pageSize }
 * @return {*}
 */
export function loadRoomList({ pageIndex, pageSize }) {
  const path = `${apiRoom}/index`
  return request.get(`${path}.json`, {
    params: { pageIndex, pageSize }
  })
}
export function loadLocations() {
  const url = 'config/geo.json'
  return cached_data(url, () => {
    return request.get(url)
  })
}

export default {
  loadMap, loadLocations
}
