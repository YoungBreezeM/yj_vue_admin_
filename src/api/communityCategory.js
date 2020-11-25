import request from '@/utils/request'

export function getCommunityCategoryList(startNum, pageSize) {
  console.log(startNum, pageSize)
  return request({
    url: '/communityCategory/page/' + startNum + '/' + pageSize,
    method: 'get'
  })
}

export function getCommunityCategoryByName(startNum, pageSize, name) {
  console.log(startNum, pageSize)
  return request({
    url: '/communityCategory/page/' + startNum + '/' + pageSize + '/' + name,
    method: 'get'
  })
}

export function getCommunityCategory() {
  return request({
    url: '/communityCategory',
    method: 'get'
  })
}

export function updateCommunityCategoryList(data) {
  return request({
    url: '/communityCategory',
    method: 'post',
    data: data
  })
}

export function addCommunityCategory(data) {
  return request({
    url: '/communityCategory',
    method: 'put',
    data: data
  })
}

export function deleteCommunityCategory(id) {
  return request({
    url: '/communityCategory/' + id,
    method: 'delete'
  })
}
