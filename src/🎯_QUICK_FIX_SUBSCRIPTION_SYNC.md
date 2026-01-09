# 🎯 Quick Fix: Subscription Not Showing After Payment

## Problem
✗ Payment verifies successfully  
✗ Subscription created in database  
✗ But Admin Panel still shows "TRIAL" with 24 days instead of yearly subscription  

## Root Cause
The edge function was only updating the `subscriptions` table, NOT the `organizations` table. The Admin Panel reads from `organizations.subscription_status` and `organizations.subscription_end_date`.

## Solution Applied
✅ Edge function now updates BOTH tables  
✅ PaymentVerification fetches fresh org data  
✅ Wrapped org update in try-catch (non-blocking)  

## Deploy Now

```bash
# Single command to fix everything
npx supabase functions deploy payments-simple --no-verify-jwt
```

**That's it!** The `--no-verify-jwt` flag is required.

## Test the Fix

1. Make a test payment with Paystack test card:
   - Card: `4084 0840 8408 4081`
   - CVV: `408`
   - OTP: `123456`

2. After payment, check Admin Panel - should show:
   - Badge: **ACTIVE** (not TRIAL)
   - Days remaining: **~365 days** (for yearly)
   - Plan: Your selected plan

## Check Logs

```bash
npx supabase functions logs payments-simple --follow
```

Look for:
```
✅ Subscription created successfully!
✅ Organization updated with subscription data!
```

## If You Already Paid (Before This Fix)

Run this SQL to manually sync your organization:

```sql
-- Check your subscription in subscriptions table
SELECT * FROM subscriptions WHERE organization_id IN (
  SELECT id FROM organizations WHERE owner_id = auth.uid()
);

-- If subscription exists, update organizations table to match
UPDATE organizations o
SET 
  subscription_status = s.status,
  subscription_plan = s.plan_id,
  subscription_end_date = s.end_date,
  trial_start_date = NULL
FROM subscriptions s
WHERE o.id = s.organization_id
  AND o.owner_id = auth.uid();
```

## Verify in Database

```sql
SELECT 
  name,
  subscription_status,
  subscription_plan,
  subscription_end_date::date as expires_on,
  EXTRACT(DAY FROM (subscription_end_date - NOW())) as days_remaining
FROM organizations 
WHERE owner_id = auth.uid();
```

Expected: `subscription_status = 'active'`, `days_remaining ≈ 365`

## Still Having Issues?

1. **Clear browser cache** and hard refresh (Ctrl+Shift+R)
2. **Log out and log back in**
3. **Check edge function deployed**: `npx supabase functions list`
4. **Check for errors**: `npx supabase functions logs payments-simple`

---

**Files Modified:**
- `/supabase/functions/payments-simple/index.ts` - Added org table update
- `/pages/PaymentVerification.tsx` - Added fresh data fetch

**Deploy Command:** `npx supabase functions deploy payments-simple --no-verify-jwt`
