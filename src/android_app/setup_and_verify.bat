@echo off
echo ===================================================
echo   SmartPrice AI - Android Flutter App Quick Setup
echo ===================================================
echo.

cd /d "D:\SRINIVAS\src\android_app"

:: Check if flutter is in path or in standard locations
where flutter >nul 2>nul
if %errorlevel% neq 0 (
    if exist "D:\flutter\flutter\bin\flutter.bat" (
        set "PATH=D:\flutter\flutter\bin;%PATH%"
    ) else if exist "C:\src\flutter\bin\flutter.bat" (
        set "PATH=C:\src\flutter\bin;%PATH%"
    ) else (
        echo [ERROR] Flutter SDK is not found in PATH or D:\flutter\flutter\bin.
        echo.
        echo Please ensure Flutter is extracted to D:\flutter\flutter or C:\src\flutter.
        echo.
        pause
        exit /b 1
    )
)

echo [1/4] Fetching Flutter dependencies...
call flutter pub get

echo.
echo [2/4] Setting up ADB reverse tunnel for local backend (port 3000)...
where adb >nul 2>nul
if %errorlevel% equ 0 (
    adb reverse tcp:3000 tcp:3000 >nul 2>nul
)

echo.
echo [3/4] Checking connected Android devices and emulators...
call flutter devices

echo.
echo [4/4] Launching SmartPrice AI Android App...
call flutter run

pause
