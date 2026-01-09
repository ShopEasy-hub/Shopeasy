# 🧪 FIX PAYMENT VERIFICATION - TEST MODE

## ✅ YOU'RE RIGHT TO TEST FIRST!

**Smart approach:** Test with test keys → Verify it works → Then switch to live keys

---

## 🎯 THE FUNCTION THAT NEEDS PAYSTACK SECRETS

**Only ONE function needs the Paystack secret key:**

### **`payments-simple`**
- **Location:** `/supabase/functions/payments-simple/index.ts`
- **What it does:**
  - Initializes payments with Paystack
  - Verifies payment status
  - Creates subscriptions
- **Secrets needed:**
  - `PAYSTACK_SECRET_KEY` (for backend verification)
  - `FRONTEND_URL` (for redirects)

---

## ⚡ FIX FOR TEST MODE (2 Minutes)

### **STEP 1: Get Your TEST Keys from Paystack**

1. **Login to:** https://dashboard.paystack.com/
2. **Switch to:** TEST mode (toggle in top-right corner)
3. **Go to:** Settings → API Keys & Webhooks
4. **Copy:**
   - **Public Key:** `pk_test_xxxxx...`
   - **Secret Key:** `sk_test_xxxxx...`

⚠️ **Make sure you're in TEST mode!** (Should show "TEST" badge)

---

### **STEP 2: Add TEST Secrets to Supabase**

**Go to:** https://supabase.com/dashboard

```
1. Select your ShopEasy project
2. Click: Settings → Edge Functions
3. Scroll to: "Secrets" section
```

**Add Secret #1 (TEST SECRET KEY):**
```
Click "Add Secret"

Name:  PAYSTACK_SECRET_KEY
Value: sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx
       ↑↑↑ YOUR TEST SECRET KEY (starts with sk_test_)

Click "Add Secret"
```

**Add Secret #2 (FRONTEND URL):**
```
Click "Add Secret"

Name:  FRONTEND_URL
Value: https://your-app.vercel.app
       ↑↑↑ YOUR Vercel URL (no trailing slash!)

Click "Add Secret"
```

---

### **STEP 3: Deploy the Function**

**In terminal:**

```bash
npx supabase functions deploy payments-simple
```

**Expected output:**
```
Bundling payments-simple...
Deploying payments-simple (project ref: your-project)
✅ Deployed function payments-simple
```

---

### **STEP 4: Test Payment Flow**

1. **Go to your app:** https://your-app.vercel.app
2. **Navigate to:** Billing → Choose Plan
3. **Select any plan** and click "Subscribe"
4. **Use Paystack TEST card:**
   ```
   Card Number: 5060 6666 6666 6666 666
   Expiry Date: 12/30
   CVV: 123
   PIN: 1234 (if requested)
   OTP: 123456 (if requested)
   ```
5. **Complete payment**
6. ✅ **Should redirect to your app**
7. ✅ **Should show "Payment Successful!"**
8. ✅ **Subscription should activate**

---

## 📊 VERIFY IT'S WORKING (TEST MODE)

### **Check 1: Payment Mode Indicator**

**Bottom-right corner of your app should show:**
```
🟡 TEST MODE
```

**NOT:**
```
🔴 LIVE MODE
```

---

### **Check 2: Console Logs**

**Open browser console (F12):**
```
Should see:
💳 Payment Environment: TEST
🟡 TEST MODE - Using test cards only
```

---

### **Check 3: Paystack Dashboard**

1. **Go to:** https://dashboard.paystack.com/
2. **Make sure:** TEST mode is active (toggle in top-right)
3. **Click:** Transactions
4. **Find:** Your test transaction (reference: SUB_xxx)
5. **Status:** Should be "Success" ✅

---

### **Check 4: Full Verification Flow**

**After payment, you should see:**

```
Step 1: Redirects to verification page
URL: https://your-app.vercel.app/?payment-callback=true&reference=SUB_xxx
✅ NOT localhost!

Step 2: Shows verification spinner
"Verifying Payment"
"Please wait while we verify your payment..."

Step 3: Shows success message
"Payment Successful!" with green checkmark ✅

Step 4: Subscription details shown
Plan: starter/standard/growth/enterprise
Billing: monthly/yearly

Step 5: Dashboard unlocked
All features available ✅
```

