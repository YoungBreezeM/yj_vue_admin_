import request from '@/utils/request'

export function getPredictionPage(startNum, pageSize) {
  console.log(startNum, pageSize)
  return request({
    url: '/prediction/page/' + startNum + '/' + pageSize,
    method: 'get'
  })
}

export function getPredictionPageCidAndGid(startNum, pageSize, guaId, categoryId) {
  return request({
    url: '/prediction/page/' + startNum + '/' + pageSize + '/' + guaId + '/' + categoryId,
    method: 'get'
  })
}

export function updatePrediction(data) {
  return request({
    url: '/prediction',
    method: 'post',
    data: data
  })
}

export function addPrediction(data) {
  return request({
    url: '/prediction',
    method: 'put',
    data: data
  })
}

export function deletePrediction(id) {
  return request({
    url: '/prediction/' + id,
    method: 'delete'
  })
}
