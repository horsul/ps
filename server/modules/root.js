const Router = require('koa-router')

const router = new Router()

router.get('/', async ctx => {
  ctx.body = tree(await ctx.db.groups(), 0)
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
    }, []).sort((a, b) => a.sort - b.sort).map(r => ({ id: r.id, name: r.name, children: r.children }))
}

module.exports = router