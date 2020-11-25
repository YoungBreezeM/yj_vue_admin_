import request from '@/utils/request'

export function getPredictionCategoryPage(startNum, pageSize) {
  console.log(startNum, pageSize)
  return request({
    url: '/predictionCategory/page/' + startNum + '/' + pageSize,
    method: 'get'
  })
}

export function getPredictionCategoryList() {
  return request({
    url: '/predictionCategory',
    method: 'get'
  })
}

export function updatePredictionCategory(data) {
  return request({
    url: '/predictionCategory',
    method: 'post',
    data: data
  })
}

export function addPredictionCategory(data) {
  return request({
    url: '/predictionCategory',
    method: 'put',
    data: data
  })
}

export function deletePredictionCategory(id) {
  return request({
    url: '/predictionCategory/' + id,
    method: 'delete'
  })
}
