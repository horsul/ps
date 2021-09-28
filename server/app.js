const https = require('https')
const path = require('path')

const Sqlite = require('./db/sqlite')

Sqlite.init(path.resolve(__dirname, '../db/db.db')).then(db => {
    console.log('db created')
//   app.set('db', db)

//   httpsServer.listen(port, () => {
//     console.log('Сервер стартовал на порту: ' + port)
//   })

//   app.set('ips', ips)
})

console.log('started')
