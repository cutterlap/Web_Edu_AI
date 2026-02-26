const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const fs = require('fs')
const path = require('path')

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json'), 'utf8'))
const db = mysql.createConnection(config)

// 菜单列表
router.get('/menu/list', (req, res) => {
  db.query('SELECT * FROM menu ORDER BY pid,id', (err, data) => {
    res.json({ code: 0, data })
  })
})

// 新增菜单
router.post('/menu/add', (req, res) => {
  const { title, path, pid } = req.body
  db.query('INSERT INTO menu (title, path, pid) VALUES (?,?,?)', [title, path, pid || 0], () => {
    res.json({ code: 0, msg: '添加成功' })
  })
})

// 编辑菜单
router.post('/menu/edit', (req, res) => {
  const { id, title, path } = req.body
  db.query('UPDATE menu SET title=?, path=? WHERE id=?', [title, path, id], () => {
    res.json({ code: 0, msg: '修改成功' })
  })
})

// 删除菜单
router.post('/menu/del', (req, res) => {
  db.query('DELETE FROM menu WHERE id=?', [req.body.id], () => {
    res.json({ code: 0, msg: '删除成功' })
  })
})

module.exports = router
