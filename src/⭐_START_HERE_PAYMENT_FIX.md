# ⭐ START HERE - Payment Verification Fix

## 🎯 WHAT'S HAPPENING

You're experiencing payment verification failure:
- ✅ Payment succeeds in Paystack
- ❌ App shows "Payment Failed"
- ❌ Stuck at "Verifying Payment..." screen

---

## 📍 YOU'RE IN THE RIGHT PLACE!

**You're absolutely correct:**
1. ✅ Test with TEST keys first (`sk_test_xxxxx`)
2. ✅ Verify everything works
3. ✅ Then switch to LIVE keys (`sk_live_xxxxx`)

---

## ⚡ THE 2-MINUTE FIX (TEST MODE)

### **What You Need:**

From Paystack Dashboard (TEST mode):
- `sk_test_xxxxx` → Your TEST secret key

From Vercel:
- `https://your-app.vercel.app` → Your app URL

---

### **Step 1: Add to Supabase (1 min)**

**Go to:** https://supabase.com/dashboard

```
Settings → Edge Functions → Secrets

Add TWO secrets:

Secret 1:
  Name:  PAYSTACK_SECRET_KEY
  Value: sk_test_xxxxxxxxxxxxxxxxxxxxx
         ↑↑↑ Your TEST secret key

Secret 2:
  Name:  FRONTEND_URL
  Value: https://your-app.vercel.app
         ↑↑↑ Your Vercel URL (NO slash at end!)
```

---

### **Step 2: Deploy Function (30 seconds)**

**Terminal:**

```bash
npx supabase functions deploy payments-simple
```

---

### **Step 3: Test (30 seconds)**

```
1. Go to your app
2. Try payment with Paystack test card:
   
   Card: 5060 6666 6666 6666 666
   Expiry: 12/30
   CVV: 123

3. ✅ Should show "Payment Successful!"
```

---

## 🎯 WHICH FUNCTION NEEDS THE SECRETS?

**Only ONE function:** `payments-simple`

**It's located at:** `/supabase/functions/payments-simple/index.ts`

**It needs:**
- `PAYSTACK_SECRET_KEY` → To verify payments with Paystack
- `FRONTEND_URL` → To redirect back to your app

---

## ✅ AFTER IT WORKS

**When test mode is working:**

1. ✅ Test thoroughly (all plans, monthly/yearly)
2. ✅ Verify database records are created
3. ✅ Check Paystack dashboard shows transactions
4. 🚀 Then switch to LIVE keys (guide: `/🔐_SWITCH_TO_LIVE_PAYSTACK_KEYS.md`)

---

## 📚 DETAILED GUIDES

**Quick Start (2 min):**
- `/⚡_FIX_TEST_MODE_NOW.md` → Quick test mode fix

**Complete Guide (10 min):**
- `/🧪_FIX_PAYMENT_TEST_MODE.md` → Full test mode setup

**All Issues Explained:**
- `/📋_PAYMENT_ISSUE_SUMMARY.md` → Complete overview

**Switch to Live:**
- `/🔐_SWITCH_TO_LIVE_PAYSTACK_KEYS.md` → When ready for production

---

## 🚨 COMMON MISTAKES TO AVOID

### **❌ Using Public Key Instead of Secret Key**

**Wrong:**
```
PAYSTACK_SECRET_KEY = pk_test_xxxxx
                      ↑↑ This is PUBLIC key!
```

**Correct:**
```
PAYSTACK_SECRET_KEY = sk_test_xxxxx
                      ↑↑ SECRET key starts with sk_
```

---

### **❌ Adding Trailing Slash to URL**

**Wrong:**
```
FRONTEND_URL = https://your-app.vercel.app/
                                        ↑ Don't add this!
```

**Correct:**
```
FRONTEND_URL = https://your-app.vercel.app
```

---

### **❌ Forgetting to Deploy**

After adding secrets, you **MUST** deploy:

```bash
npx supabase functions deploy payments-simple
```

Without deploying, the function won't see the new secrets!

---

## 🔧 IF IT STILL DOESN'T WORK

### **Check 1: Secrets Are Set**

```
Supabase → Settings → Edge Functions → Secrets

Should see:
✅ PAYSTACK_SECRET_KEY (hidden)
✅ FRONTEND_URL (hidden)
```

---

### **Check 2: Function Deployed**

```bash
npx supabase functions list

# Should show:
# payments-simple
```

---

### **Check 3: Using Secret Key Not Public Key**

**Your secret key should start with:**
- ✅ `sk_test_` for test mode
- ✅ `sk_live_` for live mode
- ❌ NOT `pk_test_` or `pk_live_` (those are public keys)

---

### **Check 4: Edge Function Logs**

```
Supabase Dashboard
  → Settings
    → Logs
      → Edge Functions
        → Filter: payments-simple

Look for errors!
```

---

## 💡 KEY FACTS

1. **Only 1 function needs secrets:** `payments-simple`
2. **Need 2 secrets:** PAYSTACK_SECRET_KEY + FRONTEND_URL
3. **Secret key ≠ Public key:** Use `sk_test_` not `pk_test_`
4. **Must redeploy after adding secrets**
5. **Test cards don't charge money** (even in live mode!)

---

## 📋 QUICK CHECKLIST

- [ ] Got `sk_test_xxxxx` from Paystack (TEST mode)
- [ ] Added `PAYSTACK_SECRET_KEY` to Supabase secrets
- [ ] Added `FRONTEND_URL` to Supabase secrets
- [ ] Deployed: `npx supabase functions deploy payments-simple`
- [ ] Tested with card: 5060 6666 6666 6666 666
- [ ] Verification succeeded ✅
- [ ] Subscription activated ✅

---

## 🎉 NEXT STEPS

**After test mode works:**

1. **Test thoroughly:**
   - Try all subscription plans
   - Test monthly and yearly billing
   - Verify multiple payments
   - Check database records

2. **When satisfied:**
   - Get LIVE keys from Paystack
   - Follow: `/🔐_SWITCH_TO_LIVE_PAYSTACK_KEYS.md`
   - Replace test keys with live keys
   - Launch! 🚀

---

## ⚡ QUICK REFERENCE

```bash
# Deploy function
npx supabase functions deploy payments-simple

# Check function is deployed
npx supabase functions list

# View logs
npx supabase functions logs payments-simple

# Test API
curl https://your-project-id.supabase.co/functions/v1/payments-simple
```

---

## 🎯 THE ESSENTIALS

**What to do RIGHT NOW:**

```
1. Paystack Dashboard (TEST mode)
   → Copy: sk_test_xxxxx

2. Supabase Dashboard
   → Settings → Edge Functions → Secrets
   → Add: PAYSTACK_SECRET_KEY = sk_test_xxxxx
   → Add: FRONTEND_URL = https://your-app.vercel.app

3. Terminal
   → Run: npx supabase functions deploy payments-simple

4. Test
   → Use card: 5060 6666 6666 6666 666
   → Should work! ✅
```

---

**That's it! Follow the steps above and you're done! 🎉**

**Need more details? Check:** `/⚡_FIX_TEST_MODE_NOW.md`
