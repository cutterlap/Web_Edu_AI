const mysql = require('mysql2')
const fs = require('fs')
const path = require('path')

let config
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'))
} catch (e) {
  config = null
}

const db = config ? mysql.createConnection(config) : null

module.exports = db
