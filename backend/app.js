const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

// 判断是否已安装
const isInstalled = fs.existsSync(path.join(__dirname, 'config/config.json'))
if (!isInstalled) {
  app.use('/install', require('./install/router'))
} else {
  // 自动加载所有路由
  fs.readdirSync(path.join(__dirname, 'routes')).forEach(file => {
    const route = require(`./routes/${file}`)
    app.use('/api', route)
  })
}

app.listen(3000, () => {
  console.log('✅ 后端服务启动成功：http://localhost:3000')
})
