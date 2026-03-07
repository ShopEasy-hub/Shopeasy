# Payment Fix - TL;DR

## The Problem
Edge function was trying to access deleted `kv_store_088c2cd9` table → Payment failing

## The Solution
Created a NEW dedicated payments edge function with zero KV store dependencies

## What You Need To Do (3 Steps)

### 1️⃣ Deploy the New Edge Function

**Option A - Supabase CLI (30 seconds):**
```bash
supabase login
supabase link --project-ref pkzpifdocmmzowvjopup
supabase functions deploy payments
```

**Option B - Manual (2 minutes):**
1. Copy code from `/supabase/functions/payments/index.tsx`
2. Go to https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup
3. Edge Functions → Create → Name: `payments` → Paste code → Deploy

### 2️⃣ Add API Keys

Go to: Dashboard → Settings → Edge Functions → Secrets

Add ONE of these:
- `PAYSTACK_SECRET_KEY` = Your PayStack key
- `FLUTTERWAVE_SECRET_KEY` = Your Flutterwave key

Get keys from:
- PayStack: https://dashboard.paystack.com/#/settings/developers
- Flutterwave: https://dashboard.flutterwave.com/settings/apis

### 3️⃣ Test It

Visit: `https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments`

Should see:
```json
{"status": "ok", "service": "ShopSpot Payment Service"}
```

Then try upgrading a plan in your app. No more errors! ✅

---

## Why This Works

- ❌ Old: Used `make-server-088c2cd9` function with KV store
- ✅ New: Uses `payments` function with PostgreSQL only
- ✅ Client code already updated to use new endpoint

---

## Files Changed

1. `/supabase/functions/payments/index.tsx` - NEW payment-only function
2. `/lib/payment.ts` - Updated API endpoint
3. `/supabase/migrations/ADD_PAYMENTS_TABLE.sql` - Run in SQL Editor

---

## Still Having Issues?

Read full guide: `/DEPLOY_PAYMENTS_FIX.md`

Common fixes:
- **"Payment gateway not configured"** → Add API key in Step 2
- **"Function not found"** → Deploy function in Step 1
- **Still seeing kv_store error** → Hard refresh browser (Ctrl+Shift+R)

---

**Priority:** 🔴 URGENT - Deploy now to fix payments
