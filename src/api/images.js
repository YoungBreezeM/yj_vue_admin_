import request from '@/utils/request'

export function getImagesList(startNum, pageSize) {
  console.log(startNum, pageSize)
  return request({
    url: '/images/page/' + startNum + '/' + pageSize,
    method: 'get'
  })
}

export function getImagesListByCid(startNum, pageSize, categoryId) {
  console.log(startNum, pageSize)
  return request({
    url: '/images/page/' + startNum + '/' + pageSize + '/' + categoryId,
    method: 'get'
  })
}

export function getImages() {
  return request({
    url: '/images',
    method: 'get'
  })
}

export function updateImagesList(images) {
  return request({
    url: '/images',
    method: 'put',
    data: images
  })
}

export function deleteImages(id) {
  return request({
    url: '/images/' + id,
    method: 'delete'
  })
}
