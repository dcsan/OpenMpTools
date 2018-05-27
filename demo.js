/*
 * Author: Kain·Shi <a904616537@outlook.com>
 * Module description: Demo
 * apiclient_cert.p12 请使用自己的文件
 */

const path = require('path'),
fs         = require('fs'),
moment     = require('moment'),
WXpayment  = require('./index'),
rootPath   = path.normalize(__dirname);

const option = {
	pfx       : fs.readFileSync(rootPath + '/apiclient_cert.p12'),
	appsecret : '0f7f047780e15e68308ed981c4f0bfed',
},
config = {
	appid      : 'wx06c82c3cbb012752',					// 小程序ID
	mch_id     : '1493918942',							// 商户号
	notify_url : 'https://tutorweb.rikai-bots.com',		// 支付信息通知地址
};

const payment = new WXpayment(option, config);
const formdata = {
	body             : '支付测试',		// 商品描述
	detail           : '支付测试',		// 详细描述
	out_trade_no     : 'orderid_' + moment().second() + moment().millisecond(),		// 商户订单号
	total_fee        : 10,		// 支付金额, 1元 = 1 * 100
	spbill_create_ip : '127.0.0.1',
	openid 			 : 'oJegnv-RgdwmlinNILZxWsUap8Og'
}

/**
 * [result]
 * {
 	appId,
	nonceStr,
	package,
	signType,
	timeStamp,
	paySignjs
 * }
 */
payment.unifiedOrder(formdata, (err, result) => {
	if(err) console.error(err);
	else console.log('result', result);
});

/**
 * mpwx demo
 * 调用payment.unifiedOrder 方法，返回 result 处理结果
 * wx.requestPayment({
		timeStamp : result.timeStamp,
		nonceStr  : result.nonceStr,
		package   : result.package,
		signType  : result.signType,
		paySign   : result.paySignjs,
		success(res){
			console.log('小程序支付调用成功', res)
		},
		fail(res){
			console.log('小程序支付调用失败', res)
		},
		complete(res){
		
		}
	})
 */
