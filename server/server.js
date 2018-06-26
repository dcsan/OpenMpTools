const path = require('path')
const serveStatic = require('serve-static')
const ip = require('ip')
const express = require('express')
const bodyParser = require('body-parser')
const router = require('express').Router()

const debug = require("debug-levels")("server")
const app = express()


// const path = require('path'),
const fs  = require('fs'),
moment    = require('moment'),
WXpayment = require('./lib/kain-pay'),
rootPath  = path.normalize(__dirname);

const option = {
	pfx       : fs.readFileSync(rootPath + '/apiclient_cert.p12'),
  appsecret : '408f9af347447bea0b09ee350caddb13',
  partnerKey: 'afAun6G4V1AoTdEG1BpRIx4KtjSDIOYb'

},
config = {
	appid      : 'wx019a14a6b90883e5',					// 小程序ID
	mch_id     : '1503979901',							// 商户号
	notify_url : 'https://rikpay.rikai-bots.com/payment/notify',		// 支付信息通知地址
};

const payment = new WXpayment(option, config);



app.use(bodyParser.text({type: '*/xml'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// const zatlib = require('zatlib')

app.get("/", (req, res) => {
  console.log("/ping")
  res.send('logged.')
})


app.get("/ping", (req, res) => {
  console.log("/ping")
  res.json({
    msg: "pong"
  })
})

app.post("/payment/notify", (req, res) => {
  console.log("/notify", req.body)
  res.json({
    msg: "pong"
  })
})

app.post("/test", (req, res) => {
  console.log("POST.test")
  res.json({
    msg: "test"
  })
})

app.post('/payment',(req, res)=> {
  debug('req.body', req.body)
  const {openid, total} = req.body;
  const formdata = {
    body             : '支付测试',		// 商品描述
    detail           : '支付测试',		// 详细描述
    out_trade_no: `orderid_${moment().second()}${moment().millisecond()}`,
    // out_trade_no     : '20180612125748',		// 商户订单号
    total_fee        : total * 100,		// 支付金额, 1元 = 1 * 100
    spbill_create_ip : ip.address(),
    // openid 			 : "ot-If0bYCmZ5WWK6m8TXifnA9buU" // DC
    openid,
  }

  payment.unifiedOrder(formdata, (err, result) => {
    console.log('result', result)
    if(err) console.error(err);
    // else console.log('result', result);
    else res.send({result})
  });
})


const port = process.env.PORT || 9290

async function startUp() {
  // zatlib.test()
  // app.use(serveStatic('./public', {'index': ['index.html']}))
  app.use(serveStatic(path.join(__dirname, 'public')))

  app.listen(port, function () {
    console.log('server listening on port ', port)
  })

}

process.on('unhandledRejection', (err) => {
  debug.error(err)
 })

startUp()
