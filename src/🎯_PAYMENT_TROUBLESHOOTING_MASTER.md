# 🎯 PAYMENT TROUBLESHOOTING MASTER GUIDE

**Complete guide to fix ALL payment issues in ShopEasy**

---

## 🔍 IDENTIFY YOUR ISSUE

### **Issue 1: "Failed to Fetch" Error**

**Symptoms:**
- Click "Subscribe" button
- Error: `TypeError: Failed to fetch`
- Payment popup doesn't open

**Cause:** Edge Function not deployed or not accessible

**Fix:** [`⚡_FIX_FETCH_ERROR_NOW.md`](/⚡_FIX_FETCH_ERROR_NOW.md)

**Quick Fix:**
```bash
npx supabase functions deploy payments-simple
```

---

### **Issue 2: Stuck at "Payment Successful" Screen**

**Symptoms:**
- ✅ Payment succeeds in Paystack
- ❌ Doesn't redirect back to your app
- Stuck at green checkmark screen

**Cause:** `FRONTEND_URL` not set in Supabase

**Fix:** [`⚡_FIX_STUCK_PAYSTACK_NOW.md`](/⚡_FIX_STUCK_PAYSTACK_NOW.md)

**Quick Fix:**
```
Add to Supabase Secrets:
FRONTEND_URL = https://your-app.vercel.app

Then redeploy function
```

---

### **Issue 3: "Failed to Verify Payment" Error**

**Symptoms:**
- ✅ Payment succeeds in Paystack
- ✅ Redirects back to your app
- ❌ Shows "Payment verification failed"
- ❌ Subscription doesn't activate

**Cause:** `PAYSTACK_SECRET_KEY` not set in Supabase

**Fix:** [`⚡_FIX_VERIFICATION_NOW.md`](/⚡_FIX_VERIFICATION_NOW.md)

**Quick Fix:**
```
Add to Supabase Secrets:
PAYSTACK_SECRET_KEY = sk_test_xxxxx

Then redeploy function
```

---

### **Issue 4: Redirects to Localhost**

**Symptoms:**
- Payment succeeds
- Redirects to: `http://localhost:3000/?payment-callback=true`
- Only works on your computer

**Cause:** `FRONTEND_URL` not set or set to localhost

**Fix:** Same as Issue 2

**Quick Fix:**
```
Update FRONTEND_URL to production URL
```

---

### **Issue 5: Payment Popup Doesn't Open**

**Symptoms:**
- Click "Subscribe"
- Nothing happens
- No popup opens

**Cause:** Missing Paystack public key or initialization error

**Fix:** Check browser console (F12) for errors

**Quick Fix:**
```env
# Add to .env file:
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

# Or in Vercel:
# Settings → Environment Variables
```

---

## ⚡ THE COMPLETE FIX (ALL ISSUES)

**Do this ONCE to fix everything:**

### **STEP 1: Deploy Edge Function**

```bash
npx supabase functions deploy payments-simple
```

---

### **STEP 2: Add ALL Secrets to Supabase**

**Dashboard:** Settings → Edge Functions → Secrets

```
Secret 1:
  PAYSTACK_SECRET_KEY = sk_test_xxxxxxxxxxxxxxxxxxxxx

Secret 2:
  FRONTEND_URL = https://your-app.vercel.app
```

---

### **STEP 3: Redeploy After Adding Secrets**

```bash
npx supabase functions deploy payments-simple
```

---

### **STEP 4: Add Public Key to Vercel (Frontend)**

**Vercel Dashboard:** Settings → Environment Variables

```
Name:  VITE_PAYSTACK_PUBLIC_KEY
Value: pk_test_xxxxxxxxxxxxxxxxxxxxx
```

**Then redeploy Vercel app**

---

### **STEP 5: Test End-to-End**

```
1. Go to app
2. Click "Subscribe"
3. ✅ Payment popup opens
4. Enter test card: 5060 6666 6666 6666 666
5. Complete payment
6. ✅ Paystack shows "Payment Successful"
7. ✅ Redirects to your app
8. ✅ Shows "Verifying Payment..."
9. ✅ Shows "Payment Successful!"
10. ✅ Subscription activates
```

---

## 📋 REQUIRED SECRETS CHECKLIST

### **Supabase Edge Functions (Backend):**

| Secret | Value | Where Used |
|--------|-------|------------|
| `PAYSTACK_SECRET_KEY` | `sk_test_xxxxx` | Verify payments with Paystack API |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Redirect after payment |

**Add at:** Supabase → Settings → Edge Functions → Secrets

---

### **Vercel (Frontend):**

| Variable | Value | Where Used |
|----------|-------|------------|
| `VITE_PAYSTACK_PUBLIC_KEY` | `pk_test_xxxxx` | Initialize payment popup |

**Add at:** Vercel → Settings → Environment Variables

---

### **Local Development (.env file):**

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

