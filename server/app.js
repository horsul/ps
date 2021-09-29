const http = require('http')
const https = require('https')
const path = require('path')

const config = require('./config')

const Koa = require('koa')
const Router = require('koa-router')
const Sqlite = require('./db/sqlite')

const rootModule = require('./modules/root')

async function createApp() {
  const app = new Koa()
  const router = new Router()

  router.use('/', rootModule.routes())

  // router.use('/auth', authModule.routes())
  // router.use(
  //   jwtMiddleware({
  //     secret: config.secret
  //   })
  // )

  app.use(router.allowedMethods())
  app.use(router.routes())

  app.context.db = await Sqlite.init(path.resolve(__dirname, '../db/db.db'))

  return app
}

;(async function () {
  const app = await createApp()

  const httpServer = http.createServer(app.callback())
  const httpsServer = https.createServer(config.https.options, app.callback())

  httpServer.listen(config.http.port, () => {
    console.log('Http сервер стартовал на порту: ' + config.http.port)
  })

  httpsServer.listen(config.https.port, () => {
    console.log('Https сервер стартовал на порту: ' + config.https.port)
  })
})()
