const fs = require('fs')
const path = require('path')

module.exports = {
  http: {
    port: 3000
  },
  https: {
    port: 3001,
    options: {
      key: fs.readFileSync(path.resolve(__dirname,  'ssl/local.key'), 'utf8'),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/local.pem'), 'utf8')
    }
  },
  secret: 'jlkjk;j;lkjkjiioiiuiyy][piiiuyttrewssz',
  origin: 'http://localhost:8080'
}
