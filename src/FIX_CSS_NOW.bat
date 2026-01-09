@echo off
echo ================================================
echo     SHOPEASY CSS FIX - Automated Repair
echo ================================================
echo.

echo [1/4] Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/4] Clearing Vite cache...
if exist node_modules\.vite (
    rmdir /S /Q node_modules\.vite
    echo    - Vite cache cleared
) else (
    echo    - No Vite cache found
)

echo [3/4] Clearing build directory...
if exist dist (
    rmdir /S /Q dist
    echo    - Build directory cleared
) else (
    echo    - No build directory found
)

echo [4/4] Starting dev server...
echo.
echo ================================================
echo  Open http://localhost:3000 in your browser
echo  You should see a DIAGNOSTIC PAGE with tests
echo ================================================
echo.
npm run dev
