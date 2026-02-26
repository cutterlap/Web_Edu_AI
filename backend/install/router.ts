import express, { Request, Response } from 'express'
import mysql from 'mysql2'
import fs from 'fs'
import path from 'path'

const router = express.Router()

// 定义请求体接口
interface DbConfig {
  host: string
  user: string
  password: string
  dbname: string
}

interface TestDbRequest extends Request {
  body: DbConfig
}

interface InstallRequest extends Request {
  body: DbConfig
}

// 定义响应接口
interface ApiResponse {
  code: number
  msg: string
}

// 新增：封装数据库连接函数
function createConnection(config: Partial<DbConfig>, database?: string) {
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: database,
    port: 3306,
    connectTimeout: 10000
  })
}

// 新增：测试数据库连接接口（解决 404 问题）
router.post('/test-db', (req: TestDbRequest, res: Response<ApiResponse>) => {
  const { host, user, password, dbname } = req.body

  // 输入参数校验
  if (!host || !user || !password || !dbname) {
    return res.json({
      code: 400,
      msg: '缺少必要参数：host, user, password, dbname'
    })
  }

  const connection = createConnection({ host, user, password })

  connection.connect((err: mysql.QueryError | null) => {
    connection.end() // 无论成功失败，都关闭连接
    if (err) {
      return res.json({
        code: 500,
        msg: `数据库连接失败：${err.message}`
      })
    }
    res.json({
      code: 200,
      msg: '数据库连接成功！'
    })
  })
})

// 原有：一键安装接口
router.post('/run-install', (req: InstallRequest, res: Response<ApiResponse>) => {
  const { host, user, password, dbname } = req.body

  // 输入参数校验
  if (!host || !user || !password || !dbname) {
    return res.json({
      code: 400,
      msg: '缺少必要参数：host, user, password, dbname'
    })
  }

  const connection = createConnection({ host, user, password })

  connection.connect((err: mysql.QueryError | null) => {
    if (err) {
      return res.json({
        code: 500,
        msg: `数据库连接失败：${err.message}`
      })
    }

    // 创建数据库
    connection.query(
      `CREATE DATABASE IF NOT EXISTS ?? DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`,
      [dbname],
      (err: mysql.QueryError | null) => {
        if (err) {
          connection.end()
          return res.json({
            code: 500,
            msg: `创建数据库失败：${err.message}`
          })
        }

        const db = createConnection({ host, user, password }, dbname)

        db.connect((err: mysql.QueryError | null) => {
          if (err) {
            connection.end()
            return res.json({
              code: 500,
              msg: `连接 ${dbname} 数据库失败：${err.message}`
            })
          }

          // 初始化表结构
          const sqls = [
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
            `CREATE TABLE IF NOT EXISTS role (
              id INT PRIMARY KEY AUTO_INCREMENT,
              name VARCHAR(50)
            )`,
            `CREATE TABLE IF NOT EXISTS menu (
              id INT PRIMARY KEY AUTO_INCREMENT,
              title VARCHAR(50),
              path VARCHAR(100),
              pid INT DEFAULT 0
            )`,
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

          let index = 0
          function execSql() {
            if (index >= sqls.length) {
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

            db.query(sqls[index], (err: mysql.QueryError | null) => {
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
      }
    )
  })
})

// 安装页面渲染
router.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

export default router
