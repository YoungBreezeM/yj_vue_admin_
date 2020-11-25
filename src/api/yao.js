import request from '@/utils/request'

export function getYaoListPage(startNum, pageSize) {
  return request({
    url: '/yao/page/' + startNum + '/' + pageSize,
    method: 'get'
  })
}

export function getYaoListPageName(startNum, pageSize, name) {
  return request({
    url: '/yao/page/' + startNum + '/' + pageSize + '/' + name,
    method: 'get'
  })
}

export function getYaoList() {
  return request({
    url: '/yao',
    method: 'get'
  })
}
export function getYaoListByBaseGuaId(id) {
  return request({
    url: '/yao/' + id,
    method: 'get'
  })
}

export function updateYaoList(yao) {
  return request({
    url: '/yao',
    method: 'post',
    data: yao
  })
}

export function addYao(yao) {
  return request({
    url: '/yao',
    method: 'put',
    data: yao
  })
}

export function deleteYao(id) {
  return request({
    url: '/yao/' + id,
    method: 'delete'
  })
}
