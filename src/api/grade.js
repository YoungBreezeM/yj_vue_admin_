import request from '@/utils/request'

export function getGradeList(startNum, pageSize) {
  console.log(startNum, pageSize)
  return request({
    url: '/grade/page/' + startNum + '/' + pageSize,
    method: 'get'
  })
}

export function getGradeListByName(startNum, pageSize, name) {
  console.log(startNum, pageSize)
  return request({
    url: '/grade/page/' + startNum + '/' + pageSize + '/' + name,
    method: 'get'
  })
}

export function getGrade() {
  return request({
    url: '/grade',
    method: 'get'
  })
}

export function updateGradeList(Video) {
  return request({
    url: '/grade',
    method: 'post',
    data: Video
  })
}

export function addGrade(Video) {
  return request({
    url: '/grade',
    method: 'put',
    data: Video
  })
}

export function deleteGrade(id) {
  return request({
    url: '/grade/' + id,
    method: 'delete'
  })
}
