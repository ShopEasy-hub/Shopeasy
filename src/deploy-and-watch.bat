@echo off
REM Deploy and Watch Script for Payment Callback Debugging (Windows)
REM This script will deploy the Edge Function and watch logs

echo ==================================
echo 🚀 ShopEasy Payment Debug Script
echo ==================================
echo.

REM Check if Supabase CLI is available
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI not found!
    echo.
    echo Install it with:
    echo   npm install -g supabase
    echo.
    pause
    exit /b 1
)

echo ✅ Supabase CLI found
echo.

REM Step 1: Deploy function
echo ==================================
echo STEP 1: Deploying Edge Function
echo ==================================
echo.

call npx supabase functions deploy payments-simple

if %errorlevel% neq 0 (
    echo.
    echo ❌ Deployment failed!
    echo Please check the error above and try again.
    pause
    exit /b 1
)

echo.
echo ✅ Deployment successful!
echo.

REM Step 2: Show instructions
echo ==================================
echo STEP 2: What to do next
echo ==================================
echo.
echo I will now start watching logs in real-time.
echo.
echo 📋 In another window:
echo   1. Go to: https://shopeasy-lemon.vercel.app
echo   2. Press F12 to open console
echo   3. Try making a payment
echo   4. Watch THIS terminal for logs
echo.
echo 🔍 Look for these lines:
echo   🔍 FRONTEND_URL from env: ...
echo   🔍 Callback URL will be: ...
echo.
echo Press Ctrl+C to stop watching logs
echo.
echo ==================================
echo STEP 3: Watching logs...
echo ==================================
echo.

REM Step 3: Watch logs
call npx supabase functions logs payments-simple --follow
