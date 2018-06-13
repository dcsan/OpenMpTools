// pages/pay/pay.js
const Tool = require('../../utils/tool.js')

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

  },

  onload(opts){
    console.log(opts)
  },

  pay(e){
    let url = 'http://rikpay.rikai-bots.com/payment'
    let total_amount = `${Math.ceil(Math.random()*50)}`
    let reqObj = {
      url: url,
      data: {
        total_amount
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

    }).catch(() => {

      wx.hideLoading()
      wx.showToast({
        title: '支付失败',
        icon: 'none',
        duration: 2000
      })

    })
  },


})