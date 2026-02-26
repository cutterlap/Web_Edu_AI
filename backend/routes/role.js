const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const fs = require('fs')
const path = require('path')

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json'), 'utf8'))
const db = mysql.createConnection(config)

// 角色列表
router.get('/role/list', (req, res) => {
  db.query('SELECT * FROM role', (err, data) => {
    res.json({ code: 0, data })
  })
})

// 新增角色
router.post('/role/add', (req, res) => {
  db.query('INSERT INTO role (name) VALUES (?)', [req.body.name], () => {
    res.json({ code: 0, msg: '添加成功' })
  })
})

// 编辑角色
router.post('/role/edit', (req, res) => {
  db.query('UPDATE role SET name=? WHERE id=?', [req.body.name, req.body.id], () => {
    res.json({ code: 0, msg: '修改成功' })
  })
})

// 删除角色
router.post('/role/del', (req, res) => {
  db.query('DELETE FROM role WHERE id=?', [req.body.id], () => {
    res.json({ code: 0, msg: '删除成功' })
  })
})

module.exports = router
