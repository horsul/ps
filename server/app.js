const fs = require('fs').promises
const http = require('http')
const https = require('https')
const path = require('path')

const Koa = require('koa')
const Sqlite = require('./db/sqlite')

const router = require('./router/router')

const app = new Koa()

app.use(router.routes())
app.use(router.allowedMethods())

;(async function () {
  const credentials = {
    key: await fs.readFile(path.resolve(__dirname, './ssl/private.key'), 'utf8'),
    cert: await fs.readFile(path.resolve(__dirname, './ssl/vzljot.pem'), 'utf8')
  }

  const httpServer = http.createServer(app.callback())
  const httpsServer = https.createServer(credentials, app.callback())

  Sqlite.init(path.resolve(__dirname, '../db/db.db')).then(db => {
    app.db = db

    httpServer.listen(3000, () => {
      console.log('Http сервер стартовал на порту: ' + 3000)
    })

    httpsServer.listen(3001, () => {
      console.log('Https сервер стартовал на порту: ' + 3001)
    })
  })
})()
