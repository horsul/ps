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

  ctx.body = await issue(ctx, { id: user.id_user })
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

  ctx.body = await issue(ctx, { id: dbToken.id_user })
})

router.post('/logout', jwtMiddleware({ secret: config.secret }), async ctx => {
  const { id: id_user } = ctx.state.user

  await ctx.db.removeTokenByUser({ id_user })

  ctx.cookies.set('jwt', '', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 0
  })

  ctx.body = { success: true }
})

async function issue(ctx, user) {
  const refreshToken = uuidv4()

  await ctx.db.addToken({
    token: refreshToken,
    id_user: user.id
  })

  ctx.cookies.set('jwt', refreshToken, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000
  })

  return {
    token: jwt.sign(user, config.secret, { expiresIn: 60 * 60 }),
    refreshToken
  }
}

module.exports = router
