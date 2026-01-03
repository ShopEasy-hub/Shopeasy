@echo off
REM Deploy diagnostic function without JWT verification

echo ================================
echo Deploying Diagnostic Function
echo ================================
echo.

echo This function will be publicly accessible (no auth required)
echo.

call npx supabase functions deploy diagnostic --no-verify-jwt

if %errorlevel% neq 0 (
    echo.
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ✅ Diagnostic function deployed successfully!
echo.
echo Now open diagnostic-dashboard.html in your browser
echo.
pause