**File:** `/.env` (in root of project)

---

## 🧪 TEST MODE vs LIVE MODE

### **For Testing (Use These):**

**Paystack Dashboard:** TEST mode (toggle in top-right)

```
Frontend (Vercel):
  VITE_PAYSTACK_PUBLIC_KEY = pk_test_xxxxx

Backend (Supabase):
  PAYSTACK_SECRET_KEY = sk_test_xxxxx
```

**Test card:** 5060 6666 6666 6666 666

---

### **For Production (Later):**

**Paystack Dashboard:** LIVE mode

```
Frontend (Vercel):
  VITE_PAYSTACK_PUBLIC_KEY = pk_live_xxxxx

Backend (Supabase):
  PAYSTACK_SECRET_KEY = sk_live_xxxxx
```

**Real cards:** Will charge actual money!

---

## 🔧 DEBUGGING TOOLS

### **1. Check Edge Function API**

**Open in browser:**
```
https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple
```

**Expected:**
```json
{"status":"ok","service":"ShopEasy Payment Service",...}
```

**If error:** Function not deployed!

---

### **2. Check Browser Console**

```
F12 → Console tab
Look for errors in red
```

**Common errors:**
- `Failed to fetch` → Function not deployed
- `CORS error` → Function CORS issue
- `401 Unauthorized` → User not logged in
- `Payment gateway not configured` → Secrets missing

---

### **3. Check Network Tab**

```
F12 → Network tab
Try payment
Look for: payments-simple/paystack/initialize
Click on it → Response tab
```

**See actual error from API**

---

### **4. Check Edge Function Logs**

**Terminal:**
```bash
npx supabase functions logs payments-simple --follow
```

**Or Dashboard:**
```
Settings → Logs → Edge Functions → Filter: payments-simple
```

**See what's happening on the server**

---

### **5. Check Paystack Dashboard**

```
https://dashboard.paystack.com/
  → TEST mode
    → Transactions
      → Find your payment
        → See status, amount, callback URL
```

---

## 🚨 COMMON ERROR MESSAGES

| Error | Cause | Fix |
|-------|-------|-----|
| `Failed to fetch` | Function not deployed | Deploy function |
| `Payment gateway not configured` | No `PAYSTACK_SECRET_KEY` | Add secret |
| `Failed to verify payment` | Wrong secret key | Check key value |
| `Unauthorized` | User not logged in | Login again |
| `CORS error` | CORS headers missing | Redeploy function |
| Stuck at Paystack success | No `FRONTEND_URL` | Add secret |
| Redirects to localhost | Wrong `FRONTEND_URL` | Update URL |

---

## 📊 COMPLETE PAYMENT FLOW

### **Successful Flow (What Should Happen):**

```
1. User clicks "Subscribe"
   └─> Frontend calls: initializePayment()

2. initializePayment() calls Edge Function
   └─> POST /payments-simple/paystack/initialize
   └─> Sends: email, amount, reference, metadata

3. Edge Function initializes with Paystack
   └─> Uses: PAYSTACK_SECRET_KEY
   └─> Sets callback: FRONTEND_URL + ?payment-callback=true
   └─> Returns: authorization_url

4. Frontend opens Paystack popup
   └─> User sees payment form
   └─> User enters card details

5. User completes payment
   └─> Paystack processes payment
   └─> Shows "Payment Successful"

6. Paystack redirects to callback URL
   └─> https://your-app.vercel.app?payment-callback=true&reference=SUB_xxx

7. Frontend detects callback
   └─> Sees ?payment-callback=true in URL
   └─> Extracts reference from URL
   └─> Shows "Verifying Payment..." spinner

8. Frontend calls verification
   └─> GET /payments-simple/paystack/verify/{reference}

9. Edge Function verifies with Paystack
   └─> Uses: PAYSTACK_SECRET_KEY
   └─> Calls: Paystack verify API
   └─> Gets: Payment status, amount, etc.

10. Edge Function creates subscription
    └─> Inserts into subscriptions table
    └─> Sets status = 'active'
    └─> Returns success

11. Frontend shows success
    └─> "Payment Successful!" message
    └─> Green checkmark
    └─> Subscription details

12. Dashboard unlocks
    └─> All features available
    └─> User can use the app
```

---

## 🔍 WHERE THINGS CAN FAIL

### **Fail Point 1: Function Not Deployed**

**Symptom:** `Failed to fetch`

**Fix:** Deploy function

---

### **Fail Point 2: Missing Secrets**

**Symptom:** `Payment gateway not configured`

**Fix:** Add secrets

---

### **Fail Point 3: Wrong Callback URL**

**Symptom:** Stuck at Paystack success screen

**Fix:** Set `FRONTEND_URL`

---

### **Fail Point 4: Verification Fails**

**Symptom:** "Failed to verify payment"

**Fix:** Check `PAYSTACK_SECRET_KEY` is correct

