<template>
  <div class="detail-test" :class="(couponList.upperStatus&&couponList.receive)||isSuccess?'pt':''">
    <div class="act-rule" @click="isShowRule=true">活动规则</div>
    <router-link :to="{path:'/history'}" class="record">领取记录</router-link>
    <div class="con" :class="(couponList.upperStatus&&couponList.receive)||isSuccess?'con2':''">
      <div
        class="coupon-info"
        :class="(couponList.upperStatus&&couponList.receive)||isSuccess?'coupon-info-success':''"
      >
        <div class="price"><span v-if="couponList.ticketType===0||couponList.ticketType===4">¥</span>{{couponList.amount}}<span v-if="couponList.ticketType===1">%</span>
        </div>
        <div class="name">机票满减券</div>
      </div>
      <div
        class="coupon-info coupon-info2"
        :class="(couponList.upperStatus&&couponList.receive)||isSuccess?'coupon-info-success2':''"
      >
        <div class="price"><span v-if="couponList.ticketType===0||couponList.ticketType===4">¥</span>{{couponList.amount}}<span v-if="couponList.ticketType===1">%</span>
        </div>
        <div class="name">机票满减券</div>
      </div>
      <div class="item" v-if="(couponList.upperStatus&&couponList.receive)||isSuccess">
        <div class="code">兑换码：{{receivedList[0].ticketInfoVO.code}}</div>
        <div class="copy" @click.stop="copy(receivedList[0].ticketInfoVO.code)"></div>
      </div>
      <div class="item item2" v-if="(couponList.upperStatus&&couponList.receive)||isSuccess">
        <div class="code">兑换码：{{receivedList[1].ticketInfoVO.code}}</div>
        <div class="copy" @click.stop="copy(receivedList[1].ticketInfoVO.code)"></div>
      </div>
    </div>
    <div
      class="btn rujia-receive"
      v-if="couponList.upperStatus&&!couponList.receive&&couponList.remainStatus"
      @click="getCouponClick"
    ></div>
    <router-link
      :to="{path:'/history'}"
      class="btn rujia-use"
      v-if="(couponList.upperStatus&&couponList.receive)||isSuccess"
    ></router-link>
    <div class="btn rujia-gradAll" v-if="couponList.upperStatus&&!couponList.remainStatus"></div>
    <div class="btn rujia-Offshelf" v-if="!couponList.upperStatus"></div>
    <div class="btn rujia-expired" v-if="couponList.isBefore"></div>

    <div class="rule">
      <div class="title">使用指南</div>
      <div class="step">step 1 打开小程序</div>
      <pre class="step-con">
1.长按微信小程序码保存图片
2.打开微信扫码，进入深航服务小程序
3.注册并登录小程序账号
4.点击我的-优惠券，可直接查看使用
      </pre>
      <div class="code-img" @click="saveImg">
        <img src="https://img-gewu.jifenone.com/images/rujia-shenhan.jpg" alt />
      </div>
      <div class="step">step 2 优惠券兑换</div>
      <pre class="step-con">
