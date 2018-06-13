let Tool = require('./utils/tool')
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('login success => ',res)
        // if (res.code) {
        //   Tool.request({
        //     url:'',
        //     data:{
        //       code: res.code
        //     }
        //   }).then((res) => {
        //     console.log('get openId => ',res)
        //   })
        // }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})