---

### **Fail Point 5: User Not Logged In**

**Symptom:** `Unauthorized`

**Fix:** User needs to login first

---

## ✅ COMPLETE WORKING CHECKLIST

**Frontend (Vercel):**
- [ ] `VITE_PAYSTACK_PUBLIC_KEY` set to `pk_test_xxxxx`
- [ ] Environment variable added
- [ ] App redeployed

**Backend (Supabase):**
- [ ] Edge Function deployed
- [ ] `PAYSTACK_SECRET_KEY` secret added
- [ ] `FRONTEND_URL` secret added
- [ ] Function redeployed after adding secrets

**Testing:**
- [ ] API endpoint returns `{"status":"ok"}`
- [ ] Function shows in dashboard
- [ ] Secrets show in dashboard

**End-to-End:**
- [ ] Click Subscribe → Popup opens ✅
- [ ] Enter test card → Payment succeeds ✅
- [ ] Paystack shows success → Redirects ✅
- [ ] App shows verifying → Verification succeeds ✅
- [ ] Shows success message → Subscription activates ✅
- [ ] Dashboard unlocks → All features work ✅

---

## 🎯 QUICK COMMANDS REFERENCE

```bash
# Deploy Edge Function
npx supabase functions deploy payments-simple

# Check function is deployed
npx supabase functions list

# View function logs
npx supabase functions logs payments-simple

# View logs (live)
npx supabase functions logs payments-simple --follow

# Test API endpoint
curl https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple

# Login to Supabase CLI
npx supabase login

# Link to project
npx supabase link --project-ref pkzpifdocmmzowvjopup
```

---

## 📚 ALL GUIDE FILES

### **Quick Fixes (Start Here):**
- [`⭐_START_HERE_PAYMENT_FIX.md`](/⭐_START_HERE_PAYMENT_FIX.md) - Overview
- [`⚡_FIX_FETCH_ERROR_NOW.md`](/⚡_FIX_FETCH_ERROR_NOW.md) - Fix "Failed to fetch"
- [`⚡_FIX_STUCK_PAYSTACK_NOW.md`](/⚡_FIX_STUCK_PAYSTACK_NOW.md) - Fix stuck at success
- [`⚡_FIX_VERIFICATION_NOW.md`](/⚡_FIX_VERIFICATION_NOW.md) - Fix verification

### **Test Mode:**
- [`⚡_FIX_TEST_MODE_NOW.md`](/⚡_FIX_TEST_MODE_NOW.md) - Test mode quick setup
- [`🧪_FIX_PAYMENT_TEST_MODE.md`](/🧪_FIX_PAYMENT_TEST_MODE.md) - Complete test guide

### **Detailed Guides:**
- [`🚨_FIX_FAILED_TO_FETCH_ERROR.md`](/🚨_FIX_FAILED_TO_FETCH_ERROR.md) - Complete fetch error guide
- [`🔥_FIX_STUCK_AT_PAYSTACK_SUCCESS.md`](/🔥_FIX_STUCK_AT_PAYSTACK_SUCCESS.md) - Complete stuck guide
- [`🚨_FIX_PAYMENT_VERIFICATION_FAILING.md`](/🚨_FIX_PAYMENT_VERIFICATION_FAILING.md) - Complete verification guide

### **Reference:**
- [`📋_PAYMENT_ISSUE_SUMMARY.md`](/📋_PAYMENT_ISSUE_SUMMARY.md) - All issues explained
- [`🎯_PAYMENT_TROUBLESHOOTING_MASTER.md`](/🎯_PAYMENT_TROUBLESHOOTING_MASTER.md) - This file!

---

## 🎉 YOU'RE DONE WHEN...

**All these work:**

```
✅ Click Subscribe → Popup opens
✅ Enter test card → Payment processes
✅ Paystack shows success → Automatically redirects
✅ App shows verifying → Completes quickly
✅ Shows success message → Green checkmark appears
✅ Subscription activates → Status is "active"
✅ Dashboard unlocks → All features available
✅ No errors in console → Clean logs
✅ Can make multiple payments → All succeed
✅ Database records created → Payments + Subscriptions tables
```

---

## 💡 FINAL TIPS

1. **Always test in TEST mode first** - Use `sk_test_` keys
2. **Check secrets are set** - Both `PAYSTACK_SECRET_KEY` and `FRONTEND_URL`
3. **Redeploy after adding secrets** - Required!
4. **Use browser console** - F12 shows helpful errors
5. **Check Edge Function logs** - See what's happening server-side
6. **Test card is safe** - Won't charge money even in live mode
7. **Hard refresh after changes** - Ctrl+Shift+R
8. **Check Paystack dashboard** - Verify payments are showing up
9. **One step at a time** - Fix issues in order
10. **Keep guides handy** - Bookmark this file!

---

**Good luck! Follow the guides and your payments will work! 🚀**
