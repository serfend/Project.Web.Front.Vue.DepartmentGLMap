import request from '@/utils/request'

export function get_global_configuration () {
  return request.get('/config/global.json', {
    params: {
    }
  })
}
