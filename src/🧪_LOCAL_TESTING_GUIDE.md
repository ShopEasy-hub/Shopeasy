# 🧪 LOCAL TESTING GUIDE

## ✅ How to Test Locally (Before GitHub Deploy)

Good approach! Test locally first, then deploy to production.

---

## 🔧 SETUP FOR LOCAL TESTING

### Step 1: Deploy Edge Function (Required)

**Edge Functions can't run 100% locally - they need to be deployed to Supabase.**

```bash
cd supabase
supabase functions deploy payments-simple
```

**Expected output:**
```
✅ Function payments-simple deployed successfully
```

---

### Step 2: Set Environment Variables for LOCAL

```bash
# Set FRONTEND_URL to localhost
supabase secrets set FRONTEND_URL=http://localhost:5173

# Verify it's set
supabase secrets list
```

**Should show:**
```
PAYSTACK_SECRET_KEY=sk_test_xxx
FRONTEND_URL=http://localhost:5173  ✅
```

**IMPORTANT:** Port might be different! Check your terminal when you run `npm run dev` - it will say something like:
```
  ➜  Local:   http://localhost:5173/
```

Use that exact port!

---

### Step 3: Run Frontend Locally

```bash
# In project root (not in /supabase folder)
npm install   # First time only

npm run dev
```

**Expected output:**
```
VITE v5.4.11  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Open:** http://localhost:5173

---

## 🧪 TEST PAYMENT FLOW (LOCAL)

### 1. Open Browser

- **Use Incognito mode** (Ctrl+Shift+N / Cmd+Shift+N)
- Go to: http://localhost:5173
- **Why Incognito?** Fresh session, no cached data

---

### 2. Login & Navigate to Subscription

```
Login → Settings → Subscription → Subscribe Now
Select plan → Choose billing cycle → Continue to Payment
```

---

### 3. What Should Happen

```
✅ Clicking "Continue to Payment"
   ├─ NO blank page
   ├─ Console shows: "🚀 Initializing Paystack payment..."
   ├─ Console shows: "✅ Paystack initialized successfully"
   └─ Redirects to Paystack

✅ On Paystack Page
   ├─ Use test card: 4084 0840 8408 4081
   ├─ Expiry: 12/25
   ├─ CVV: 123
   └─ Click "Pay"

✅ After Payment
   ├─ Paystack redirects to: http://localhost:5173?trxref=XXX&reference=XXX
   ├─ NO 404 error ✅
   ├─ Shows "Verifying payment..." screen
   ├─ Calls Edge Function to verify
   └─ Success message appears

✅ Background (Webhook)
   └─ Webhook fires and creates subscription
```

---

## 🔍 WATCH LOGS WHILE TESTING

### Terminal 1: Frontend Logs
```bash
npm run dev
```

Keep this open to see frontend console.

### Terminal 2: Edge Function Logs
```bash
cd supabase
supabase functions logs payments-simple --follow
```

Keep this open to see backend logs.

---

## 📋 EXPECTED LOGS

### Frontend Console (Browser F12):

```javascript
🚀 Initializing Paystack payment...
📤 Request: {...}
🔑 API Base: https://ajvbefzqcmkdpskjdkui.supabase.co/functions/v1/payments-simple
✅ Paystack initialized successfully

// After payment:
💳 Payment callback detected
🔄 Payment callback received: {reference: "SUB_xxx"}
🔍 Verifying PayStack payment (NO AUTH): SUB_xxx
📋 Response status: 200
📋 Response data: {success: true, status: "success"}
✅ Payment verified successfully!
```

### Edge Function Logs (Terminal):

```
💳 [PayStack] Initialize payment request
📤 Sending to Paystack...
✅ PayStack initialization response: {...}
✅ Payment record stored

// After payment:
🔵 Request: GET /paystack/verify/SUB_xxx
🔍 [PayStack] PUBLIC VERIFICATION (no auth): SUB_xxx
🔍 Starting verification with retry logic...
🔄 Attempt 1/3 - Calling PayStack API...
✅ Verification successful on attempt 1
📝 Updating payment status to: completed
✅ Payment status updated (subscription will be created by webhook)

