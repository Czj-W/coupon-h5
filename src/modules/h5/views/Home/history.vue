<template>
  <div class="list">
    <div class="header">
      <!-- <div @click="$router.go(-1)" class="back">返回上一页</div> -->
      <div class="box">
        <div class="item" :class="[index_act===0?'item_act':'']" @click="handleClick(0)">
          全部
          <div class="fenge" v-if="index_act===0"></div>
        </div>
        <div class="item" :class="[index_act===1?'item_act':'']" @click="handleClick(1)">
          已使用
          <div class="fenge" v-if="index_act===1"></div>
        </div>
        <div class="item" :class="[index_act===2?'item_act':'']" @click="handleClick(2)">
          已失效
          <div class="fenge" v-if="index_act===2"></div>
        </div>
      </div>
    </div>
    <div class="scroll-div-style" v-if="list.length>0">
      <div class="con" v-for="(item,index) in list" :key="index">
        <div class="info">
          <img :src="item.logoUrl" alt />
          <div class="name">{{item.name}}</div>
        </div>
        <div class="coupon" :class="item.status===1||item.status===2?'noUse':''">
          <div class="msg">
            <div class="rmb"><span v-if="item.ticketType===0||item.ticketType===4">¥</span>{{item.amount}}<span v-if="item.ticketType===1">%</span>
            </div>
            <div class="coupn-info">
              <div class="name">{{item.title}}</div>
              <div class="time">有效期{{item.startTime}}-{{item.endTime}}</div>
              <div class="rule" @click="openDetail(item,'rule')">使用规则</div>
            </div>
          </div>
          <div class="btn" @click="openDetail(item,'coupon')" v-if="item.status===0">去使用</div>
          <div class="btn used" v-if="item.status===1">已使用</div>
          <div class="btn used" v-if="item.status===2">已过期</div>
        </div>
      </div>
    </div>
    <div class="scroll-div-style" v-else>
      <div class="list-msg">暂无{{index_act===1?'使用':(index_act===2?'失效':'领取')}}记录喔</div>
    </div>
    <div class="mask-rule" v-if="isShowMaskRule">
      <div class="mask-rule-con">
        <div class="title">使用规则</div>
        <div class="time">
          <div class="num">1</div>
          有效期：{{couponInfo.startTime}}-{{couponInfo.endTime}}
        </div>
        <div class="rule-txt">
          <div class="num">2</div>规则：
        </div>
        <pre class="txt">{{couponInfo.useCondition}}</pre>
        <div class="close" @click="closeMaskRule"></div>
      </div>
    </div>
    <div class="mask" @click="closeMask" v-if="isShowMask">
      <div class="mask-box" @click.stop="">
        <div class="mask-box-header">
          <div class="info">
            <img :src="couponInfo.logoUrl" alt />
            <div class="name">{{couponInfo.name}}</div>
          </div>
          <div class="close" @click.stop="closeMask"></div>
        </div>
        <div class="mask-box-coupon">
          <div class="num">
            <span v-if="couponInfo.ticketType===0||couponInfo.ticketType===4">¥</span>
            {{couponInfo.amount}}
            <span v-if="couponInfo.ticketType===1">%</span>
          </div>
          <div class="txt">{{couponInfo.title}}</div>
        </div>
        <div class="used-box">
          <div class="used-title">—— 使用指南 ——</div>
          <div class="qr-code" @click="saveImg"><img src="https://img-gewu.jifenone.com/images/rujia-shenhan.jpg" alt /> </div>
          <div class="item">
            <div class="step1">
              <div class="title">step1：打开小程序</div>
              <div class="txt">1.长按微信小程序码保存图片</div>
              <div class="txt">2.打开微信扫码，进入深航服务小程序</div>
              <div class="txt">3.注册并登录小程序账号</div>
              <div class="txt">4.点击我的-优惠券，可直接查看使用</div>
            </div>
            <!-- <img class="code" src alt /> -->
          </div>
          <div class="item mb20">
            <div class="step1">
              <div class="title">step2: 优惠券兑换</div>
              <div class="txt">1.复制兑换码</div>
              <div class="txt">2.打开深航服务小程序优惠券中兑换码输入入口</div>
              <div class="txt">3.输入兑换码，兑换优惠券</div>
              <div class="txt">4.兑换成功后，在深航服务小程序中可使用优惠券</div>
            </div>
          </div>
          <div class="copy-box" @click.stop="copy(couponInfo.code)">
            <div class="txt">兑换码：{{couponInfo.code}}</div>
            <div class="btn">复制</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { getHistoryList } from '../../api/coupon'
