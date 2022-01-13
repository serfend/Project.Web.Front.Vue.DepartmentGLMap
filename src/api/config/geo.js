import request from '@/utils/request'
import { cached_data } from '@/utils/cache'
const api = '/config/geo'
export function loadMap (codepath) {
  const path = `${api}/${codepath}`
  return cached_data(path, () => {
    return request.get(`${path}.geoJson`)
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
