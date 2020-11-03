<template>
  <div
    class="detail-test"
    :class="
      (couponList.upperStatus && couponList.receive) || isSuccess ? 'pt' : ''
    "
  >
    <div class="act-rule" @click="isShowRule = true">活动规则</div>
    <router-link :to="{ path: '/history' }" class="record" v-if="token!==''"
      >领取记录</router-link
    >
    <div
      class="con"
      :class="
        (couponList.upperStatus && couponList.receive) || isSuccess
          ? 'con2'
          : ''
      "
    >
      <div
        class="coupon-info"
        :class="
          (couponList.upperStatus && couponList.receive) || isSuccess
            ? 'coupon-info-success'
            : ''
        "
      >
        <div class="price">
          <span
            v-if="couponList.ticketType === 0 || couponList.ticketType === 4"
            >¥</span
          >{{ couponList.amount
          }}<span v-if="couponList.ticketType === 1">%</span>
        </div>
        <div class="name">机票满减券</div>
      </div>
      <div
        class="coupon-info coupon-info2"
        :class="
          (couponList.upperStatus && couponList.receive) || isSuccess
            ? 'coupon-info-success2'
            : ''
        "
      >
        <div class="price">
          <span
            v-if="couponList.ticketType === 0 || couponList.ticketType === 4"
            >¥</span
          >{{ couponList.amount
          }}<span v-if="couponList.ticketType === 1">%</span>
        </div>
        <div class="name">机票满减券</div>
      </div>
      <div
        class="item"
        v-if="(couponList.upperStatus && couponList.receive) || isSuccess"
      >
        <div class="code">兑换码：{{ receivedList[0].code }}</div>
        <div class="copy" @click.stop="copy(receivedList[0].code)"></div>
      </div>
      <div
        class="item item2"
        v-if="(couponList.upperStatus && couponList.receive) || isSuccess"
      >
        <div class="code">兑换码：{{ receivedList[1].code }}</div>
        <div class="copy" @click.stop="copy(receivedList[1].code)"></div>
      </div>
    </div>
    <div
      class="userInfo"
      v-if="
        couponList.upperStatus &&
        !couponList.receive &&
        couponList.remainStatus &&
        isCheck &&
        isConfirm
      "
    >
      <div class="hd">
        <div class="dian"></div>
        <div class="txt">
          您将领取至该账户，在深航服务小程序兑换时需与领取账户保持一致，方可兑换成功，请确认信息
        </div>
      </div>
      <div class="item">{{ urlInfo.name }}</div>
      <div class="item">{{ urlInfo.phoneNumber }}</div>
    </div>

    <!-- 去使用 （用户已领取）-->
    <router-link
      :to="{ path: '/history' }"
      class="btn rujia-use"
      v-if="couponList.receive || isSuccess"
    ></router-link>
     <!-- 去使用 （用户已领取）-->

    <!-- (用户未领取) -->
    <div
      class="btn rujia-receive"
      v-if="
        couponList.upperStatus &&
        !couponList.receive &&
        couponList.remainStatus &&
        isCheck &&
        !isConfirm
      "
      @click="handleConfirm"
    ></div>
    <div
      class="btn rujia-noreceive"
      v-if="
        couponList.upperStatus &&
        !couponList.receive &&
        couponList.remainStatus &&
        !isCheck
      "
      @click="showPrompt"
    >
      立即领取
    </div>
    <div
      class="btn rujia-confirm"
      v-if="
        couponList.upperStatus &&
        !couponList.receive &&
        couponList.remainStatus &&
        isCheck &&
        isConfirm
      "
      @click="getCouponClick"
    >
      确认领取
    </div>
    <!-- 已抢光  remainStatus是否剩余 -->
    <div
      class="btn rujia-gradAll"
      v-if="!couponList.remainStatus&&!couponList.receive"
      @click="$uploadEvent('已抢光')"
    ></div>
    <!-- 已抢光 -->
    <!--  已下架-->
    <div class="btn rujia-Offshelf" v-else-if="!couponList.upperStatus&&!couponList.receive"></div>
    <!--  已下架-->
    <!-- 已过期 -->
    <div class="btn rujia-expired" v-else-if="couponList.isBefore&&!couponList.receive"></div>
    <!-- 已过期 -->
    <!-- (用户未领取) -->
    <div class="protocol" @click="handleRead">
      <div class="icon" :class="isCheck ? 'icon-actived' : ''"></div>
      <div class="txt">您已阅读并同意</div>
      <div class="jump" @click.stop="isShowProtocol=true">《用户信息授权协议》</div>
    </div>

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

    <div class="mask" @click="isShowMsg = false" v-if="isShowMsg">
      <div class="mask-box">
        <div class="icon"></div>
        <div class="txt" v-if="erromsg">{{ erromsg }}</div>
        <pre class="msgPre" v-if="erroCode === 80155">
