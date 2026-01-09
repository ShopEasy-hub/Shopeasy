# ⚡ FIX PAYMENT VERIFICATION - TEST MODE (2 Minutes)

## ✅ SMART APPROACH: Test First, Then Go Live!

---

## 🧪 QUICK FIX FOR TEST MODE

### **STEP 1: Get Your TEST Keys**

**Paystack Dashboard:** https://dashboard.paystack.com/

```
1. Switch to TEST mode (toggle in top-right)
2. Go to: Settings → API Keys & Webhooks
3. Copy:
   - Secret Key: sk_test_xxxxxxxxxxxxxxxxxxxxx
```

---

### **STEP 2: Add to Supabase**

**Supabase Dashboard:** https://supabase.com/dashboard

```
Settings → Edge Functions → Secrets

Add Secret #1:
Name:  PAYSTACK_SECRET_KEY
Value: sk_test_xxxxxxxxxxxxxxxxxxxxx
       ↑↑↑ Your TEST secret key (starts with sk_test_)

Add Secret #2:
Name:  FRONTEND_URL
Value: https://your-app.vercel.app
       ↑↑↑ Your Vercel URL (NO trailing slash!)
```

---

### **STEP 3: Deploy Function**

**Terminal:**

```bash
npx supabase functions deploy payments-simple
```

**Wait for:** `✅ Deployed function payments-simple`

---

### **STEP 4: Test Payment**

```
1. Go to your app
2. Try payment with TEST card:
   
   Card: 5060 6666 6666 6666 666
   Expiry: 12/30
   CVV: 123

3. ✅ Should show "Payment Successful!"
```

---

## ✅ VERIFY IT WORKS

**After fix:**
- ✅ App shows: 🟡 TEST MODE
- ✅ Payment verifies successfully
- ✅ Subscription activates
- ✅ Dashboard unlocks

---

## 🎯 WHICH FUNCTION NEEDS SECRETS?

**Only ONE function:** `payments-simple`

**Location:** `/supabase/functions/payments-simple/index.ts`

**Secrets needed:**
- `PAYSTACK_SECRET_KEY` → `sk_test_xxxxx` (for TEST mode)
- `FRONTEND_URL` → `https://your-app.vercel.app`

---

## 🔧 TROUBLESHOOTING

**Still failing?**

1. **Check you used SECRET key:**
   - ✅ `sk_test_xxxxx` (starts with sk_)
   - ❌ `pk_test_xxxxx` (that's public key)

2. **Check function deployed:**
   ```bash
   npx supabase functions deploy payments-simple
   ```

3. **Check URL has no slash:**
   - ✅ `https://your-app.vercel.app`
   - ❌ `https://your-app.vercel.app/`

4. **Check Edge Function logs:**
   ```
   Supabase → Settings → Logs → Edge Functions
   Filter: payments-simple
   ```

---

## 📋 QUICK CHECKLIST

- [ ] Got TEST secret key from Paystack (`sk_test_xxxxx`)
- [ ] Added `PAYSTACK_SECRET_KEY` to Supabase secrets
- [ ] Added `FRONTEND_URL` to Supabase secrets
- [ ] Deployed: `npx supabase functions deploy payments-simple`
- [ ] Tested with card: 5060 6666 6666 6666 666
- [ ] Verification successful ✅
- [ ] Subscription activated ✅

---

## 🚀 AFTER TEST MODE WORKS

**When everything works with test keys:**

1. Test all scenarios (monthly, yearly, different plans)
2. Verify database records are created
3. Then switch to LIVE keys (guide: `/🔐_SWITCH_TO_LIVE_PAYSTACK_KEYS.md`)

---

**Full guide:** `/🧪_FIX_PAYMENT_TEST_MODE.md`

**DONE! Test mode should work now! 🎉**
