import Vue from 'vue'
import Vuex from 'vuex'
import dayjs from 'dayjs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    adPointContractId: '',
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('user') || '',
    userHash: localStorage.getItem('userHash') || '',
    date: [
      dayjs().format('YYYY-MM-DD'),
      dayjs().add(1, 'day').format('YYYY-MM-DD')
    ],
    city: {
      location: {
        code: '0210',
        name: '',
        lat: '',
        lng: ''
      },
      cur: {
        code: '',
        name: ''
      },
      history: []
    },
    search: {
      value: '',
      lat: '',
      lng: ''
    },
    contact: {
      name: '',
      phone: ''
    },
    order: {},
    invoices: {
      order_nos: [],
      amount: 0
    },
    record: {},
    utm: {},
    showLogin: false
  },
  getters: {
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem('token', token || '')
    },
    setID (state, adPointContractId) {
      state.adPointContractId = adPointContractId
    },
    setUser (state, value) {
      state.user = value
      localStorage.setItem('user', value || '')
    },
    setUserHash (state, value) {
      state.userHash = value
      localStorage.setItem('userHash', value || '')
    },
    setDate (state, date) {
      state.date = date
    },
    setCity (state, city) {
      state.city.cur = city
    },
    setcityLocation (state, city) {
      state.city.location = city
    },
    setCityHistory (state, city) {
      state.city.history.push(city)
    },
    setSearch (state, search) {
      state.search = search
    },
    setContact (state, contact) {
      state.contact = contact
    },
    setOrder (state, order) {
      state.order = order
    },
    setInvoices (state, invoices) {
      state.invoices = invoices
    },
    setRecord (state, record) {
      state.record = record
    },
    setUtm (state, utm) {
      state.utm = utm
    },
    setShowLogin (state, showLogin) {
      state.showLogin = showLogin
    }
  },
  actions: {
  }
})
