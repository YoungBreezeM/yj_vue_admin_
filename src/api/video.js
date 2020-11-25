import request from '@/utils/request'

export function getVideoCategoryList(startNum, pageSize) {
  console.log(startNum, pageSize)
  return request({
    url: '/videoCategory/page/' + startNum + '/' + pageSize,
    method: 'get'
  })
}

export function getVideoCategoryListByName(startNum, pageSize, name) {
  console.log(startNum, pageSize)
  return request({
    url: '/videoCategory/page/' + startNum + '/' + pageSize + '/' + name,
    method: 'get'
  })
}

export function getVideoCategory() {
  return request({
    url: '/videoCategory',
    method: 'get'
  })
}

export function updateVideoCategoryList(Video) {
  return request({
    url: '/videoCategory',
    method: 'post',
    data: Video
  })
}

export function addVideoCategory(Video) {
  return request({
    url: '/videoCategory',
    method: 'put',
    data: Video
  })
}

export function deleteVideoCategory(id) {
  return request({
    url: '/videoCategory/' + id,
    method: 'delete'
  })
}

export function getVideoList(startNum, pageSize) {
  console.log(startNum, pageSize)
  return request({
    url: '/video/page/' + startNum + '/' + pageSize,
    method: 'get'
  })
}

export function getVideoListByCid(startNum, pageSize, categoryId) {
  console.log(startNum, pageSize)
  return request({
    url: '/video/page/' + startNum + '/' + pageSize + '/' + categoryId,
    method: 'get'
  })
}

export function getVideo() {
  return request({
    url: '/video',
    method: 'get'
  })
}

export function updateVideoList(video) {
  return request({
    url: '/video',
    method: 'put',
    data: video
  })
}

export function deleteVideo(id) {
  return request({
    url: '/video/' + id,
    method: 'delete'
  })
}
