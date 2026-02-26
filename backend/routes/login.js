const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

let db;
try {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json'), 'utf8'));
  db = mysql.createConnection(config);
} catch (e) {
  db = null;
}

// 登录接口
router.post('/login', (req, res) => {
  if (!db) return res.json({ code: -1, msg: '系统未安装' });

  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ code: -1, msg: '账号密码不能为空' });
  }

  db.query('SELECT * FROM user WHERE username = ?', [username], async (err, result) => {
    if (err || result.length === 0) {
      return res.json({ code: -1, msg: '账号或密码错误' });
    }

    const user = result[0];
    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
      return res.json({ code: -1, msg: '账号或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      'ADMIN_SYSTEM_2026_TOKEN',
      { expiresIn: '7d' }
    );

    res.json({
      code: 0,
      msg: '登录成功',
      token,
      user: { id: user.id, username: user.username, role_id: user.role_id }
    });
  });
});

module.exports = router;