参与资格要求：
1. 仅限白金卡以上会员领取
        </pre>
        <div class="btn"></div>
      </div>
    </div>
    <div class="mask-form" v-if="isShowName">
      <div class="mask-form-con">
        <div class="mask-title">提示</div>
        <div class="mask-input">
          <input type="text" placeholder="请输入姓名" v-model="userName" />
        </div>
        <div class="mask-msg">
          请填写与深航注册账户一致的姓名，否则可能导致领取失败
        </div>
        <div class="btn" @click="submit">确定</div>
        <div class="close" @click="isShowName = false"></div>
      </div>
    </div>
    <div class="mask-rule" v-if="isShowRule">
      <div class="mask-rule-con">
        <div class="title">活动规则</div>
        <div class="time">
          <div class="num">1</div>
          有效期：{{ couponList.startTime }}~{{ couponList.endTime }}
        </div>
        <div class="rule-txt">
          <div class="num">2</div>
          规则：
        </div>
        <pre class="txt">{{ couponList.useCondition }}</pre>
        <div class="close" @click="isShowRule = false"></div>
      </div>
    </div>
    <div class="mask-protocol" v-if="isShowProtocol">
      <div class="mask-protocol-con">
        <pre class="protocol">
用户信息授权协议

用户信息授权协议（以下简称“本协议”）是首旅如家（以下简称“我们”）与用户（以下简称“您”）就个人信息授权使用所订立的合约。您通过网络页面点击确认，即表示您同意接受本协议的全部约定内容以及与本协议有关的已经发布或将来可能发布的各项规则、页面展示、操作流程、公告或通知（以下统称“规则 ” ）。本协议适用于首旅如家平台当前活动的相关服务。
在接受本协议之前，请您仔细阅读本协议的全部内容（特别是以粗体或下划线标注的内容）。如果您不同意本协议的任意内容，或者无法准确理解该条款的含义，请不要进行任何操作。

一、用户信息获取范围
我们需要获取的用户信息类型包括:
1、账户信息（首旅如家会员账号、会员等级、姓名、手机号）；

二、用户信息获取方式
我们可能会就下列各种情况，获得您的用户信息：
1、您在访问或使用本网站服务时提供的信息；
2、从其他来源获取的信息：如您参加我们或我们与合作伙伴组织的任何活动。

三、用户信息的使用
我们可能会利用我们获取的用户信息：
1、向您提供我们认为您可能会感兴趣的产品、服务或营销活动；
2、就您的要求向您提供咨询服务，或向您做出回应或与您沟通；
3、领取当前活动优惠券时进行唯一身份识别，标记优惠券领取情况（使用姓名+手机号通过加密算法进行加密，获得唯一身份标识）；
4、为提升我们的服务，联系您进行调研、回访；
5、进行数据分析（如，活动效果分析）；
6、经营、评估和完善我们的业务（包括开发新产品和服务；管理我们的通信；判断我们的销售、营销和广告效果；分析和强化我们的产品、服务和网站）；
7、防止各种违法或犯罪活动和其他法律责任；

