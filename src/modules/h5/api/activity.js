import fetch from '../utils/fetch'

export function info (data) {
  return fetch.activity('/points_event/sign_in/info', {
    method: 'GET',
    params: data
  })
}

export function signIn (data) {
  return fetch.activity('/points_event/sign_in', {
    method: 'POST',
    data
  })
}

export function chain (data) {
  return fetch.activity('/points_event/sign_in/chain', {
    loading: 'none',
    method: 'GET',
    params: data
  })
}
