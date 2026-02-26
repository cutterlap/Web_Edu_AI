const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const fs = require('fs')
const path = require('path')

// 新增：测试数据库连接接口（解决 404 问题）
router.post('/test-db', (req, res) => {
  const { host, user, password, dbname } = req.body
  // 创建数据库连接（先不指定数据库，只验证账号密码）
  const connection = mysql.createConnection({
    host,
    user,
    password,
    port: 3306,
    connectTimeout: 5000 // 5秒超时
  })

  // 尝试连接
  connection.connect(err => {
    connection.end() // 无论成功失败，都关闭连接
    if (err) {
      return res.json({
        code: 500,
        msg: `数据库连接失败：${err.message}`
      })
    }
    // 连接成功后，再检查数据库是否存在（可选）
    res.json({
      code: 200,
      msg: '数据库连接成功！'
    })
  })
})

// 原有：一键安装接口
router.post('/run-install', (req, res) => {
  const { host, user, password, dbname } = req.body
  // 1. 先连接 MySQL（不指定数据库，用于创建数据库）
  const connection = mysql.createConnection({
    host,
    user,
    password,
    port: 3306,
    connectTimeout: 10000
  })

  connection.connect(err => {
    if (err) {
      return res.json({
        code: 500,
        msg: `数据库连接失败：${err.message}`
      })
    }

    // 2. 创建 test 数据库（如果不存在）
    connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbname} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
      err => {
        if (err) {
          connection.end()
          return res.json({
            code: 500,
            msg: `创建数据库失败：${err.message}`
          })
        }

        // 3. 重新连接到新建的 test 数据库
        const db = mysql.createConnection({
          host,
          user,
          password,
          database: dbname,
          port: 3306
        })

        db.connect(err => {
          if (err) {
            connection.end()
            return res.json({
              code: 500,
              msg: `连接 ${dbname} 数据库失败：${err.message}`
            })
          }

          // 新增：显式切换到目标数据库
          db.query(`USE ${dbname}`, err => {
            if (err) {
              db.end()
              connection.end()
              return res.json({
                code: 500,
                msg: `切换数据库失败：${err.message}`
              })
            }

            // 4. 初始化表结构
            const sqls = [
              // 用户表
              `CREATE TABLE IF NOT EXISTS user (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(50) NULL,
                avatar VARCHAR(255) NULL,
                department VARCHAR(100) NULL,
                wx_userid VARCHAR(50) NULL,
                bind_wx_userid VARCHAR(50) NULL,
                role_id INT NULL
              )`,
              // 角色表
              `CREATE TABLE IF NOT EXISTS role (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50)
              )`,
              // 菜单表
              `CREATE TABLE IF NOT EXISTS menu (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(50),
                path VARCHAR(100),
                pid INT DEFAULT 0
              )`,
              // 插入默认数据
              `INSERT INTO role(name) VALUES ('超级管理员')`,
              `INSERT INTO menu(title,path) VALUES 
                ('用户管理','/user'),
                ('角色管理','/role'),
                ('菜单管理','/menu'),
                ('模块安装','/module'),
                ('文章管理','/article')`,
              `INSERT INTO user(username,password,role_id) 
                VALUES ('admin','$2a$10$ZJygGH8M/l/NDyGdR5bUepeh0tXbJfGGmZJ5H0GdNnH1G8dQaS1i',1)`
            ]

            // 批量执行 SQL
            let index = 0
            function execSql() {
              if (index >= sqls.length) {
                // 生成 config.json
                const config = {
                  host,
                  user,
                  password,
                  database: dbname,
                  port: 3306
                }
                fs.writeFileSync(path.join(__dirname, '../config/config.json'), JSON.stringify(config, null, 2))
                db.end()
                connection.end()
                return res.json({
                  code: 0,
                  msg: '安装成功！'
                })
              }

              db.query(sqls[index], err => {
                if (err) {
                  db.end()
                  connection.end()
                  return res.json({
                    code: 500,
                    msg: `初始化表结构失败：${err.message}`
                  })
                }
                index++
                execSql()
              })
            }

            execSql()
          })
        })
      }
    )
  })
})

// 安装页面渲染
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

module.exports = router
