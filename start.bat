@echo off
chcp 65001
cls
echo ======================================================
echo          企业后台管理系统 - 绿色免安装版
echo              无需安装任何环境 · 双击即用
echo ======================================================
echo.

echo 正在启动内置MySQL数据库...
cd mysql\bin
start /B mysqld.exe
cd ..\..
timeout /t 3 /nobreak > nul

echo 正在启动后端服务...
start cmd /k "cd backend && npm install && node app.js"
timeout /t 2 /nobreak > nul

echo 正在启动前端管理页面...
start cmd /k "cd frontend && npm install && npm run dev"
timeout /t 5 /nobreak > nul

echo 正在打开后台管理系统...
start http://localhost:5173

echo.
echo ======================================================
echo  ✅ 启动完成！请不要关闭黑窗口
echo  前端地址：http://localhost:5173
echo  安装地址：http://localhost:3000/install
echo  管理员账号：admin
echo  管理员密码：admin123
echo ======================================================
echo.
pause