# 🚀 Deploy Subscription Fix - Organizations Table Update

## What Was Fixed

The subscription was being created correctly in the `subscriptions` table, but the `organizations` table wasn't being updated. This caused the Admin Panel to show the old trial status (24 days) instead of the new yearly subscription.

### Changes Made:

1. **Edge Function (`/supabase/functions/payments-simple/index.ts`):**
   - Now updates BOTH `subscriptions` AND `organizations` tables
   - Sets `subscription_status = 'active'`
   - Sets `subscription_plan` to the purchased plan
   - Sets `subscription_end_date` to correct date (1 year for yearly, 1 month for monthly)
   - Clears `trial_start_date` since it's now a paid subscription

2. **PaymentVerification Component (`/pages/PaymentVerification.tsx`):**
   - Now fetches fresh organization data from database after payment verification
   - Updates app state with complete subscription info including end date
   - Ensures UI reflects the correct subscription status immediately

## Deployment Steps

### 1. Deploy the Edge Function

```bash
# Navigate to your project directory
cd /path/to/your/project

# Deploy the updated edge function (CORRECT COMMAND!)
npx supabase functions deploy payments-simple --no-verify-jwt

# Verify deployment
npx supabase functions list
```

**Important:** The `--no-verify-jwt` flag is required because the verify endpoint doesn't require authentication (it's called after Paystack redirects).

### 2. Verify Environment Variables

Make sure these are set in your Supabase Dashboard:

- Go to: **Project Settings** → **Edge Functions** → **Environment Variables**
- Required variables:
  - `PAYSTACK_SECRET_KEY` - Your Paystack secret key
  - `SERVICE_ROLE_KEY` - Your Supabase service role key (auto-set)
  - `SUPABASE_URL` - Your Supabase project URL (auto-set)

### 3. Test the Payment Flow

1. **Sign up for a test account** (or use existing)
2. **Go to Subscription Plans**
3. **Select a plan** (e.g., Starter - Yearly)
4. **Complete payment** using Paystack test card
5. **Check Admin Panel** - should now show correct subscription and expiry date

#### Paystack Test Card Details:
```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: Any future date
OTP: 123456
```

### 4. Check the Logs

After making a test payment, check the edge function logs:

```bash
supabase functions logs payments-simple --follow
```

Look for these success messages:
```
✅ Subscription created successfully!
✅ Organization updated with subscription data!
```

### 5. Verify in Database

Run this SQL in Supabase SQL Editor to verify:

```sql
-- Check your organization's subscription
SELECT 
  o.id,
  o.name,
  o.subscription_status,
  o.subscription_plan,
  o.subscription_end_date,
  o.trial_start_date,
  s.status as sub_status,
  s.end_date as sub_end_date,
  s.billing_cycle
FROM organizations o
LEFT JOIN subscriptions s ON s.organization_id = o.id
WHERE o.owner_id = auth.uid()  -- Your current user
ORDER BY o.created_at DESC
LIMIT 1;
```

**Expected Results After Payment:**
- `subscription_status`: `'active'`
- `subscription_plan`: Your selected plan (e.g., `'starter'`)
- `subscription_end_date`: ~365 days from now (for yearly)
- `trial_start_date`: `NULL`
- `sub_status`: `'active'`
- `billing_cycle`: `'yearly'` or `'monthly'`

## Troubleshooting

### Issue: Still showing "TRIAL" in Admin Panel

**Solution:**
1. Clear browser cache and refresh
2. Log out and log back in
3. Check if edge function was deployed successfully
4. Check edge function logs for errors

### Issue: Edge function deployment fails

**Solution:**
```bash
# Make sure you're logged in to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Try deploying again
supabase functions deploy payments-simple --no-verify-jwt
```

### Issue: Organization table not updating

**Check RLS Policies:**
The edge function uses SERVICE_ROLE_KEY which bypasses RLS, so this should work. But verify:

```sql
-- Check if SERVICE_ROLE_KEY is set correctly
SELECT current_setting('request.jwt.claim.role', true);
-- Should return NULL or 'service_role' when called from edge function
```

## For Existing Subscriptions That Weren't Updated

If you made a payment BEFORE this fix, manually update your organization:

```sql
-- Find your organization
SELECT id, name, subscription_status, subscription_plan 
FROM organizations 
WHERE owner_id = auth.uid();

-- Update it (replace YOUR_ORG_ID with actual ID from above)
UPDATE organizations
SET 
  subscription_status = 'active',
  subscription_plan = 'starter',  -- or whatever plan you paid for
  subscription_end_date = NOW() + INTERVAL '1 year',  -- or '1 month' for monthly
  trial_start_date = NULL
WHERE id = 'YOUR_ORG_ID';
```

## Success Indicators

✅ Payment verification shows "Payment Successful!"  
✅ Admin Panel shows "ACTIVE" badge instead of "TRIAL"  
✅ Days remaining shows ~365 days (for yearly) instead of 24 days  
✅ Subscription plan shows your selected plan  
✅ Edge function logs show organization update success  

## Need Help?

If issues persist:

1. Check edge function logs: `supabase functions logs payments-simple`
2. Check browser console for errors
3. Verify payment in Paystack dashboard
4. Check subscriptions table in Supabase
5. Contact support with your payment reference number

---

**Last Updated:** January 6, 2026  
**Version:** 7.0.0 - Organizations Table Sync Fix