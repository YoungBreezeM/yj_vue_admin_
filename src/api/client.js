import request from '@/utils/request'

export function getClientList(startNum, pageSize) {
  console.log(startNum, pageSize)
  return request({
    url: '/client/page/' + startNum + '/' + pageSize,
    method: 'get'
  })
}

export function getClientListByCid(startNum, pageSize, categoryId) {
  console.log(startNum, pageSize)
  return request({
    url: '/client/page/' + startNum + '/' + pageSize + '/' + categoryId,
    method: 'get'
  })
}

export function getClient() {
  return request({
    url: '/client',
    method: 'get'
  })
}

export function addClient(client) {
  return request({
    url: '/client',
    method: 'put',
    data: client
  })
}

export function updateClientList(client) {
  return request({
    url: '/client',
    method: 'post',
    data: client
  })
}

export function deleteClient(id,admin) {
  return request({
    url: '/client/' + id,
    method: 'delete',
    data:admin
  })
}
