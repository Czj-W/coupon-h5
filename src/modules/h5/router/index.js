import Vue from 'vue'
import Router from 'vue-router'
import { Toast } from 'vant'
// import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      component: { render: h => h('router-view') },
      children: [
        {
          path: '',
          component: () => import('../views/Home'),
          meta: { title: '优惠券详情', nav: true }
        },
        {
          path: '/history',
          component: () => import('../views/Home/history'),
          meta: { title: '领取记录' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title
  if (title) {
    document.title = title
  }

  // if (store.state.token) {
  //   next()
  // } else if (['/', '/ruyu'].includes(to.path)) {
  //   next()
  // } else {
  //   next('/')
  // }
  next()
})

router.afterEach((to, from) => {
  Toast()
  Toast.clear()
})

export default router
