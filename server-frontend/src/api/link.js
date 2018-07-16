import request from '@/utils/request'

export function fetchLinks(query) {
  return request({
    url: '/netflow/',
    method: 'get',
    params: query
  })
}

export function getLinksCount(query) {
  return request({
    url: '/netflow/count',
    method: 'get',
    data: query
  })
}

export function netflowSearch(query) {
  return request({
    url: '/netflow/search',
    method: 'post',
    data: query
  })
}
