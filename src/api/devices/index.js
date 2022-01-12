import request from '@/utils/request'
export function get_device_list() {
  return request.get('/devices/list')
}

export function get_device_detail(id) {
  return request.get('/devices/detail', {
    params: { id }
  })
}

export function get_device_summary(date) {
  return request.get('/devices/summary', {
    params: {
      date
    }
  })
}
