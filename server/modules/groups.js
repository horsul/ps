async function groups(ctx, next) {
  ctx.body = await ctx.app.db.groups()
}

async function groupsByGroup(ctx, next) {
  ctx.body = await ctx.app.db.groups()
}

module.exports = {
  groups
}
