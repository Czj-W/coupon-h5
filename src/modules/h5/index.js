
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import 'lib-flexible/flexible.js'

import Vant, { Toast } from 'vant'
import 'vant/lib/index.css'
import './assets/css/service.scss'

import * as fundebug from 'fundebug-javascript'
import fundebugVue from 'fundebug-vue'
import 'fundebug-revideo'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

fundebug.init({
  apikey: '99f320abd2dd0447faa1611a1772ee5505d9502ab4f538f9fe7a1c286bb376ea'
})
fundebugVue(fundebug, Vue)

Vue.use(Vant)

Toast.setDefaultOptions({
  forbidClick: true,
  duration: 2000
})

Vue.config.productionTip = false

const route = router.resolve(location.hash.replace('#', '')).route
const params = route.params
const query = route.query
const {
  bp_authorization: token,
  phone: user,
  user_id: userHash,
  ...rest
} = query
if (token) {
  store.commit('setToken', token)
  store.commit('setUser', user)
  store.commit('setUserHash', userHash)
}
Vue.prototype.$uploadEvent = (event = '', params = {}) => {
  if (window._hmt) {
    window._hmt.push(['_trackEvent', event, Object.keys(params).join(',') || 'click', Object.values(params).join(',')])
  }
}

store.commit('setUtm', {
  utm_source: query.utm_source,
  utm_campaign: query.utm_campaign,
  utm_medium: query.utm_medium,
  utm_content: query.utm_content,
  utm_term: query.utm_term
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  beforeCreate () {
    router.replace({
      path: route.path,
      params: params,
      query: rest
    })
  },
  render: h => h(App)
})
