const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json'), 'utf8'))
const db = mysql.createConnection(config)

// 用户列表
router.get('/user/list', (req, res) => {
  const sql = `
    SELECT u.*, r.name AS role_name 
    FROM user u
    LEFT JOIN role r ON u.role_id = r.id
  `
  db.query(sql, (err, data) => {
    res.json({ code: 0, data })
  })
})

// 新增用户
router.post('/user/add', async (req, res) => {
  const { username, password, role_id } = req.body
  const pwd = await bcrypt.hash(password, 10)
  db.query('INSERT INTO user (username, password, role_id) VALUES (?,?,?)', [username, pwd, role_id], () => {
    res.json({ code: 0, msg: '添加成功' })
  })
})

// 编辑用户
router.post('/user/edit', (req, res) => {
  const { id, username, role_id } = req.body
  db.query('UPDATE user SET username=?, role_id=? WHERE id=?', [username, role_id, id], () => {
    res.json({ code: 0, msg: '修改成功' })
  })
})

// 删除用户
router.post('/user/del', (req, res) => {
  db.query('DELETE FROM user WHERE id=?', [req.body.id], () => {
    res.json({ code: 0, msg: '删除成功' })
  })
})

module.exports = router
