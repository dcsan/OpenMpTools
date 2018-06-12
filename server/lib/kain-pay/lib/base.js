/*
 * Author: Kain·Shi <a904616537@outlook.com>
 * Module description: wechat payment base
 */

const
  crypto        = require('crypto'),
  moment       = require('moment'),
  md5 = require('md5'),
  shortid      = require('shortid'),
  util         = require('./util');

class Base {

	constructor(option, config) {
		this.option = Object.assign(this.option, option);
		this.config = Object.assign(this.config, config);
	}

	// 验证参数
	get validation() {
		const {option, config} = this;

		if(typeof option.pfx === undefined)
			return false;
		else if(option.appsecret === undefined)
			return false;
		else
			return this.onIterator(config);
	}

	async onIterator(obj) {
		const props = Object.values(obj);
		const validation = (v) => {
			if(v === undefined) return true;
			else return false;
		}

		for(let val of props) {
			const ret = await validation(val);
			if(ret) return false
		}

		return true;
	}

	// 生成微信签名
	paySignjsapi(option) {
		let string = util.raw1(option);
		string     = `${string}&key=${this.option.partnerKey}`;

    console.log('string', string);
    const paySign = crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
    // const paySign = md5(string).digest('hex');
		return paySign;
	}

	// 参数打包
	packaging(xml, callback) {
		try {
			util.parseXML(xml, (err, result) => {
        console.log('result', result);
				if(result && result.prepay_id) {
					const prepay_id = result.prepay_id;
					const timeStamp = moment().unix(),
					nonce_str       = shortid.generate(),
					signType        = 'MD5',
					jsapi_cfg       = {	// 生成二次签名
						appId    : this.config.appid,
						nonceStr : nonce_str,
						package  : `prepay_id=${prepay_id}`,
						signType,
						timeStamp
					},
					paySign   = this.paySignjsapi(jsapi_cfg);

					callback(null, Object.assign(jsapi_cfg, {paySign}));
				} else {
					callback('统一支付调用错误，参数不正确', null);
					return;
				}
			})
          } catch (e) {
            console.error(e)
            callback('打包出错', null);
          }
	}
}

Base.prototype.option = {
	appsecret : undefined,		// 公众号密钥
	pfx       : undefined		// 商户证书文件
};

Base.prototype.config = {
	appid            : undefined,		// 小程序ID
	mch_id           : undefined,		// 商户号
	nonce_str        : shortid.generate(),		// 随机字符串
	notify_url       : undefined,		// 支付信息通知地址
	trade_type       : 'JSAPI'			// 支付信息
};

module.exports = Base;
