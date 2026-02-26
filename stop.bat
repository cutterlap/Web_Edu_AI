@echo off
chcp 65001
echo 正在停止数据库服务...
taskkill /f /im mysqld.exe >nul 2>&1
echo ✅ 数据库已安全关闭
pause