四、用户信息的共享、披露
用户的信息是我们业务的重要组成部分，我们不会出售或以其他方式共享您的个人信息，但本协议中已列明的如下情况除外。
1、合作伙伴：
我们可能会与我们的关联公司或合作伙伴（包括但不限于，您通过我们提供的联合登陆方式登陆的其它网站，以下统称“合作伙伴”）共享用户信息。您可以辨别您的使用或交易行为何时会涉及我们的合作伙伴，我们会与该合作伙伴分享与这些使用或交易行为有关的用户信息。
2、第三方服务提供者：
我们有可能聘请外部公司或个人代表我们提供某些产品或服务，包括但不限于提供金融产品信息，以及运营、维护、IT平台和/或技术服务、数据安全或备份服务、发送信函或电子邮件、分析数据、提供市场营销帮助、提供搜索结果和链接（包括付费搜索名单和链接）等用户服务。在该等情况下，我们可能会共享用户信息。
3、征得您的同意：
除以上规定及本协议已列明的情况外，当您的信息有可能披露给第三方时，您将会得到通知，并且您将有机会选择不与第三方共享此信息。
4、在下列情况下，我们可能还会披露您的相关信息：
根据法律、法规或法律程序（如，法院法令或传召出庭令）的规定；根据政府部门（如，行政机构、执法机构）的要求；为了保护本网站、我们的用户或其他人的权利及其财产或安全，或当我们认为对防止实际损害或财务损失，或调查可疑或实际非法活动来说，披露乃属必要或适当时。这也包括为防止欺诈等违法活动和减少信用风险而与其他公司和组织交换信息。

