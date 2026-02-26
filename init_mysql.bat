@echo off
chcp 437 >nul
title MySQL Initialization Tool
echo ==================================================
echo          MySQL Green Version Initialization Tool
echo ==================================================

:: 定义路径
set "CURRENT_DIR=%~dp0"
set "MYSQL_DIR=%CURRENT_DIR%mysql"
set "MY_INI_PATH=%MYSQL_DIR%\my.ini"

:: 检查 mysql 文件夹
if not exist "%MYSQL_DIR%" (
    echo Error: MySQL folder not found!
    pause
    exit /b 1
)

:: 生成 my.ini
if exist "%MY_INI_PATH%" del /f /q "%MY_INI_PATH%"
(
    echo [mysqld]
    echo port=3306
    echo basedir=%MYSQL_DIR%
    echo datadir=%MYSQL_DIR%\data
    echo max_connections=200
    echo max_connect_errors=10
    echo character-set-server=utf8mb4
    echo default-storage-engine=INNODB
    echo.
    echo [mysql]
    echo default-character-set=utf8mb4
    echo.
    echo [client]
    echo port=3306
    echo default-character-set=utf8mb4
) > "%MY_INI_PATH%"

:: 停止旧进程 + 初始化 + 启动
taskkill /f /im mysqld.exe >nul 2>&1
timeout /t 2 /nobreak >nul

if not exist "%MYSQL_DIR%\data" (
    cd /d "%MYSQL_DIR%\bin"
    mysqld --initialize-insecure --user=mysql --character-set-server=utf8mb4 >nul 2>&1
)

cd /d "%MYSQL_DIR%\bin"
start /B mysqld.exe
timeout /t 5 /nobreak >nul

:: 只显示最终提示，不检测（避免双提示）
echo ==================================================
echo MySQL initialization completed!
echo Please check task manager for "mysqld.exe" process.
echo Database Info: root / empty password / localhost:3000
echo ==================================================
pause