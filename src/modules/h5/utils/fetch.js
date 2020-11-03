import axios from 'axios'
import { Toast } from 'vant'
import store from '../store'
// import router from '../router'

class Fetch {
  constructor (baseURL) {
    this.instance = axios.create({
      baseURL: baseURL,
      timeout: 30000,
      headers: {
        'Accept': 'application/json'
      },
      params: store.state.utm
    })
    this.instance.interceptors.request.use(...this.request())
    this.instance.interceptors.response.use(...this.response())
  }
  request () {
    return [
      function (config) {
        if (config.loading !== 'none') {
          Toast({
            className: 'loading',
            duration: 0
          })
        }

        const token = store.state.token
        if (token) {
          config.headers['Authorization'] = token
        }
        return config
      },
      function (error) {
        if (error.config.loading !== 'none') {
          Toast.clear()
        }

        return Promise.reject(error)
      }
    ]
  }
  response () {
    return [
      function (response) {
        if (response.config.loading !== 'none') {
          Toast.clear()
        }

        if (response.data.meta) {
          response.data.code = response.data.meta.code
          response.data.message = response.data.meta.message
        }
        if (response.data.code !== 0) {
          // Toast({
          //   message: response.data.message,
          //   onClose: () => {
          //     if (response.data.code === 401) {
          //       store.commit('setToken', '')
          //       router.replace('/')
          //     }
          //   }
          // })
          if (response.data.code === 401) {
            store.commit('setToken', '')
            store.commit('setShowLogin', true)
          } else if (response.data.code === 402) {
            store.commit('setToken', '')
          } else if (response.data.code === 80155) {
            console.log("不符合条件");
          } else {
            Toast(response.data.message)
          }
        }
        return response
      },
      function (error) {
        if (error.config.loading !== 'none') {
          Toast.clear()
        }

        return Promise.reject(error)
      }
    ]
  }
}

// let couponApi = 'https://bus-api.lianjifen.com/yunjiafen' //正式环境
let couponApi = 'http://staging-bus-api.lianjifen.com/yunjiafen' //测试环境
// if (process.env.NODE_ENV !== 'production') {
//   hotelsApi = 'https://staging-hotel.lianjifen.com'
//   pointsApi = 'https://staging-rjapp.lianjifen.com'
//   ruyuApi = 'https://staging-rjapp.lianjifen.com'
// }

const coupon = new Fetch(couponApi + '/ticket/open/api/v1/marketing').instance
export default {

  coupon
}
