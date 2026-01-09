# 🔥 Fix 401 Unauthorized Payment Error

## The Problem

You're getting this error when verifying payments:
```
Failed to load resource: the server responded with a status of 401
Error: Failed to verify payment
```

The error message shows: `{"error": "Unauthorized - No auth header"}`

## The Cause

The Edge Function is checking for authorization on the verify endpoint, but it shouldn't be. This happened because:

1. The Edge Function code was modified to work with Figma Make URLs
2. The changes may not have been deployed properly
3. OR there's a cached version of the old Edge Function running

## The Fix

### Step 1: Redeploy the Edge Function

**On Windows:**
```bash
# Double-click this file:
DEPLOY_PAYMENT_FIX_NOW.bat

# OR run in terminal:
supabase functions deploy payments-simple --no-verify-jwt
```

**On Mac/Linux:**
```bash
# Run this:
bash DEPLOY_PAYMENT_FIX_NOW.sh

# OR run directly:
supabase functions deploy payments-simple --no-verify-jwt
```

### Step 2: Verify Deployment

After deployment, you should see:
```
✅ Deployed Function payments-simple in region us-west-2
```

### Step 3: Test Again

1. Go back to your payment callback page
2. Press F5 to refresh
3. The verification should now work

## What Changed

The Edge Function now:

1. **NO AUTH on verify endpoint** - The `/paystack/verify/:ref` endpoint doesn't check for Authorization headers
2. **More logging** - Added clear logs showing "PUBLIC ACCESS - NO AUTH REQUIRED"
3. **Dynamic callback URLs** - Accepts callback URL from frontend (for Figma Make compatibility)

## If It Still Doesn't Work

### Check Edge Function Logs

```bash
# Watch logs in real-time
supabase functions logs payments-simple --tail

# You should see:
🔍 [PayStack Verify] PUBLIC ACCESS - NO AUTH REQUIRED
🔍 THIS ENDPOINT DOES NOT CHECK AUTHORIZATION!
```

### Check Your Payment Reference

Make sure the URL has a valid payment reference:
```
http://localhost:5173?trxref=SUB_1767700358044_5O41GAA
```

### Verify Environment Variables

Make sure these are set in Supabase Edge Function secrets:

```bash
# Check secrets (run in your Supabase dashboard Settings > Edge Functions)
PAYSTACK_SECRET_KEY=sk_test_xxxxx
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Common Issues

### Issue: "Payment record not found"

**Cause:** The payment wasn't initialized properly (the initialize endpoint requires auth)

**Fix:**
1. Make sure you're logged in when initiating payment
2. The initialize endpoint DOES require authentication
3. Only the verify endpoint is public

### Issue: "PAYSTACK_SECRET_KEY not set"

**Cause:** Environment variable missing in Edge Function

**Fix:**
```bash
# Set the secret
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_key_here

# Then redeploy
supabase functions deploy payments-simple --no-verify-jwt
```

### Issue: Still getting 401

**Cause:** Old Edge Function version cached

**Fix:**
```bash
# Force redeploy with version bump
# Edit supabase/functions/payments-simple/index.ts
# Change: version: '6.0.0-BULLETPROOF'
# To: version: '6.0.1-BULLETPROOF'

# Then redeploy
supabase functions deploy payments-simple --no-verify-jwt
```

## How to Test Locally

If you want to test the Edge Function locally before deploying:

```bash
# Start Supabase locally
supabase start

# Serve the function locally
supabase functions serve payments-simple --env-file ./supabase/.env.local

# In another terminal, test the verify endpoint:
curl http://localhost:54321/functions/v1/payments-simple/paystack/verify/TEST_REF_123

# Should return: {"success": false, "error": "Payment record not found..."}
# (This is expected if TEST_REF_123 doesn't exist)
# The important part is it doesn't return 401!
```

## Payment Flow Diagram

```
┌─────────────┐
│   User      │
│  Clicks     │
│   "Pay"     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Frontend calls      │
│ initializePayment() │ ← Requires Auth
│ (with auth token)   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Edge Function       │
│ /paystack/initialize│ ← Checks Auth
│ Creates payment     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Redirect to         │
│ Paystack website    │
│ User enters card    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Paystack redirects  │
│ back to app with    │
│ ?trxref=XXX         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Frontend calls      │
│ verifyPayment()     │ ← NO AUTH REQUIRED! ✅
│ (public endpoint)   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Edge Function       │
│ /paystack/verify/XX │ ← NO Auth Check ✅
│ Verifies payment    │
│ Creates subscription│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Redirect to         │
│ Dashboard with      │
│ active subscription │
└─────────────────────┘
```

## Key Points

1. **Initialize** endpoint = Requires Auth (user must be logged in)
2. **Verify** endpoint = NO Auth (public, because Paystack redirects here)
3. **Webhook** endpoint = NO Auth (but checks signature)

The 401 error means the verify endpoint is incorrectly checking for auth. The fix is to redeploy the Edge Function.

## After Deployment

You should see these logs when testing:

```
🔵 NEW REQUEST: GET /functions/v1/payments-simple/paystack/verify/SUB_XXX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 [PayStack Verify] PUBLIC ACCESS - NO AUTH REQUIRED
🔍 THIS ENDPOINT DOES NOT CHECK AUTHORIZATION!
🔍 Reference: SUB_1767700358044_5O41GAA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Starting verification with retry logic...
```

If you see this, the fix is working! 🎉

## Need More Help?

Run these commands to get diagnostic info:

```bash
# Check if Edge Function is deployed
supabase functions list

# Check Edge Function logs
supabase functions logs payments-simple --tail

# Check if you're linked to the right project
supabase projects list

# Check Edge Function URL
echo "Your Edge Function URL:"
echo "https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple"
```

The Edge Function should now work properly for payment verification! 🚀
