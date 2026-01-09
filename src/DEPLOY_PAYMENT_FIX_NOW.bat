@echo off
REM 🚀 Deploy Payment Fix - Redeploy Edge Function (Windows)
REM This will fix the 401 error on payment verification

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🚀 Deploying Payment Verification Fix
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

echo 📋 What this does:
echo   ✅ Redeploys the Edge Function with NO AUTH on verify endpoint
echo   ✅ Adds more logging to debug the issue
echo   ✅ Should fix the 401 Unauthorized error
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Supabase CLI not installed!
    echo Install it: npm install -g supabase
    pause
    exit /b 1
)

REM Deploy the function
echo.
echo 🚀 Deploying payments-simple Edge Function...
echo.

supabase functions deploy payments-simple --no-verify-jwt

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo ✅ Deployment Successful!
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo 📋 Next steps:
    echo   1. Go back to your payment page
    echo   2. Refresh the page (F5^)
    echo   3. Try the payment verification again
    echo.
    echo 🔍 To check logs:
    echo   supabase functions logs payments-simple --tail
    echo.
) else (
    echo.
    echo ❌ Deployment failed!
    echo Check the error message above
    pause
    exit /b 1
)

pause