1.复制兑换码
2.打开深航服务小程序优惠券中兑换码输入入口
3.输入兑换码，兑换优惠券
4.兑换成功后，在深航服务小程序中可使用优惠券
      </pre>
      <!-- <div class="time">
        <div class="num">1</div>
        有效期：{{couponList.startTime}}~{{couponList.endTime}}
      </div>
      <div class="rule-txt">
        <div class="num">2</div>规则：
      </div>
      <pre class="txt">{{couponList.useCondition}}</pre>-->
    </div>

    <div class="mask" @click="isShowMsg=false" v-if="isShowMsg">
      <div class="mask-box">
        <div class="icon"></div>
        <div class="txt" v-if="erromsg">{{erromsg}}</div>
        <div class="msg">来晚一步，优惠券被抢光啦！</div>
        <div class="btn"></div>
      </div>
    </div>
    <div class="mask-form" v-if="isShowName">
      <div class="mask-form-con">
        <div class="mask-title">提示</div>
        <div class="mask-input">
          <input type="text" placeholder="请输入姓名" v-model="userName" />
        </div>
        <div class="mask-msg">请填写与深航注册账户一致的姓名，否则可能导致领取失败</div>
        <div class="btn" @click="submit">确定</div>
        <div class="close" @click="isShowName=false"></div>
      </div>
    </div>
    <div class="mask-rule" v-if="isShowRule">
      <div class="mask-rule-con">
        <div class="title">活动规则</div>
        <div class="time">
          <div class="num">1</div>
          有效期：{{couponList.startTime}}~{{couponList.endTime}}
        </div>
        <div class="rule-txt">
          <div class="num">2</div>规则：
        </div>
        <pre class="txt">{{couponList.useCondition}}</pre>
        <div class="close" @click="isShowRule=false"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast } from "vant";
  import { getDetail, getCoupon, getHistoryList } from "../../api/coupon";
  import store from "../../store";
  const moment = require("moment");

  export default {
    name: "Home",
    data() {
      return {
        couponList: "",
        isSuccess: false,
        isShowMsg: false,
        isShowName: false,
        isShowRule: false,
        receivedList: [],
        erromsg: "",
        userName: "",
      };
    },
    created() {
      this.isShowMsg = false;
      this.getParams();
    },
    mounted() {},
    methods: {
      submit() {
        if (this.userName === "") {
          Toast.fail("请输入姓名");
          return false;
        }
        this.getCouponClick();
      },
      copy(e) {
        this.$copyText(e)
          .then((res) => {
            Toast.success("复制成功");
            console.log("成功");
          })
          .catch((err) => {
            Toast.fail("复制失败");
            console.log(err);
          });
      },
      getList() {
        // adPointContractId: store.state.adPointContractId,
        getDetail().then((res) => {
          if (res.data.code === 0) {
            let data = res.data.data.list[0];
            console.log(data, 123);
            data.startTime = moment(data.startTime).format("YYYY/MM/DD");
            data.endTime = moment(data.endTime).format("YYYY/MM/DD");
            data.isBefore = moment().isAfter(data.endTime);
            this.couponList = data;
            console.log(this.couponList, 456);
            if (
              (this.couponList.upperStatus && this.couponList.receive) ||
              this.isSuccess
            ) {
              this.getHistory();
            }
          }
        });
      },
      getCouponClick() {
        this.isShowName = false;
        // adPointContractId: store.state.adPointContractId,
        getCoupon().then((res) => {
          if (res.data.code === 0) {
            let data = res.data.data;
            let successList = data.filter((item) => item.isSuccess);
            if (successList.length === 2) {
              Toast.success("领取成功");
              this.isSuccess = true;
              this.receivedList = data;
              this.getList();
            } else if (successList.length === 1) {
              this.erromsg = "有一张券领取失败！";
              this.isShowMsg = true;
              this.isSuccess = false;
            } else if (successList.length === 0) {
              this.isShowMsg = true;
              this.isSuccess = false;
            }
          }
        });
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
      getHistory() {
        getHistoryList().then((res) => {
          if (res.data.code === 0) {
            let list = res.data.data.list;
            list.forEach((v) => {
              v.startTime = moment(v.startTime).format("YYYY/MM/DD");
              v.endTime = moment(v.endTime).format("YYYY/MM/DD");
              v.ticketInfoVO = v;
            });
            this.receivedList = list;
          }
        });
      },
      getParams() {
        let url = window.location.href; // 获取当前url
        let cs = url.split("?")[1]; // 获取?之后的参数字符串
        if (cs === "") return false;
        let csArr = cs.split("#"); // 参数字符串分割为数组
        let ss = {};
        csArr.forEach((v, i) => {
          ss[csArr[i].split("=")[0]] = csArr[i].split("=")[1];
        });
        // csArr.forEach((v, i) => {
        //   ss[csArr[i].split('=')[0]] = csArr[i].split('=')[1]
        // })
        // ss.adPointContractId = ss.adPointContractId.split('#')[0]
        console.log(ss, 123);
        if (ss.token) {
          store.commit("setToken", ss.token);
          // store.commit('setID', ss.adPointContractId)
        }
        this.getList();
      },
    },
  };
</script>

<style lang="scss">
  @font-face {
    font-family: "Akrobat-Bold";
    src: url(https://img-gewu.jifenone.com/images/font/Akrobat-Bold.ttf);
  }
  .detail-test {
    width: 10rem;
    height: 25.253333rem;
    background: url("https://img-gewu.jifenone.com/images/coupon-h5-rujia.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding-top: 6.053333rem;
    position: relative;
    .record {
      position: absolute;
      width: 1.6rem;
      height: 0.8rem;
      background-image: url("https://img-gewu.jifenone.com/images/rujia-record.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      top: 2.133333rem;
      left: 0;
      font-size: 0.293333rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 0.8rem;
      text-align: center;
    }
    .act-rule {
      position: absolute;
      width: 1.6rem;
      height: 0.8rem;
      background-image: url("https://img-gewu.jifenone.com/images/coupon-h5-rule-bg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      top: 0.933333rem;
      left: 0;
      font-size: 0.293333rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 0.8rem;
      text-align: center;
    }
    .con {
      width: 10rem;
      height: 6.746667rem;
      background: url("https://img-gewu.jifenone.com/images/rujia-coupons-pro.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: relative;
      .item {
        width: 100%;
        padding-top: 1.706667rem;
        padding-left: 0.893333rem;
        display: flex;
        box-sizing: border-box;
        .code {
          margin-top: 1.066667rem;
          width: 4.68rem;
          height: 0.586667rem;
          font-size: 0.266667rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 0.586667rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 0.613333rem;
        }
        .copy {
          width: 2.266667rem;
          height: 1.333333rem;
          background: url("https://img-gewu.jifenone.com/images/rujia-copy-btn.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }
      .item2 {
        padding-top: 1.173333rem;
      }
      .coupon-info {
        position: absolute;
        top: 1.333333rem;
        left: 1.88rem;
        display: flex;
        align-items: center;
        .price {
          height: 1.333333rem;
          font-size: 1.066667rem;
          font-family: Akrobat-Bold;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.04rem;
          text-shadow: 0.013333rem 0.066667rem 0.053333rem rgba(244, 126, 34, 0.7);
          > span {
            margin-right: 0.08rem;
            height: 0.746667rem;
            font-size: 0.533333rem;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            line-height: 0.746667rem;
            letter-spacing: 0.013333rem;
            text-shadow: 0.013333rem 0.066667rem 0.053333rem
              rgba(244, 126, 34, 0.7);
          }
        }
        .name {
          margin-left: 0.24rem;
          height: 0.706667rem;
          font-size: 0.48rem;
          font-weight: normal;
          color: #ffffff;
          line-height: 0.706667rem;
          letter-spacing: 0.013333rem;
          text-shadow: 0.013333rem 0.066667rem 0.053333rem rgba(244, 126, 34, 0.7);
        }
      }
      .coupon-info2 {
        top: 3.813333rem;
        left: 2.146667rem;
      }
      .coupon-info-success {
        top: 1.706667rem;
        left: 0.893333rem;
      }
      .coupon-info-success2 {
        top: 4.533333rem;
        left: 0.893333rem;
      }
    }
    .con2 {
      height: 7.6rem;
      background: url("https://img-gewu.jifenone.com/images/rujia-copys-pro.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .btn {
      width: 7.066667rem;
      height: 1.333333rem;
      margin: 0 auto;
      margin-bottom: 0.373333rem;
      display: block;
    }
    .rujia-receive {
      background: url("https://img-gewu.jifenone.com/images/rujia-receive.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .rujia-use {
      width: 6rem;
      background: url("https://img-gewu.jifenone.com/images/rujia-use.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .rujia-expired {
      background: url("https://img-gewu.jifenone.com/images/rujia-expired.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .rujia-gradAll {
      background: url("https://img-gewu.jifenone.com/images/rujia-gradAll.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .rujia-Offshelf {
      background: url("https://img-gewu.jifenone.com/images/rujia-Offshelf.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .rule {
      width: 8.56rem;
      height: 10.133333rem;
      margin: 0 auto;
      padding-top: 0.133333rem;
      box-sizing: border-box;
      background-image: url("https://img-gewu.jifenone.com/images/coupon-h5-guide.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      .title {
        width: 100%;
        height: 0.453333rem;
        font-size: 0.346667rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 0.453333rem;
        letter-spacing: 0.053333rem;
        text-align: center;
        margin-bottom: 0.426667rem;
      }
      .step {
        width: 100%;
        padding-left: 0.213333rem;
        height: 0.426667rem;
        font-size: 0.32rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 0.426667rem;
        margin-bottom: 0.266667rem;
      }
      .step-con {
        width: 7.493333rem;
        height: 2.133333rem;
        font-size: 0.32rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #395ec8;
        line-height: 0.533333rem;
        margin-left: 0.533333rem;
        margin-bottom: 0.186667rem;
      }
      .code-img {
        width: 2.453333rem;
        height: 2.453333rem;
        background: #ffffff;
        border-radius: 0.133333rem;
        border: 0.013333rem solid #5e94fd;
        overflow: hidden;
        margin: 0 auto;
        margin-bottom: 0.213333rem;
        > img {
          width: 2.453333rem;
          height: 2.453333rem;
        }
      }
    }
    .mask,
    .mask-form,
    .mask-rule {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      .mask-box {
        position: absolute;
        top: 5.866667rem;
        left: 1.2rem;
        width: 7.6rem;
        height: 8.4rem;
        background: #ffffff;
        box-shadow: 0px 0.04rem 0.133333rem 0.026667rem rgba(85, 184, 254, 0.8);
        border-radius: 0.133333rem;
        padding-top: 1.066667rem;
        box-sizing: border-box;
        .icon {
          width: 1.6rem;
          height: 1.6rem;
          background-image: url("https://img-gewu.jifenone.com/images/rujia-close-fail.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          margin: 0 auto;
          margin-bottom: 0.8rem;
        }
        .txt {
          width: 100%;
          height: 0.373333rem;
          font-size: 0.373333rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #292a2b;
          line-height: 0.373333rem;
          text-align: center;
          margin-bottom: 0.4rem;
        }
        .msg {
          width: 100%;
          height: 0.373333rem;
          font-size: 0.32rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8f9194;
          line-height: 0.373333rem;
          margin-bottom: 1.92rem;
          text-align: center;
        }
        .btn {
          width: 3.333333rem;
          height: 1.066667rem;
          margin: 0 auto;
          background-image: url("https://img-gewu.jifenone.com/images/rujia-black.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }
    }
    .mask-form {
      background: rgba(0, 0, 0, 0.4);
      .mask-form-con {
        position: absolute;
        top: 4.266667rem;
        left: 0.8rem;
        width: 8.4rem;
        height: 6.253333rem;
        background: #ffffff;
        border-radius: 0.266667rem;
        padding-top: 0.533333rem;
        .mask-title {
          width: 100%;
          height: 0.64rem;
          font-size: 0.4rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #292a2b;
          line-height: 0.64rem;
          letter-spacing: 0.04rem;
          text-align: center;
          margin-bottom: 0.666667rem;
        }
        .mask-input {
          width: 7.6rem;
          padding: 0 0.266667rem;
          height: 1.333333rem;
          background: #f7f7f7;
          border-radius: 0.106667rem;
          margin: 0 auto;
          margin-bottom: 0.4rem;
          > input {
            width: 100%;
            height: 1.333333rem;
            font-size: 0.32rem;
          }
        }
        .mask-msg {
          width: 100%;
          padding: 0 0.4rem;
          box-sizing: border-box;
          font-size: 0.346667rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #292a2b;
          letter-spacing: 0.013333rem;
          word-break: break-all;
          text-align: center;
          margin: 0 auto;
          margin-bottom: 0.8rem;
        }
        .btn {
          width: 100%;
          text-align: center;
          font-size: 0.426667rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #3b72f2;
          letter-spacing: 0.04rem;
        }
        .close {
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
    .mask-rule {
      background: rgba(0, 0, 0, 0.4);
      .mask-rule-con {
        position: absolute;
        width: 8.133333rem;
        height: 7.52rem;
        top: 5.733333rem;
        left: 0.933333rem;
        background-image: url("https://img-gewu.jifenone.com/images/rujia-mask-rule.png");
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
          margin-bottom: 0.933333rem;
        }
        .time,
        .rule-txt {
          width: 100%;
          padding-left: 0.16rem;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          height: 0.48rem;
          font-size: 0.32rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #395ec8;
          line-height: 0.48rem;
          margin-bottom: 0.4rem;
          .num {
            width: 0.146667rem;
            height: 0.426667rem;
            font-size: 0.32rem;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            line-height: 0.426667rem;
            margin-right: 0.386667rem;
          }
        }
        .txt {
          width: 7.173333rem;
          height: 3.733333rem;
          font-size: 0.32rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #395ec8;
          line-height: 0.533333rem;
          margin-left: 0.693333rem;
          overflow-y: auto;
        }
        .close {
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
  .pt {
    padding-top: 5.386667rem;
  }
  pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    *word-wrap: break-word;
    *white-space: normal;
  }
  input {
    background: none;
    outline: none;
    border: none;
  }
  input:focus {
    border: none;
  }
</style>
