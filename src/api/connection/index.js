import request from '@/utils/request'
export function get_connection_list(pageIndex, pageSize) {
  return request.get('/connection/list', {
    params: { pageIndex, pageSize }
  })
}

export function get_connection_detail(host) {
  return request.get('/connection/detail', {
    params: { host }
  })
}
