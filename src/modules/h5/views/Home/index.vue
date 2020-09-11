<template>
  <div class="detail-test" :class="(couponList.upperStatus&&couponList.receive)||isSuccess?'pt':''">
    <router-link :to="{path:'/history'}" class="record">领取记录</router-link>
    <div class="con" :class="(couponList.upperStatus&&couponList.receive)||isSuccess?'con2':''">
      <div
        class="coupon-info"
        :class="(couponList.upperStatus&&couponList.receive)||isSuccess?'coupon-info-success':''"
      >
        <div class="price">
          <span v-if="couponList.ticketType===0||couponList.ticketType===4">¥</span>{{couponList.amount}}<span v-if="couponList.ticketType===1">%</span>
        </div>
        <div class="name">机票满减券</div>
      </div>
      <div
        class="coupon-info coupon-info2"
        :class="(couponList.upperStatus&&couponList.receive)||isSuccess?'coupon-info-success2':''"
      >
        <div class="price">
          <span v-if="couponList.ticketType===0||couponList.ticketType===4">¥</span>{{couponList.amount}}<span v-if="couponList.ticketType===1">%</span>
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
      @click="isShowName=true"
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
      <div class="title">活动规则</div>
      <div class="time">
        <div class="num">1</div>
        有效期：{{couponList.startTime}}~{{couponList.endTime}}
      </div>
      <div class="rule-txt">
        <div class="num">2</div>规则：
      </div>
      <pre class="txt">{{couponList.useCondition}}</pre>
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
        isShowName:false,
        receivedList: [],
        erromsg: "",
        userName:''
      };
    },
    created() {
      this.isShowMsg = false;
      this.getParams();
    },
    mounted() {},
    methods: {
      submit(){
        if(this.userName===''){
          Toast.fail("请输入姓名");
          return false
        }
        this.getCouponClick()
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
            console.log(data,123);
            data.startTime = moment(data.startTime).format("YYYY/MM/DD");
            data.endTime = moment(data.endTime).format("YYYY/MM/DD");
            data.isBefore = moment().isAfter(data.endTime);
            this.couponList = data;
            console.log(this.couponList,456);
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
        this.isShowName =false
        // adPointContractId: store.state.adPointContractId,
        getCoupon({userName:this.userName}).then((res) => {
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
      getHistory() {
        getHistoryList({ status: 0 }).then((res) => {
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
    height: 21.653333rem;
    background: url("https://img-gewu.jifenone.com/images/rujia-bgss.png");
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
      top: 1.733333rem;
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
      height: 6.56rem;
      margin: 0 auto;
      padding-top: 0.146667rem;
      box-sizing: border-box;
      background-image: url("https://img-gewu.jifenone.com/images/rujia-rules.png");
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
        margin-bottom: 0.386667rem;
      }
      .time,
      .rule-txt {
        width: 100%;
        padding-left: 0.373333rem;
        box-sizing: border-box;
        height: 0.48rem;
        font-size: 0.32rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #395ec8;
        line-height: 0.48rem;
        display: flex;
        margin-bottom: 0.28rem;
        .num {
          height: 0.48rem;
          font-size: 0.32rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          height: 0.48rem;
          width: 0.146667rem;
          margin-right: 0.413333rem;
        }
      }
      .rule-txt {
        margin-bottom: 0.066667rem;
      }
      .txt {
        width: 7.16rem;
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
    }
    .mask,
    .mask-form {
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
          color: #3B72F2;
          letter-spacing: 0.04rem;
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
input{  
	background:none;  
	outline:none;  
	border:none;
}
input:focus{   
	border:none;
}

</style>
