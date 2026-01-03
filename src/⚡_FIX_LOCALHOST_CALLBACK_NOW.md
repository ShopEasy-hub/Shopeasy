# ⚡ FIX LOCALHOST CALLBACK - Do This NOW (2 Minutes)

## ❌ PROBLEM
Payments redirect to `http://localhost:3000` instead of your live URL

---

## ✅ SOLUTION (3 Steps)

### **STEP 1: Add FRONTEND_URL to Supabase**

**Go to:** https://supabase.com/dashboard

```
1. Select your project
2. Settings (left sidebar, bottom)
3. Edge Functions
4. Scroll to "Secrets"
5. Click "Add Secret"
6. Add:
   Name:  FRONTEND_URL
   Value: https://your-app.vercel.app
   
7. Click "Add Secret"
```

⚠️ **Replace `your-app.vercel.app` with YOUR actual Vercel URL!**

⚠️ **NO trailing slash!** 
- ✅ `https://your-app.vercel.app`
- ❌ `https://your-app.vercel.app/`

---

### **STEP 2: Redeploy Edge Function**

**In terminal:**

```bash
npx supabase functions deploy server
```

**Wait for:** `✅ Deployed function server`

---

### **STEP 3: Test Payment**

1. Go to your app
2. Try to subscribe
3. Complete payment
4. Should redirect to: `https://your-app.vercel.app/?payment-callback=true`
5. ✅ **FIXED!**

---

## 🎯 WHERE TO FIND YOUR VERCEL URL

**Vercel Dashboard:**
```
1. Go to vercel.com
2. Click your project
3. Look at top for: https://your-project.vercel.app
4. Copy that URL (without trailing /)
```

---

## ✅ VERIFICATION

**After fix, you should see:**

- ✅ Redirect to your live app (not localhost)
- ✅ URL: `https://your-app.vercel.app/?payment-callback=true`
- ✅ Subscription activates
- ✅ Dashboard unlocks

---

## 🚨 TROUBLESHOOTING

**Still showing localhost?**

1. **Check secret is added:**
   - Supabase → Settings → Edge Functions → Secrets
   - Should see: `FRONTEND_URL (hidden)`

2. **Check you redeployed:**
   ```bash
   npx supabase functions deploy server
   ```

3. **Check URL format:**
   - ✅ `https://your-app.vercel.app`
   - ❌ `https://your-app.vercel.app/` (no trailing slash!)

4. **Hard refresh browser:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

---

## 📋 QUICK CHECKLIST

- [ ] Added `FRONTEND_URL` to Supabase Secrets
- [ ] Value is: `https://your-actual-app.vercel.app` (no trailing slash)
- [ ] Ran: `npx supabase functions deploy server`
- [ ] Deployment completed successfully
- [ ] Tested payment
- [ ] Redirects to live URL ✅

---

**DONE! Problem solved! 🎉**

Full guide: `/🔥_FIX_PAYMENT_CALLBACK_LOCALHOST.md`
