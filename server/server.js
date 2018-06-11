const path = require('path')
const serveStatic = require('serve-static')

const express = require('express')
const bodyParser = require('body-parser')
const router = require('express').Router()

const debug = require("debug-levels")("server")


const app = express()


app.get("/ping", (req, res) => {
  console.log("/ping")
  res.json({
    msg: "pong"
  })
})


const port = process.env.PORT || 4444

async function startUp() {

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
