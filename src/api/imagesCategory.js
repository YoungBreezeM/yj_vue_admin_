import request from '@/utils/request'

export function getImagesCategoryList(startNum, pageSize) {
  console.log(startNum, pageSize)
  return request({
    url: '/imagesCategory/page/' + startNum + '/' + pageSize,
    method: 'get'
  })
}

export function getImagesCategoryListByName(startNum, pageSize, name) {
  console.log(startNum, pageSize)
  return request({
    url: '/imagesCategory/page/' + startNum + '/' + pageSize + '/' + name,
    method: 'get'
  })
}

export function getImagesCategory() {
  return request({
    url: '/imagesCategory',
    method: 'get'
  })
}

export function updateImagesCategoryList(Images) {
  return request({
    url: '/imagesCategory',
    method: 'post',
    data: Images
  })
}

export function addImagesCategory(Images) {
  return request({
    url: '/imagesCategory',
    method: 'put',
    data: Images
  })
}

export function deleteImagesCategory(id) {
  return request({
    url: '/imagesCategory/' + id,
    method: 'delete'
  })
}
