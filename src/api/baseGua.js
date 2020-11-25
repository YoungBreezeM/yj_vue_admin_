import request from '@/utils/request'

export function getBaseGuaList(startNum, pageSize) {
  console.log(startNum,pageSize)
  return request({
    url: '/baseGua/page/'+ startNum + '/'+ pageSize,
    method: 'get'
  })
}

export function getBaseGuaListByName(startNum, pageSize,name) {
  console.log(startNum,pageSize)
  return request({
    url: '/baseGua/page/'+ startNum + '/'+ pageSize + "/" + name,
    method: 'get'
  })
}

export function getBaseGua() {

  return request({
    url: '/baseGua',
    method: 'get'
  })
}

export function updateBaseGuaList(baseGua) {
  return request({
    url: '/baseGua',
    method: 'post',
    data:baseGua
  })
}

export function addBaseGua(baseGua) {
  return request({
    url: '/baseGua',
    method: 'put',
    data:baseGua
  })
}

export function deleteBaseGua(id) {
  return request({
    url: '/baseGua/'+id,
    method: 'delete',
  })
}
