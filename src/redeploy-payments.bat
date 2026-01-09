@echo off
REM Redeploy payments function with enhanced logging

echo ================================
echo Deploying Payments Function
echo ================================
echo.

echo This will deploy the updated payments-simple function with detailed logging
echo.

call npx supabase functions deploy payments-simple

if %errorlevel% neq 0 (
    echo.
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ✅ Payments function deployed successfully!
echo.
echo Next steps:
echo 1. Try making another test payment
echo 2. Check logs at: https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup/functions/payments-simple/logs
echo 3. Look for detailed verification logs
echo.
pause