// import store from '../../store'
const moment = require('moment')

export default {
  name: 'history',
  data () {
    return {
      index_act: 0,
      list: [],
      isShowMask: false,
      isShowMaskRule: false,
      couponInfo: '',
      timeOutEvent: ''
    }
  },
  created () {
    this.getHistory()
  },
  methods: {
    handleClick (e) {
      this.index_act = +e
      this.getHistory()
    },
    catchtap () {},
    closeMask () {
      this.isShowMask = !this.isShowMask
    },
    closeMaskRule () {
      this.isShowMaskRule = !this.isShowMaskRule
    },
    saveImg () {
      let that = this
      this.timeOutEvent = setTimeout(function () {
        that.savePicture('https://img-gewu.jifenone.com/images/rujia-shenhan.jpg')
      }, 500)
    },
    savePicture (Url) {
      let blob = new Blob([''], {type: 'application/octet-stream'})
      let url = URL.createObjectURL(blob)
      let a = document.createElement('a')
      a.href = Url
      a.download = Url.replace(/(.*\/)*([^.]+.*)/ig, '$2').split('?')[0]
      let e = document.createEvent('MouseEvents')
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
      URL.revokeObjectURL(url)
    },

    copy (e) {
      this.$copyText(e)
        .then((res) => {
          Toast.success('复制成功')
          console.log('成功')
        })
        .catch((err) => {
          Toast.fail('复制失败')
          console.log(err)
        })
    },
    getHistory () {
      getHistoryList({ status: this.index_act }).then((res) => {
        console.log(res, 123)
        if (res.data.code === 0) {
          let list = res.data.data.list
          list.forEach((v) => {
            v.startTime = moment(v.startTime).format('YYYY/MM/DD')
            v.endTime = moment(v.endTime).format('YYYY/MM/DD')
          })
          this.list = list
        }
      })
    },
    openDetail (e, type) {
      this.couponInfo = e
      if (type === 'coupon') {
        this.isShowMask = true
      } else {
        this.isShowMaskRule = true
      }
      // getHistoryInfo({
      //   ticketInfoId: e.ticketInfoId
      // }).then((res) => {
      //   if (res.data.code === 0) {
      //     this.couponInfo = res.data.data
      //     this.isShowMask = true
      //   }
      // })
    }
  }
}
</script>

