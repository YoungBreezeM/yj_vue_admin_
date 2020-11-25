import request from '@/utils/request'

export function getGuaList() {
  return request({
    url: '/gua',
    method: 'get'
  })
}
