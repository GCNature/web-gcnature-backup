@echo off
title GCnature Production Server
echo ==============================================
echo   GCnature - Starting Production Services
echo   Frontend: Served by Apache on Port 80/443
echo   Backend:  Running on Port 8081
echo   Database: Running on Port 3307 (Custom)
echo ==============================================
echo.

:: 1. Check if MySQL is already running on port 3307
netstat -ano | findstr :3307 >nul
if %errorlevel% equ 0 (
    echo [INFO] MySQL is already running on port 3307.
) else (
    echo [1/2] Starting MySQL Database...
    start /b "" "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="c:\Users\WEB GCNATURE\mysql_data\my.ini" --standalone
    timeout /t 3 /nobreak >nul
)

:: 2. Check if Node backend is already running on port 8081
netstat -ano | findstr :8081 >nul
if %errorlevel% equ 0 (
    echo [INFO] Node.js Backend is already running on port 8081.
) else (
    echo [2/2] Starting Node.js Backend...
    cd /d "c:\Users\WEB GCNATURE\Web - GCnature\server"
    start /b "" "C:\Users\webMercy\AppData\Local\ms-playwright-go\1.57.0\node.exe" "node_modules\tsx\dist\cli.mjs" src/index.ts
)

echo.
echo ==============================================
echo   Services started! Keep this window open or
echo   verify with netstat -ano if needed.
echo ==============================================
pause