<style lang="scss">
  @font-face {
    font-family: "Akrobat-Bold";
    src: url(https://img-gewu.jifenone.com/images/font/Akrobat-Bold.ttf);
  }
  .list {
    width: 100%;
    height: 100vh;
    position: relative;
    background-color: #fff;
    .header {
      width: 100%;
      height: 1.333333rem;
      position: absolute;
      top: 0;
      left: 0;
      .back {
        height: 1.333333rem;
        width: 100%;
        line-height: 1.333333rem;
        padding-left: 0.266667rem;
        box-sizing: border-box;
      }
      .box {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 1.333333rem;
        background-color: #fff;
        .item {
          width: 1.253333rem;
          height: 0.533333rem;
          text-align: center;
          font-size: 0.346667rem;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #292a2b;
          line-height: 0.533333rem;
          letter-spacing: 0.04rem;
          position: relative;
          .fenge {
            position: absolute;
            width: 0.773333rem;
            height: 0.053333rem;
            background: #3b72f2;
            border-radius: 0.026667rem;
            bottom: -0.133333rem;
            left: 0.213333rem;
          }
        }

        .item_act {
          font-size: 0.373333rem;
          color: #3b72f2;
        }
      }
    }

    .scroll-div-style {
      width: 100%;
      height: 100vh;
      overflow-y: auto;
      padding-top: 1.466667rem;
      box-sizing: border-box;
      .list-msg {
        width: 100%;
        height: 0.533333rem;
        font-size: 0.373333rem;
        font-weight: 400;
        color: #bbbbbb;
        line-height: 0.533333rem;
        letter-spacing: 0.013333rem;
        text-align: center;
        padding-top: 6.413333rem;
      }
      .con {
        margin: 0 auto;
        margin-top: 0.266667rem;
        padding: 0.266667rem;
        box-sizing: border-box;
        width: 9.466667rem;
        background: #ffffff;
        box-shadow: 0px 0.026667rem 0.133333rem 0.053333rem
          rgba(201, 201, 201, 0.2);
        border-radius: 0.133333rem;

        .info {
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: 0.266667rem;
          padding-bottom: 0.16rem;
          box-shadow: 0px 0.013333rem 0px 0px rgba(209, 207, 207, 0.4);
          > img {
            width: 0.746667rem;
            height: 0.746667rem;
            border-radius: 50%;
            margin-right: 0.213333rem;
          }

          .name {
            font-size: 0.32rem;
          }
        }

        .coupon {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .msg {
            display: flex;
            align-items: center;

            .rmb {
              width: 1.786667rem;
              text-align: center;
              font-size: 0.826667rem;
              font-family: Akrobat-Bold;
              font-weight: 800;
              color: #3b72f2;
              height: 0.64rem;
              > span {
                width: 0.266667rem;
                height: 0.506667rem;
                font-size: 0.56rem;
                font-family: Akrobat-Bold;
                font-weight: bold;
                line-height: 0.506667rem;
                margin-right: 0.08rem;
              }
            }
            .coupn-info {
              width: 5.106667rem;

              .name {
                width: 5.106667rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 0.373333rem;
                font-size: 0.346667rem;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #292a2b;
                line-height: 0.373333rem;
                margin-bottom: 0.24rem;
              }

              .time {
                width: 100%;
                height: 0.373333rem;
                font-size: 0.293333rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #8f9194;
                line-height: 0.373333rem;
                margin-bottom: 0.24rem;
              }
              .rule {
                width: 1.36rem;
                height: 0.426667rem;
                border-radius: 0.226667rem;
                border: 0.013333rem solid #3b72f2;
                font-size: 0.24rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #3b72f2;
                line-height: 0.426667rem;
                text-align: center;
              }
            }
          }

          .btn {
            width: 1.733333rem;
            height: 0.746667rem;
            font-size: 0.293333rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 0.746667rem;
            background: #3b72f2;
            border-radius: 0.4rem;
            color: #fff;
            text-align: center;
            margin-left: 0.266667rem;
          }

          .used {
            background-color: #c5cad2;
          }
        }
        .noUse {
          .msg {
            .rmb {
              color: #c5cad2;
            }
            .coupn-info {
              .name,
              .rule,
              .time {
                color: #c5cad2;
              }
              .rule {
                border: 0.013333rem solid #c5cad2;
              }
            }
          }
        }
      }
    }

    .mask,
    .mask-rule {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);

      .mask-box {
        position: absolute;
        width: 10rem;
        height: 12.133333rem;
        left: 0;
        bottom: 0;
        border-radius: 0.133333rem 0.133333rem 0px 0px;
        background-color: #fff;
        padding: 0.266667rem;
        box-sizing: border-box;
        .mask-box-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          margin-bottom: 0.4rem;
          .info {
            display: flex;
            align-items: center;

            > img {
              width: 0.746667rem;
              height: 0.746667rem;
              border-radius: 50%;
              margin-right: 0.213333rem;
            }

            .name {
              width: 7.866667rem;
              height: 0.586667rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 0.32rem;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #292a2b;
              line-height: 0.586667rem;
            }
          }

          .close {
            width: 0.506667rem;
            height: 0.506667rem;
            background-image: url("https://img-gewu.jifenone.com/images/rujia-close.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
        }

        .mask-box-coupon {
          width: 7.866667rem;
          height: 1.813333rem;
          background-image: url("https://img-gewu.jifenone.com/images/rujia-detail-coupon.png");
          background-size: 100% 100%;
          margin: 0 auto;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          margin-bottom: 0.533333rem;
          .num {
            width: 2.506667rem;
            height: 0.96rem;
            font-size: 0.933333rem;
            font-family: Akrobat-Bold;
            font-weight: 800;
            color: #ffffff;
            line-height: 0.96rem;
            letter-spacing: 0.026667rem;
            text-shadow: 0.013333rem 0.066667rem 0.053333rem
              rgba(244, 126, 34, 0.7);
            text-align: center;
            > span {
              height: 0.746667rem;
              font-size: 0.533333rem;
              font-family: Akrobat-Bold;
              font-weight: 500;
              color: #ffffff;
              line-height: 0.746667rem;
              letter-spacing: 0.013333rem;
              text-shadow: 0.013333rem 0.066667rem 0.053333rem
                rgba(244, 126, 34, 0.7);
              margin-right: 0.08rem;
            }
          }
          .txt {
            width: 4.666667rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-left: 0.266667rem;
            height: 0.64rem;
            font-size: 0.506667rem;
            font-weight: normal;
            color: #ffffff;
            line-height: 0.64rem;
            letter-spacing: 0.013333rem;
            text-shadow: 0.013333rem 0.066667rem 0.053333rem
              rgba(244, 126, 34, 0.7);
          }
        }
        .used-box {
          width: 100%;
          padding: 0 0.4rem;
          box-sizing: border-box;
          position: relative;
          .qr-code{
            width: 2.373333rem;
            height: 2.373333rem;
            border-radius: 0.133333rem;
            border: 0.013333rem solid #3B72F2;
            overflow: hidden;
            // background-image: url('');
            // background-size: 100% 100%;
            // background-repeat: no-repeat;
            top: 1.026667rem;
            right: 0.533333rem;
            position: absolute;
            >img{
              width: 100%;
              height: 100%;
            }
          }
          .used-title {
            width: 100%;
            text-align: center;
            height: 0.373333rem;
            font-size: 0.346667rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #c3c3c3;
            line-height: 0.373333rem;
            margin-bottom: 0.4rem;
          }
          .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.4rem;
            .step1 {
              font-size: 0.32rem;
              color: #5a5b5c;
              .title {
                width: 100%;
                height: 0.373333rem;
                font-size: 0.346667rem;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #3b72f2;
                line-height: 0.373333rem;
                margin-bottom: 0.226667rem;
              }
            }
          }
          .mb20 {
            margin-bottom: 0.266667rem;
          }
          .code {
            width: 4rem;
            height: 4rem;
          }
          .copy-box {
            width: 100%;
            display: flex;
            align-items: center;
            .txt {
              max-width: 6.533333rem;
              height: 0.746667rem;
              background: #edecec;
              border-radius: 0.133333rem;
              font-size: 0.32rem;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #5a5b5c;
              line-height: 0.746667rem;
              text-align: center;
              padding: 0 0.213333rem;
              box-sizing: border-box;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .btn {
              width: 1.226667rem;
              height: 0.746667rem;
              background: #edecec;
              border-radius: 0.133333rem;
              text-align: center;
              font-size: 0.32rem;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #5a5b5c;
              line-height: 0.746667rem;
              margin-left: 0.133333rem;
            }
          }
        }
      }
    }
    .mask-rule {
      .mask-rule-con {
        position: absolute;
        top: 3.6rem;
        left: 0.933333rem;
        width: 8.133333rem;
        height: 7.52rem;
        background-image: url("https://img-gewu.jifenone.com/images/rujia-his-rule.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding-top: 0.266667rem;
        box-sizing: border-box;
        .title {
          width: 100%;
          height: 0.426667rem;
          font-size: 0.373333rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 0.426667rem;
          letter-spacing: 0.053333rem;
          text-align: center;
          margin-bottom: 1rem;
        }
        .time,
        .rule-txt {
          width: 100%;
          display: flex;
          align-items: center;
          padding-left: 0.16rem;
          height: 0.48rem;
          font-size: 0.32rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #395ec8;
          line-height: 0.48rem;
          margin-bottom: 0.346667rem;
          .num {
            height: 0.426667rem;
            font-size: 0.32rem;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            line-height: 0.426667rem;
            margin-right: 0.386667rem;
          }
        }
        .rule-txt {
          margin-bottom: 0.066667rem;
        }
        .txt {
          width: 7.173333rem;
          height: 3.5rem;
          margin-left: 0.933333rem;
          font-size: 0.32rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #395ec8;
          line-height: 0.533333rem;
          word-break: break-word;
          overflow-y: auto;
        }
        .close{
          position: absolute;
          bottom: -1.386667rem;
          left: 3.706667rem;
          width: 0.72rem;
          height: 0.72rem;
          background-image: url("https://img-gewu.jifenone.com/images/rujia-his-close.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }
    }
  }
  pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    *word-wrap: break-word;
    *white-space: normal;
  }
</style>
