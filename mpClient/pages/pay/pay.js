// pages/pay/pay.js
const Tool = require('../../utils/tool.js')
const AppConfig = require('../../config/AppConfig')
const log = console.log

// ppId
// :
// "wx019a14a6b90883e5"
// nonceStr
// :
// "Sky0FHalQ"
// package
// :
// "wx12212527439294e868d887083486163514"
// paySignjs
// :
// "4802aaff9876effc3118a015a65b7d58"
// signType
// :
// "MD5"
// timeStamp
// :
// 1528809927

Page({

  /**
   * 页面的初始数据
   */
  data: {
    appid: AppConfig.appid,
    secret: AppConfig.secret,
    openid: ''
  },

  onload(opts) {
    console.log(opts)
  },

  onGetUserInfo(e) {
    console.log('e', e)
    if (e.detail.rawData) {
      //用户按了允许授权按钮
      console.log('用户按了允许授权按钮')
      const { userInfo, encryptedData, iv } = e.detail;
      console.log('用户信息，无敏感信息', userInfo);

      this.onGetLogin()
        .then(result => {
          // 获取openid，unionId
          console.log('result', result)
          const { session_key, openid, unionid } = result.data;
          this.data.openid = openid;
        })
        .catch(() => {
          wx.showToast({
            title: 'openid 获取错误',
            icon: 'none',
            duration: 2000
          })
        })
    } else {
      //用户按了拒绝按钮
      console.log('用户按了拒绝按钮')
    }
  },

  onGetLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            wx.request({
              url: `https://api.weixin.qq.com/sns/jscode2session?appid=${this.data.appid}&secret=${this.data.secret}&js_code=${res.code}&grant_type=authorization_code`,
              data: { code: res.code },
              success: (result) => {
                resolve(result);
              },
              fail: (err) => reject(null)
            })
          } else reject('error')
        }
      });
    });
  },

  pay(e) {
    console.log('openid', this.data.openid);
    let url = AppConfig.domain + '/payment'
    let total_amount = `${Math.ceil(Math.random() * 50)}`
    let reqObj = {
      url: url,
      data: {
        total_amount,
        total: 1,
        openid: this.data.openid
      },
      method: 'POST',
    }
    Tool.request(reqObj).then((res) => {
      let data = res.data.result
      console.log('res', res)
      let payObj = {
        'timeStamp': `${data.timeStamp}`,
        'nonceStr': data.nonceStr,
        'package': `${data.package}`,
        'paySign': data.paySign
      }
      return Tool.pay(payObj)
    }).catch((err) => {
      log('error', err)
      wx.hideLoading()
      wx.showToast({
        title: '支付失败',
        icon: 'none',
        duration: 2000
      })

    })
  },


})