import fetch from '../utils/fetch'

export function home () {
  return fetch.browser('/account/home', {
    method: 'GET'
  })
}
