/*
 * Author: Kain·Shi <a904616537@outlook.com>
 * Module description: 工具
 */

const xml2js = require('xml2js');

module.exports = {
	raw1(args) {
		let keys = Object.keys(args);
		keys     = keys.sort();

		let newArgs = {};
		keys.forEach((key) => {
			newArgs[key] = args[key];
		});
		let string = '';
		for (let k in newArgs) {
			string += '&' + k + '=' + newArgs[k];
		}
		string = string.substr(1);
		return string;
	},
	buildXML(obj) {
		const builder = new xml2js.Builder({
      allowSurrogateChars : true,
      headless: true
		});
		const xml = builder.buildObject({
			xml : obj
		});
		return xml;
	},
	parseXML(xml, fn) {
		const parser = new xml2js.Parser({
			trim          : true,
			explicitArray : false,
			explicitRoot  : false
		});
		parser.parseString(xml, fn || function(err, result){ });
	},
	cipher(str ,callback) {
		let encrypted = "";
		this.randomWord(true, 3, 32, key => {
			let cip = crypto.createCipher('aes192', key);
			encrypted += cip.update(str, 'binary', 'hex');
			encrypted += cip.final('hex');
			callback(encrypted, key);
			return
		})
	},

	//加密
	key_cipher(str, key,callback) {
		let encrypted = "",
			cip       = crypto.createCipher('aes192', key);

		encrypted += cip.update(str, 'binary', 'hex');
		encrypted += cip.final('hex');
		callback(encrypted);
		return
	},

	//解密
	decipher(str, key, callback) {
	    let decrypted = "";
	    let decipher = crypto.createDecipher('aes192', key);
	    decrypted += decipher.update(str, 'hex', 'binary');
	    decrypted += decipher.final('binary');
	    callback(decrypted);
	},

	/**
	 * 产生随机字符串
	 * @param  {[Boolen]} randomFlag 3-32位 / 64位
	 * @param  {[number]} min        最小个数
	 * @param  {[number]} max        最大个数
	 * @return {[String]}            生成的随机字符串
	 */
	randomWord(randomFlag, min, max, callback) {
		let str = "",
		range   = min,
		arr     = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f',
		'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
		'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
		'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

		// 随机产生
		if(randomFlag) range = Math.round(Math.random() * (max-min)) + min;
		for(var i = 0; i<range; i++) {
			pos = Math.round(Math.random() * (arr.length-1));
			str += arr[pos];
			if (i+1  == range) return callback(str)
		}
	}
}