---

## 🔧 TROUBLESHOOTING (TEST MODE)

### **Issue: "Payment Gateway Not Configured"**

**Cause:** `PAYSTACK_SECRET_KEY` not set or function not deployed

**Fix:**
```bash
# 1. Check Supabase secrets
Settings → Edge Functions → Secrets
Should see: PAYSTACK_SECRET_KEY

# 2. Redeploy function
npx supabase functions deploy payments-simple

# 3. Try payment again
```

---

### **Issue: "Failed to Verify Payment"**

**Cause:** Wrong secret key or network error

**Debug steps:**

1. **Check Supabase Edge Function logs:**
   ```
   Settings → Logs → Edge Functions
   Filter: payments-simple
   Look for errors
   ```

2. **Verify secret key format:**
   ```
   ✅ Should be: sk_test_xxxxx (starts with sk_test_)
   ❌ Not: pk_test_xxxxx (that's the public key)
   ```

3. **Check Paystack dashboard:**
   ```
   Dashboard → Transactions → Find your transaction
   Should show "Success" status
   ```

4. **Test API endpoint:**
   ```bash
   # In browser or curl
   https://your-project-id.supabase.co/functions/v1/payments-simple
   
   # Should return:
   {
     "status": "ok",
     "service": "ShopEasy Payment Service",
     "version": "2.0.0"
   }
   ```

---

### **Issue: Still Redirects to Localhost**

**Cause:** `FRONTEND_URL` not set

**Fix:**
```
1. Add FRONTEND_URL to Supabase secrets
2. Redeploy: npx supabase functions deploy payments-simple
3. Hard refresh browser (Ctrl+Shift+R)
4. Try payment again
```

---

## 📋 TEST MODE CHECKLIST

### **Paystack Dashboard:**
- [ ] Switched to TEST mode (toggle in top-right)
- [ ] Copied TEST secret key (`sk_test_xxxxx`)
- [ ] Copied TEST public key (`pk_test_xxxxx`)

### **Vercel (Frontend):**
- [ ] `VITE_PAYSTACK_PUBLIC_KEY` = `pk_test_xxxxx`
- [ ] Redeployed app (or will use test key from .env locally)

### **Supabase (Backend):**
- [ ] `PAYSTACK_SECRET_KEY` = `sk_test_xxxxx`
- [ ] `FRONTEND_URL` = `https://your-app.vercel.app`
- [ ] Function deployed: `npx supabase functions deploy payments-simple`

### **Testing:**
- [ ] App shows "🟡 TEST MODE"
- [ ] Test card: 5060 6666 6666 6666 666
- [ ] Payment completes in Paystack
- [ ] Redirects to live URL (not localhost)
- [ ] Verification succeeds ✅
- [ ] Shows "Payment Successful!"
- [ ] Subscription activates
- [ ] Dashboard unlocks

---

## ✅ AFTER TEST MODE WORKS

**Once you've verified everything works with test keys:**

1. **Test multiple scenarios:**
   - Monthly subscription
   - Yearly subscription
   - Different plans
   - Multiple payments

2. **Check database:**
   - Payments table has records
   - Subscriptions table created
   - Status is "active"

3. **Then switch to LIVE mode:**
   - Follow: `/🔐_SWITCH_TO_LIVE_PAYSTACK_KEYS.md`
   - Replace test keys with live keys
   - Same process, just different keys!

---

## 🎯 KEY DIFFERENCES: TEST vs LIVE

| Aspect | TEST Mode | LIVE Mode |
|--------|-----------|-----------|
| **Public Key** | `pk_test_xxxxx` | `pk_live_xxxxx` |
| **Secret Key** | `sk_test_xxxxx` | `sk_live_xxxxx` |
| **Mode Indicator** | 🟡 TEST MODE | 🔴 LIVE MODE |
| **Test Cards** | ✅ Work | ✅ Work |
| **Real Cards** | ❌ Don't work | ✅ Work |
| **Money Charged** | ❌ No | ✅ Yes |
| **Bank Settlement** | ❌ No | ✅ Yes |
| **Dashboard** | Test transactions | Live transactions |

---