五、您同意本协议中的授权不可撤回或撤销。
六、在中国法律允许的范围内，我们可能会不时更新本协议，恕不提前通知。我们将在本平台上醒目位置发布公告，告知您本协议的任何重大变动。
七、除本协议约定外，首旅如家平台发布的《网络会员注册服务条款》、《首旅如家隐私政策》的相关约定对我们和您亦有同等约束力。
八、您同意，因履行本协议发生纠纷的，提交上海市徐汇区人民法院诉讼解决。

        </pre>
      </div>
      <div class="close" @click="isShowProtocol = false"></div>
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
        isCheck: false,
        isConfirm: false,
        isShowProtocol: false,
        receivedList: [],
        erromsg: "",
        erroCode: 0,
        userName: "",
        urlInfo: {},
        token:'',
      };
    },
    created() {
      this.isShowMsg = false;
      this.getQueryString();
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
      showPrompt() {
        Toast.fail("请勾选");
      },
      handleConfirm() {
        this.isConfirm = true;
        this.$uploadEvent('展示用户信息')
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
      handleRead() {
        this.isCheck = !this.isCheck;
      },
      getCouponClick() {
        this.isShowName = false;
        this.$uploadEvent('点击领取')
        // adPointContractId: store.state.adPointContractId,
        getCoupon().then((res) => {
          if (res.data.code === 0||res.data.meta.code === 80155) {
            let data = res.data.data||[];
            let meta = res.data.meta;
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
              this.erromsg = meta.message;
              this.erroCode = +meta.code;
              this.isShowMsg = true;
              this.isSuccess = false;
            }
          }
        });
      },
      saveImg() {
        let that = this;
        this.timeOutEvent = setTimeout(function () {
          that.savePicture(
            "https://img-gewu.jifenone.com/images/rujia-shenhan.jpg"
          );
        }, 500);
      },
      savePicture(Url) {
        let blob = new Blob([""], { type: "application/octet-stream" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = Url;
        a.download = Url.replace(/(.*\/)*([^.]+.*)/gi, "$2").split("?")[0];
        let e = document.createEvent("MouseEvents");
        e.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        a.dispatchEvent(e);
        URL.revokeObjectURL(url);
      },
      getHistory() {
        getHistoryList().then((res) => {
          if (res.data.code === 0) {
            let list = res.data.data.list;
            list.forEach((v) => {
              console.log(v, 123);
              v.startTime = moment(v.startTime).format("YYYY/MM/DD");
              v.endTime = moment(v.endTime).format("YYYY/MM/DD");
              // v = v;
            });
            this.receivedList = list;
          }
        });
      },
      getQueryString() {
        let result = location.search.match(new RegExp("[?&][^?&]+=[^?&]+", "g"));
        if (result == null) {
          return "";
        }
        for (let i = 0; i < result.length; i++) {
          result[i] = result[i].substring(1);
        }
        let newRes = {};
        result.forEach((v, i) => {
          newRes[v.split("=")[0]] = v.split("=")[1];
        });
        if (newRes.token) {
          this.token =newRes.token
          store.commit("setToken", newRes.token);
        }
        newRes.name = decodeURI(newRes.name);
        this.urlInfo = newRes;
        console.log(newRes, 123);
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
    .userInfo {
      width: 8.4rem;
      height: 3.76rem;
      background: linear-gradient(136deg, #dfeeff 0%, #dfedff 100%);
      box-shadow: 0px 0.08rem 0.08rem 0px #4dadff,
        0.013333rem 0.013333rem 0.04rem 0px #f6fbff;
      border-radius: 0.133333rem;
      margin: 0 auto;
      margin-bottom: 0.4rem;
      padding: 0 0.186667rem;
      padding-top: 0.4rem;
      box-sizing: border-box;
      .hd {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 0.32rem;
        .dian {
          width: 0.133333rem;
          height: 0.133333rem;
          background: #096aef;
          border-radius: 50%;
          margin-right: 0.133333rem;
        }
        .txt {
          height: 0.906667rem;
          font-size: 0.293333rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #395ec8;
          line-height: 0.453333rem;
        }
      }
      .item {
        width: 4.826667rem;
        padding: 0 0.306667rem;
        box-sizing: border-box;
        height: 0.8rem;
        background: #c8deff;
        border-radius: 0.08rem;
        font-size: 0.293333rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #618fd5;
        line-height: 0.8rem;
        margin: 0 auto;
        margin-bottom: 0.266667rem;
        overflow: hidden;
      }
    }
    .btn {
      width: 7.066667rem;
      height: 1.333333rem;
      margin: 0 auto;
      margin-bottom: 0.306667rem;
      display: block;
    }
    .rujia-receive {
      background: url("https://img-gewu.jifenone.com/images/rujia-receive.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .rujia-confirm {
      background: url("https://img-gewu.jifenone.com/images/rujia-confirmBtn.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 1.333333rem;
      font-size: 0.426667rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 1.333333rem;
      letter-spacing: 0.066667rem;
      text-align: center;
    }
    .rujia-noreceive {
      height: 1.333333rem;
      font-size: 0.426667rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 1.333333rem;
      letter-spacing: 0.066667rem;
      text-align: center;
      background: url("https://img-gewu.jifenone.com/images/rujia-use-active.png");
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
    .protocol {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.546667rem;
      .icon {
        width: 0.373333rem;
        height: 0.373333rem;
        margin-right: 0.133333rem;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url("https://img-gewu.jifenone.com/images/rujia-active.png");
      }
      .icon-actived {
        background-image: url("https://img-gewu.jifenone.com/images/rujia-actived.png");
      }
      .txt {
        height: 0.4rem;
        font-size: 0.293333rem;
        font-weight: 400;
        color: #395ec8;
        line-height: 0.4rem;
        margin-right: 0.08rem;
      }
      .jump {
        height: 0.4rem;
        font-size: 0.293333rem;
        font-weight: 400;
        color: #395ec8;
        line-height: 0.4rem;
        text-decoration: underline;
      }
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
    .mask-rule,
    .mask-protocol {
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
        .msgPre {
          width: 6.746667rem;
          height: 1.6rem;
          font-size: 0.32rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #292a2b;
          line-height: 0.533333rem;
          margin: 0 auto;
          margin-bottom: 1.333333rem;
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
    .mask-protocol {
      background: rgba(0, 0, 0, 0.4);
      .mask-protocol-con {
        position: absolute;
        width: 8.133333rem;
        height: 7.52rem;
        top: 5.733333rem;
        left: 0.933333rem;
        background: #ffffff;
        border-radius: 0.266667rem;
        padding: 0.266667rem;
        box-sizing: border-box;
        overflow-y: auto;
        .protocol {
          width: 100%;
          font-size: 0.32rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #395ec8;
          line-height: 0.533333rem;
        }
      }
      .close {
        position: absolute;
        top: 5.733333rem+7.52rem+0.666667rem;
        left: 50%;
        margin-left: -0.36rem;
        width: 0.72rem;
        height: 0.72rem;
        background-image: url("https://img-gewu.jifenone.com/images/rujia-his-close.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
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
