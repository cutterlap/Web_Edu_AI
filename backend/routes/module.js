const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')
const mysql = require('mysql2')

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json')))
const db = mysql.createConnection(config)

// 上传配置
const upload = multer({ dest: path.join(__dirname, '../uploads/') })

// 1. 上传模块ZIP并安装
router.post('/module/install', upload.single('file'), async (req, res) => {
  try {
    const zipPath = req.file.path
    const extractDir = path.join(__dirname, '../uploads/module_temp')

    // 解压
    await fs
      .createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractDir }))
      .promise()

    // 读取模块信息
    const info = JSON.parse(fs.readFileSync(path.join(extractDir, 'info.json'), 'utf8'))
    const { route, view, sql } = info

    // 1. 安装路由
    if (route) {
      const srcRoute = path.join(extractDir, route)
      const destRoute = path.join(__dirname, `./${path.basename(route)}`)
      fs.copyFileSync(srcRoute, destRoute)
    }

    // 2. 安装页面
    if (view) {
      const srcView = path.join(extractDir, view)
      const destView = path.join(__dirname, '../../frontend/src/views/' + path.basename(view))
      fs.copyFileSync(srcView, destView)
    }

    // 3. 执行SQL
    if (sql) {
      const sqlContent = fs.readFileSync(path.join(extractDir, sql), 'utf8')
      const sqlList = sqlContent.split(';').filter(s => s.trim())
      for (const q of sqlList) {
        await db.query(q)
      }
    }

    // 清理临时文件
    fs.rmSync(extractDir, { recursive: true, force: true })
    fs.unlinkSync(zipPath)

    res.json({ code: 0, msg: '模块安装成功！刷新页面即可使用' })
  } catch (err) {
    res.json({ code: -1, msg: '安装失败：' + err.message })
  }
})

// 模块列表
router.get('/module/list', (req, res) => {
  res.json({ code: 0, data: [] })
})

module.exports = router
