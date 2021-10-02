const Router = require('koa-router')

const router = new Router()

router.get('/', async ctx => {
  ctx.body = await ctx.db.users()
})

router.get('/:id', async ctx => {
  const user = await ctx.db.user(Number(ctx.params.id))
  if (user) {
    ctx.body = user
  } else {
    ctx.status = 404
    ctx.body = 'Not found'
  }
})

module.exports = router
