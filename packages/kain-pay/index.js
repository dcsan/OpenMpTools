/*
 * Author: Kain·Shi <a904616537@outlook.com>
 * Module description: 调用
 */

const request = require('request');
const Base = require('./lib/base');
const util = require('./lib/util');


const unifiedorder_url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';	// 统一下单地址

class WXpay extends Base {
	/**
	 * [调用统一下单]
	 * @param  {[object]}   option
	 * @model {
	 *      body             : string,		// 商品描述
			detail           : string,		// 详细描述
			out_trade_no     : string,		// 商户订单号
			total_fee        : string,		// 支付金额 1 * 100
			spbill_create_ip : string,		// 终端ip地址
			openid 			 : string
	 * }
	 */
	unifiedOrder(option, callback) {

		if(!this.validation) return callback('参数验证失败，请检查参数', null);
		let formdata = Object.assign(this.config, {...option});
		const sign = this.paySignjsapi(formdata).toUpperCase();
		formdata = util.buildXML(Object.assign(formdata, {sign}));

		console.log('formdata', formdata)
		request({
			url    : unifiedorder_url,
			method : 'POST',
			body   : formdata,
			agentOptions: {
				pfx        : this.option.pfx,
				passphrase : this.config.mch_id
			}
		}, (err, response, body) => {
			if(err) {
				console.error('微信统一下单出错！', err)
				callback(err, null);
			} else if (response.statusCode == 200) {
				console.log('微信统一下单调用成功', body)
				this.packaging(body, (err, packaging) => {
					if(err)
						callback(err, null);
					else
						callback(null, packaging);
				})
			} else {
				console.error('微信统一下单调用失败！', response);
				callback('微信统一下单调用失败！', response);
			}
		});
	}
}

module.exports = WXpay;
