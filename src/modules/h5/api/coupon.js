import fetch from '../utils/fetch'

export function getCoupon (data) {
  return fetch.coupon('/contractEvent', {
    method: 'POST',
    data
  })
}
export function getDetail (data) {
  return fetch.coupon('/ticket/list', {
    method: 'GET',
    params: data
  })
}
export function getHistoryInfo (data) {
  return fetch.coupon('/ticketInfo', {
    method: 'GET',
    params: data
  })
}
export function getHistoryList (data) {
  return fetch.coupon('/ticketInfo/list', {
    method: 'GET',
    params: data
  })
}
