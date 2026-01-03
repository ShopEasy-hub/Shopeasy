@echo off
REM Check Edge Function logs for payment errors

echo ================================
echo Checking Payment Function Logs
echo ================================
echo.

echo Opening Supabase Edge Functions logs...
echo.
echo Go to: https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup/functions/payments-simple/logs
echo.
echo Look for errors around the verification request
echo Reference: SUB_1767352057328_810K525
echo.
echo Things to look for:
echo - "Verifying payment" log
echo - Any errors from Paystack API
echo - The callback_url being sent
echo - Response from Paystack verification
echo.

start https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup/functions/payments-simple/logs

echo.
pause
