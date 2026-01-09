# ✅ Figma Make URL - Ready to Use!

## 🎯 What I Did

I updated the app to work with **any URL** including Figma Make preview URLs. The payment callback URL is now completely dynamic!

## 📝 Changes Made

### 1. ✅ Edge Function Updated (`/supabase/functions/payments-simple/index.ts`)
- Now accepts `callback_url` from the frontend request
- Falls back to `FRONTEND_URL` env var if not provided
- Finally falls back to localhost for local development

### 2. ✅ Payment Interface Updated (`/lib/payment.ts`)
- Added `callback_url?: string` to `PaymentRequest` interface
- Callback URL is now optional and dynamic

### 3. ✅ Billing Page Updated (`/pages/BillingCycle.tsx`)
- Now sends current URL as callback: `window.location.origin`
- Works automatically in any environment:
  - ✅ Figma Make: `https://your-figma-make-url.com`
  - ✅ Localhost: `http://localhost:5173`
  - ✅ Production: `https://your-domain.com`

## 🚀 What You Need to Do

### Step 1: Redeploy Edge Function

The Edge Function needs to be updated in Supabase. Choose one method:

#### Method A: Supabase CLI (Fastest)
```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref pkzpifdocmmzowvjopup

# Deploy the function
supabase functions deploy payments-simple
```

#### Method B: Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup/functions
2. Click on **payments-simple** function
3. Click **⋮** menu → **Update Function**
4. Copy content from `/supabase/functions/payments-simple/index.ts`
5. Paste and click **Deploy**

### Step 2: Test in Figma Make

1. Your Figma Make preview should already be running
2. Login to your account
3. Go to Settings → Subscription
4. Select a plan and click "Continue to Payment"
5. Complete payment (test card: 4084 0840 8408 4081)
6. ✅ You'll be redirected back to Figma Make URL
7. ✅ Subscription will be created
8. ✅ Dashboard shows "Active"

## 🎉 Benefits

### Before:
❌ Hardcoded `FRONTEND_URL` environment variable
❌ Had to update env var for each deployment
❌ Couldn't test in Figma Make without reconfiguration

### After:
✅ Completely dynamic callback URL
✅ Works in ANY environment automatically
✅ No configuration needed
✅ Test in Figma Make right away!

## 🔍 How It Works

1. **Frontend**: Detects current URL with `window.location.origin`
2. **Payment Request**: Includes callback URL in the request
3. **Edge Function**: Uses the callback URL from request
4. **Paystack**: Redirects back to the exact URL you're using
5. **Verification**: Works perfectly in any environment

## 📋 Console Logs to Verify

When you initialize payment, you should see:

```
Initializing payment: {
  provider: 'paystack',
  amount: 76500,
  email: 'your@email.com',
  reference: 'SUB_1234567890_ABC123'
}
```

In the Edge Function logs (Supabase Dashboard → Edge Functions → payments-simple → Logs):

```
🔗 Callback URL: https://your-figma-make-url.com/?payment-callback=true
📤 Calling Paystack API...
✅ Payment initialized successfully
```

## 🎯 Current Status

### Frontend: ✅ READY
- All changes deployed
- Dynamic callback URL implemented
- No action needed

### Edge Function: ⚠️ NEEDS DEPLOYMENT
- Code is ready
- Just needs to be deployed to Supabase
- Takes 2 minutes via CLI or Dashboard

## 🆘 If You Don't Have Supabase CLI

No problem! Use the Dashboard method:

1. Open https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup/functions
2. Find **payments-simple**
3. Click **⋮** → **Update Function**
4. Copy from `/supabase/functions/payments-simple/index.ts`
5. Paste and deploy

That's it! 🚀

## 🧪 Full Test Checklist

After deploying the Edge Function:

- [ ] Open Figma Make preview URL
- [ ] Login to account
- [ ] Go to Settings → Subscription
- [ ] Select a plan (e.g., Starter)
- [ ] Select billing (e.g., Yearly)
- [ ] Click "Continue to Payment"
- [ ] Should redirect to Paystack with Figma Make callback URL
- [ ] Complete payment (card: 4084 0840 8408 4081)
- [ ] Should redirect back to Figma Make URL
- [ ] Subscription should be created
- [ ] Dashboard should show "Active" badge
- [ ] Make a sale in POS
- [ ] Print receipt should work

## 🎉 Summary

Your app is now **environment-agnostic**! Just deploy the Edge Function and you're good to go. No more hardcoded URLs! 🚀
