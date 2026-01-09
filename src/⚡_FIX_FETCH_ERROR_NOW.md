# ⚡ FIX "Failed to Fetch" Error NOW (1 Minute)

## ❌ ERROR
```
PayStack initialization error: TypeError: Failed to fetch
```

---

## ✅ THE FIX

### **Step 1: Deploy Function (30 seconds)**

**Terminal:**

```bash
npx supabase functions deploy payments-simple
```

**Wait for:** `✅ Deployed function payments-simple`

---

### **Step 2: Add Secrets (30 seconds)**

**Supabase Dashboard:** https://supabase.com/dashboard

```
Settings → Edge Functions → Secrets

Add TWO secrets:

Secret 1:
  PAYSTACK_SECRET_KEY = sk_test_xxxxxxxxxxxxxxxxxxxxx

Secret 2:
  FRONTEND_URL = https://your-app.vercel.app
```

---

### **Step 3: Redeploy (15 seconds)**

**Terminal:**

```bash
npx supabase functions deploy payments-simple
```

---

### **Step 4: Test (15 seconds)**

```
1. Wait 2 minutes (first deploy only)
2. Hard refresh app (Ctrl+Shift+R)
3. Try payment again
4. ✅ Should work!
```

---

## 🔍 VERIFY IT'S DEPLOYED

**Open in browser:**
```
https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple
```

**Should see:**
```json
{"status":"ok","service":"ShopEasy Payment Service",...}
```

**If you see error:** Function not deployed yet! Wait 2-5 minutes and try again.

---

## 🚨 IF STILL FAILING

### **Check 1: Function Deployed?**

```bash
npx supabase functions list

# Should show: payments-simple
```

---

### **Check 2: Secrets Added?**

```
Supabase → Settings → Edge Functions → Secrets

Should see:
✅ PAYSTACK_SECRET_KEY
✅ FRONTEND_URL
```

---

### **Check 3: Waited Long Enough?**

**First deployment takes 2-5 minutes to activate!**

Wait, then test endpoint:
```
https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple
```

---

## 📋 QUICK CHECKLIST

- [ ] Ran: `npx supabase functions deploy payments-simple`
- [ ] Saw: "✅ Deployed function"
- [ ] Added `PAYSTACK_SECRET_KEY` secret
- [ ] Added `FRONTEND_URL` secret
- [ ] Redeployed after adding secrets
- [ ] Waited 2-5 minutes (first time only)
- [ ] API endpoint returns `{"status":"ok"}`
- [ ] Hard refreshed app
- [ ] Payment works ✅

---

## 💡 MOST COMMON CAUSE

**Function not deployed!**

**Fix:**
```bash
npx supabase functions deploy payments-simple
```

---

**Full guide:** `/🚨_FIX_FAILED_TO_FETCH_ERROR.md`

**DONE! Error should be fixed! 🎉**
