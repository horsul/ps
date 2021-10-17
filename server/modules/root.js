const Router = require('koa-router')

const router = new Router()

router.get('/', async ctx => {

  const result = {
    groups: tree(await ctx.db.groups(), 0)
  }

  const token = ctx.cookies.get('jwt')

  if (token) {
    const user = await ctx.db.userByToken(token)
    result.user = user
  }

  ctx.body = result
})

function tree(nodes, parentId) {
  return nodes
    .filter(node => node.parentId === parentId)
    .reduce((acc, node) => {
      const children = tree(nodes, node.id)

      const obj = {
        id: node.id,
        name: node.name,
        sort: node.sort
      }
      if (children.length > 0) {
        obj.children = children.sort((a, b) => a.sort - b.sort).map(r => ({ id: r.id, name: r.name }))
      }
      return [...acc, obj]
    }, [])
    .sort((a, b) => a.sort - b.sort)
    .map(r => ({ id: r.id, name: r.name, children: r.children }))
}

module.exports = router
