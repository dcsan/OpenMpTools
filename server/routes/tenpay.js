
// demo from tenpay
// https://github.com/befinal/node-tenpay#express%E4%B8%AD%E4%BD%BF%E7%94%A8

const tenpay = require('tenpay');
const config = {
  appid: '公众号ID',
  mchid: '微信商户号',
  partnerKey: '微信支付安全密钥',
  pfx: require('fs').readFileSync('证书文件路径'),
  notify_url: '支付回调网址',
  spbill_create_ip: 'IP地址'
};

// 方式一
const api = new tenpay(config);
//方式二
const api = tenpay.init(config);

// 沙盒模式(用于微信支付验收)
const sandboxAPI = await tenpay.sandbox(config);

// needs ref to the app
app.use(bodyParser.text({type: '*/xml'}));

router.post('/xxx', api.middlewareForExpress('pay'), (req, res) => {
  let info = req.weixin;

  // 业务逻辑...
  // 回复消息(参数为空回复成功, 传值则为错误消息)
  res.reply('错误消息' || '');
});
