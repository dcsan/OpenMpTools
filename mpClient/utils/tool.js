// TODO - better namespacing

const request = obj => {
  return new Promise((resolve, reject) => {
  	wx.request({
  	  url: obj.url,
  	  data: obj.data || {},
  	  header: obj.header || {'content-type': 'application/json'},
  	  method: obj.method || 'GET',
  	  dataType: obj.dataType || 'json',
  	  responseType: obj.responseType || 'text',
  	  success(e) {
  	  	console.log('%c request success...','color:green;font-size:20px;')
  	  	console.log(e)
  	  	resolve(e)
  	  },
  	  fail(e) {
  	  	console.log('%c request fail...','color:red;font-size:20px;')
  	  	console.log(e)
  	  	reject(e)
  	  },
  	  complete(e) {
  	  	console.log('%c request complete...','color:orange;font-size:20px;')
  	  	console.log(e)
  	  }
  	})
  })
}

const pay = obj => {
  return new Promise((resolve, reject) => {
    console.log('Tool.pay', obj)
  	wx.requestPayment({
	   'timeStamp': obj.timeStamp,
	   'nonceStr': obj.nonceStr,
     'package': obj.package,
	   'signType': 'MD5',
	   'paySign': obj.paySign,
	   'success':function(res){
	   	  console.log('%c pay success...','color:green;font-size:20px;')
	   	  console.log(res)
	   	  resolve(res)
	   },
	   'fail':function(res){
	      console.log('%c pay fail...','color:magenta;font-size:20px;')
	      console.log(res)
	      reject(res)
	   },
	   'complete': function(res){
	   	  console.log('%c pay complete...','color:orange;font-size:20px;')
	      console.log(res)
	   }
	})
  })
}

module.exports = {
  request: request,
  pay: pay
}
