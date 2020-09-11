<template>
  <div id="app">
    <router-view class="wrap" :class="{ 'outside': showNav }" />

  </div>
</template>

<script>
// import Login from './components/Login'
export default {
  name: 'App',
  components: {
    // Login
  },
  computed: {
    showNav () {
      return this.$route.matched.some(record => record.meta.nav)
    }
  }
}
</script>

<style lang="scss">
.van-overlay {
  background-color: rgba(0,0,0,0.85);
}
.loading {
  margin: 0 auto;
  padding: 0;
  min-width: auto;
  width: 1.866667rem;
  height: 1.866667rem;
  background-image: url(./assets/img/loading.png);
  background-repeat: no-repeat;
  background-size: 31.733333rem 1.866667rem;
  border-radius: .266667rem;
  animation: loading 1s steps(1, end) infinite;
  @keyframes loading {
    0%,
    29.7%,
    33.0%,
    36.3%,
    39.6%,
    42.9%,
    72.6%,
    75.9%,
    79.2%,
    82.5%,
    85.8%,
    89.1%,
    92.4%,
    95.7%,
    100% {
      background-position-x: -0 * 1.866667rem;
    }
    3.3% {
      background-position-x: -1 * 1.866667rem;
    }
    6.6% {
      background-position-x: -2 * 1.866667rem;
    }
    9.9% {
      background-position-x: -3 * 1.866667rem;
    }
    13.2% {
      background-position-x: -4 * 1.866667rem;
    }
    16.5% {
      background-position-x: -5 * 1.866667rem;
    }
    19.8% {
      background-position-x: -6 * 1.866667rem;
    }
    23.1% {
      background-position-x: -7 * 1.866667rem;
    }
    26.4% {
      background-position-x: -8 * 1.866667rem;
    }
    46.2% {
      background-position-x: -9 * 1.866667rem;
    }
    49.5% {
      background-position-x: -10 * 1.866667rem;
    }
    52.8% {
      background-position-x: -11 * 1.866667rem;
    }
    56.1% {
      background-position-x: -12 * 1.866667rem;
    }
    59.4% {
      background-position-x: -13 * 1.866667rem;
    }
    62.7% {
      background-position-x: -14 * 1.866667rem;
    }
    66.0% {
      background-position-x: -15 * 1.866667rem;
    }
    69.3% {
      background-position-x: -16 * 1.866667rem;
    }
  }
}
.wrap {
  box-sizing: border-box;
  min-height: 100vh;
  overflow: hidden;
  background-size: 100%;
  background-attachment: fixed;
  &.outside {
    padding-bottom: 1.44rem;
  }
}
.nav {
  height: 1.44rem;
  background:linear-gradient(270deg,rgba(38,43,85,1) 0%,rgba(29,33,72,1) 100%);
  .icon {
    display: block;
    width: .533333rem;
    height: .533333rem;
    background-repeat: no-repeat;
    background-size: 100%;
  }
  .van-tabbar-item__icon {
    margin-bottom: .133333rem;
  }
  .van-tabbar-item__text {
    position: relative;
    font-size:.32rem;
    font-family:PingFangSC;
    font-weight:400;
    line-height:.426667rem;
    letter-spacing:.026667rem;
  }
  .promotion {
    position: absolute;
    bottom: .76rem;
    right: -0.28rem;
    width: .373333rem;
    height: .373333rem;
    background-size: 100%;
  }
}
</style>
