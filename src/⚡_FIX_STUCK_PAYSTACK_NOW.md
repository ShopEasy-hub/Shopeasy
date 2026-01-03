# ⚡ FIX: Stuck at Paystack Success (30 Seconds)

## ❌ PROBLEM
Payment successful but stuck at Paystack screen - doesn't redirect back to your app.

---

## ✅ THE FIX

### **Step 1: Add FRONTEND_URL (15 seconds)**

**Supabase Dashboard:** https://supabase.com/dashboard

```
Settings → Edge Functions → Secrets

Add Secret:
  Name:  FRONTEND_URL
  Value: https://your-app.vercel.app
         ↑↑↑ Your Vercel URL (NO slash at end!)
```

---

### **Step 2: Redeploy (15 seconds)**

**Terminal:**

```bash
npx supabase functions deploy payments-simple
```

---

### **Step 3: Test**

```
1. Close Paystack popup (click X)
2. Hard refresh app (Ctrl+Shift+R)
3. Try payment again
4. ✅ Should redirect to your app!
```

---

## 🎯 WHY THIS HAPPENS

**The Edge Function uses:**
```typescript
const frontendUrl = Deno.env.get('FRONTEND_URL') || 'http://localhost:3000';
```

**If `FRONTEND_URL` is not set:**
- Paystack redirects to: `http://localhost:3000` ❌
- You get stuck at success screen ❌

**After fix:**
- Paystack redirects to: `https://your-app.vercel.app?payment-callback=true` ✅
- Your app verifies and shows success ✅

---

## 📋 CHECKLIST

- [ ] Added `FRONTEND_URL` = `https://your-app.vercel.app`
- [ ] NO trailing slash
- [ ] Used `https://` not `http://`
- [ ] Redeployed function
- [ ] Tested payment
- [ ] Redirects to app ✅

---

## 🚨 COMMON MISTAKES

**❌ Wrong:**
```
https://your-app.vercel.app/  (trailing slash)
http://localhost:3000         (localhost)
http://your-app.vercel.app    (http not https)
```

**✅ Correct:**
```
https://your-app.vercel.app
```

---

## 💡 WHERE TO GET YOUR URL

**Vercel Dashboard:**
```
https://vercel.com/dashboard
  → Click your project
    → Copy URL at top
```

---

**Full guide:** `/🔥_FIX_STUCK_AT_PAYSTACK_SUCCESS.md`

**DONE! Should redirect now! 🎉**