// Webhook (if testing locally, might not fire):
🔔 [PayStack] Webhook received
✅ Webhook signature verified
✅ Subscription activated via webhook
```

---

## ⚠️ IMPORTANT: Webhook in Local Testing

**Webhooks WON'T work for localhost!**

Why? Paystack needs to send a POST request to your webhook URL:
```
https://ajvbefzqcmkdpskjdkui.supabase.co/functions/v1/payments-simple/paystack/webhook
```

But if you set `FRONTEND_URL=http://localhost:5173`, the webhook will still work because:
- ✅ Webhook URL is **separate** from frontend URL
- ✅ Edge Function is **deployed** to Supabase (not running locally)
- ✅ Paystack can reach the Edge Function

**So actually, webhook SHOULD work even with local frontend!** 🎉

---

## 🐛 TROUBLESHOOTING LOCAL ISSUES

### Issue #1: Blank Page After "Continue to Payment"

**Check:**
1. Open browser console (F12)
2. Look for errors

**Common causes:**
- ❌ Edge Function not deployed
- ❌ PAYSTACK_SECRET_KEY not set
- ❌ Browser blocking the redirect

**Fix:**
```bash
cd supabase
supabase secrets list  # Verify secrets are set
supabase functions deploy payments-simple  # Redeploy if needed
```

---

### Issue #2: 404 Error After Payment

**Check URL in browser:**
```
http://localhost:5173?trxref=SUB_xxx&reference=SUB_xxx
```

**If you see 404:**
- Make sure you saved `/App.tsx` with the updated code
- Restart dev server: `Ctrl+C` then `npm run dev`

---

### Issue #3: CORS Error

**Console shows:**
```
Access to fetch at 'https://xxx.supabase.co/...' has been blocked by CORS
```

**Fix:** Edge Function already has CORS headers. If you still see this:
```bash
cd supabase
supabase functions deploy payments-simple  # Redeploy
```

---

### Issue #4: "Payment gateway not configured"

**Means:** `PAYSTACK_SECRET_KEY` is not set

**Fix:**
```bash
cd supabase
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

Get your key from: https://dashboard.paystack.com/#/settings/developers

---

## ✅ SUCCESS CRITERIA (Local Testing)

Before deploying to production, verify:

- [ ] No blank page when clicking "Continue to Payment"
- [ ] Redirects to Paystack successfully
- [ ] Can complete test payment
- [ ] Redirects back to localhost (no 404)
- [ ] Shows "Verifying payment..." screen
- [ ] Verification succeeds
- [ ] Subscription appears in database
- [ ] User has active subscription
- [ ] No console errors

---

## 🎯 AFTER LOCAL TESTING SUCCEEDS

**Then deploy to production:**

```bash
# Update FRONTEND_URL for production
cd supabase
supabase secrets set FRONTEND_URL=https://your-app.vercel.app

# Push to GitHub (triggers Vercel deploy)
git add .
git commit -m "Production-ready payments"
git push
```

---

## 📊 QUICK TEST CHECKLIST

```
Step 1: Deploy Edge Function
  cd supabase
  supabase functions deploy payments-simple
  
Step 2: Set localhost URL
  supabase secrets set FRONTEND_URL=http://localhost:5173
  
Step 3: Start dev server
  cd ..
  npm run dev
  
Step 4: Open logs in separate terminal
  cd supabase
  supabase functions logs payments-simple --follow
  
Step 5: Test in Incognito browser
  - Login
  - Go to Subscription
  - Click Subscribe
  - Complete payment
  - Verify success
  
Step 6: Check both terminals for logs
  - Frontend console (F12)
  - Edge Function logs (Terminal 2)
  
✅ If all works, deploy to production!
```

---

## 💡 PRO TIP: Hot Module Replacement

Vite supports HMR (Hot Module Replacement). Changes you make to frontend code will update instantly without full page reload!

**BUT:** If you change Edge Function code, you must redeploy:
```bash
cd supabase
supabase functions deploy payments-simple
```

---

## 🔥 MOST COMMON LOCAL TESTING MISTAKE

**Forgetting to deploy Edge Function after making changes!**

```bash
# After ANY change to /supabase/functions/payments-simple/index.ts:
cd supabase
supabase functions deploy payments-simple
```

**Frontend changes** (React components, lib files): Auto-reload with HMR ✅  
**Edge Function changes**: Must manually redeploy ⚠️

---

## ✅ YOU'RE ALL SET FOR LOCAL TESTING!

Everything is configured for local testing:
- ✅ Edge Function fixed and ready to deploy
- ✅ Frontend fixed with better error handling
- ✅ Callback URL uses root URL (works with localhost)
- ✅ Query param detection (works everywhere)

**Start testing locally, and when everything works, deploy to production!** 🚀
