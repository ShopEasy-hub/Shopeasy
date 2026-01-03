# ⚡ CHECK THIS RIGHT NOW

## 🔍 QUICK DIAGNOSIS (30 seconds)

### **Check 1: Is FRONTEND_URL Set?**

**Supabase Dashboard:** https://supabase.com/dashboard

```
Settings → Edge Functions → Secrets

Do you see:
✅ FRONTEND_URL

If NO → That's your problem! Add it now:
  Name: FRONTEND_URL
  Value: https://your-app.vercel.app
```

---

### **Check 2: What URL Did Paystack Use?**

**Paystack Dashboard:** https://dashboard.paystack.com/

```
TEST mode → Transactions → Latest payment

Look at the callback URL

Should be: https://your-app.vercel.app?payment-callback=true&reference=SUB_xxx

If it shows: http://localhost:3000
→ FRONTEND_URL is not set!
```

---

## ⚡ THE FIX (1 Minute)

```
1. Supabase Dashboard
   → Settings → Edge Functions → Secrets
   → Add: FRONTEND_URL = https://your-app.vercel.app

2. Terminal
   → npx supabase functions deploy payments-simple

3. Try payment again
   → Should work!
```

---

## 🎯 WHY IT BROKE

**Before:** You might have had FRONTEND_URL set locally or it was working by chance

**Now:** Something changed and FRONTEND_URL is missing

**Result:** Paystack tries to redirect to localhost which doesn't work

---

## 📋 BOTH SECRETS REQUIRED

**You need BOTH of these in Supabase:**

```
✅ PAYSTACK_SECRET_KEY = sk_test_xxxxx
✅ FRONTEND_URL = https://your-app.vercel.app
```

**Without FRONTEND_URL:**
- Can't redirect back to your app
- Stuck at Paystack success screen

---

## 🔍 TEST IT

**After adding FRONTEND_URL and redeploying:**

```
1. Try payment
2. After success, watch the URL in browser
3. Should redirect to: https://your-app.vercel.app?payment-callback=true...
4. Should show "Verifying Payment..."
```

---

**Check Supabase secrets NOW and add FRONTEND_URL if missing! ⚡**