## 💡 IMPORTANT NOTES

### **Test Cards Work in Both Modes**

Paystack test cards (5060 6666...) work in:
- ✅ TEST mode
- ✅ LIVE mode (for testing!)

So even in production with live keys, you can safely test!

---

### **Test Payments Don't Charge Money**

Even if you use live keys, test cards:
- ✅ Process successfully
- ✅ Show up in dashboard
- ❌ Don't charge real money
- ❌ Don't settle to bank

---

### **Functions That DON'T Need Secrets**

You have other edge functions that DON'T need Paystack secrets:
- `server` - Uses different payment flow (legacy)
- `payments` - Uses different payment flow (legacy)

**Only `payments-simple` needs:**
- `PAYSTACK_SECRET_KEY`
- `FRONTEND_URL`

---

## 🧪 TESTING SCENARIOS

### **Scenario 1: Successful Payment**
```
Test card: 5060 6666 6666 6666 666
Expected: Payment succeeds ✅
```

### **Scenario 2: Failed Payment**
```
Test card: 5060 6666 6666 6666 664
Expected: Payment fails ❌
```

### **Scenario 3: Insufficient Funds**
```
Test card: 5060 6666 6666 6666 665
Expected: Insufficient funds error
```

**More test cards:** https://paystack.com/docs/payments/test-payments/

---

## 🔍 CHECK EDGE FUNCTION LOGS

**To see what's happening during verification:**

```
Supabase Dashboard
  → Settings
    → Logs
      → Edge Functions
        → Filter: payments-simple
          → Look for:
            
            ✅ Success logs:
            "🔵 Request: GET /paystack/verify/SUB_xxx"
            "Payment verified successfully"
            
            ❌ Error logs:
            "Payment gateway not configured"
            "Failed to verify payment"
            "Unauthorized"
```

---

## 📞 COMMON QUESTIONS

### **Q: Do I need to deploy all functions?**

**A:** No! Only deploy `payments-simple`:
```bash
npx supabase functions deploy payments-simple
```

The other functions (`server`, `payments`) are legacy and not used for the new flow.

---

### **Q: Can I test locally?**

**A:** Yes! Add to your `.env` file:
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
```

Then:
```bash
npm run dev
```

But the Edge Function must be deployed to Supabase!

---

### **Q: What if I already have live keys set?**

**A:** Just replace them with test keys temporarily:

```
Supabase → Settings → Edge Functions → Secrets
  → Click "Delete" on PAYSTACK_SECRET_KEY
  → Click "Add Secret"
  → Name: PAYSTACK_SECRET_KEY
  → Value: sk_test_xxxxx (your TEST key)
  → Redeploy: npx supabase functions deploy payments-simple
```

---

## ✅ SUMMARY: TEST MODE SETUP

```bash
# 1. Get TEST keys from Paystack
https://dashboard.paystack.com/ (TEST mode)
  - Public: pk_test_xxxxx
  - Secret: sk_test_xxxxx

# 2. Add to Supabase Secrets:
PAYSTACK_SECRET_KEY = sk_test_xxxxx
FRONTEND_URL = https://your-app.vercel.app

# 3. Deploy function:
npx supabase functions deploy payments-simple

# 4. Test payment:
Card: 5060 6666 6666 6666 666
Expiry: 12/30
CVV: 123

# 5. Verify:
✅ Shows "Payment Successful!"
✅ Subscription activates
✅ Dashboard unlocks

# ✅ DONE! Now it works in TEST mode!
```

---

## 🚀 NEXT STEPS

**After confirming test mode works:**

1. **Test thoroughly:**
   - All plans (Starter, Standard, Growth, Enterprise)
   - Monthly and yearly billing
   - Multiple payments
   - Check database records

2. **When ready for production:**
   - Get LIVE keys from Paystack
   - Replace test keys with live keys
   - Test once more with test card
   - Launch! 🎉

---

**Related Guides:**
- Localhost redirect: `/🔥_FIX_PAYMENT_CALLBACK_LOCALHOST.md`
- Switch to live: `/🔐_SWITCH_TO_LIVE_PAYSTACK_KEYS.md`
- Summary: `/📋_PAYMENT_ISSUE_SUMMARY.md`
