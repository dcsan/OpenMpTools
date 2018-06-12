// pages/pay/pay.js
const Tool = require('../../utils/tool.js')
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
    let url = 'https://test/test'
    let reqObj = { 
      url: url,
      data: {},
      method: 'POST',
    }
    Tool.request(reqObj).then((res) => {

      let data = res.data
      let payObj = {
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
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