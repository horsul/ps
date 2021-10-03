const Router = require('koa-router')
const bodyparser = require('koa-bodyparser')
const config = require('../config')
const jwt = require('jsonwebtoken')
const jwtMiddleware = require('koa-jwt')
const { v4: uuidv4 } = require('uuid')

const router = new Router()

router.post('/login', bodyparser(), async ctx => {

  const { login, password } = ctx.request.body
  const user = await ctx.db.userByEmail(login)

  if (!user || user.password !== password) {
    const error = new Error()

    error.status = 403

    throw error
  }

  const pair = await issue(ctx.db, { id: user.id_user })

  ctx.body = pair
})

router.post('/refresh', bodyparser(), async ctx => {
  const { refreshToken } = ctx.request.body

  const dbToken = await ctx.db.token(refreshToken)

  if (!dbToken) {
    const error = new Error()

    error.status = 404

    throw error
  }

  await ctx.db.removeToken({
    token: refreshToken
  })

  ctx.body = await issue(ctx.db, { id: dbToken.id_user })
})

router.post('/logout', jwtMiddleware({ secret: config.secret }), async ctx => {
  const { id: id_user } = ctx.state.user

  await ctx.db.removeTokenByUser({ id_user })

  ctx.body = { success: true }
})

async function issue(db, user) {
  const refreshToken = uuidv4()

  await db.addToken({
    token: refreshToken,
    id_user: user.id
  })

  return {
    token: jwt.sign(user, config.secret, { expiresIn: 60 * 60 }),
    refreshToken
  }
}

module.exports = router
