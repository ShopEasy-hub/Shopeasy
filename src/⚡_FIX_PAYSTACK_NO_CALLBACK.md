# ⚡ FIX: Paystack Not Redirecting (No Callback URL Shown)

## 🎯 SITUATION

- ✅ Manual callback URL works: `https://shopeasy-lemon.vercel.app/?payment-callback=true&reference=SUB_TEST_123`
- ✅ App routing is working fine
- ❌ Real payments from Paystack don't redirect
- ❌ Paystack dashboard shows NO callback URL

**This means: The callback_url is NOT being sent to Paystack API!**

---

## 🔍 ROOT CAUSE

**The Edge Function has `FRONTEND_URL` set, but it's not being READ correctly!**

OR

**The Edge Function wasn't redeployed after adding the secret!**

---

## ⚡ THE FIX (2 Minutes)

I've just added debug logging to the Edge Function. Now let's deploy it and check the logs.

### **STEP 1: Deploy Updated Function**

```bash
npx supabase functions deploy payments-simple
```

**Wait for:**
```
✅ Deployed function payments-simple
```

---

### **STEP 2: Watch Logs in Real-Time**

**Open a terminal and run:**

```bash
npx supabase functions logs payments-simple --follow
```

**Keep this running!**

---

### **STEP 3: Try Payment**

**In your browser:**
1. Go to your app
2. Try to make a payment
3. Watch the logs in the terminal

---

### **STEP 4: Check What Logs Show**

**You should see logs like:**

```
🔍 FRONTEND_URL from env: https://shopeasy-lemon.vercel.app
🔍 Using frontendUrl: https://shopeasy-lemon.vercel.app
🔍 Callback URL will be: https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx
✅ PayStack initialization response: {...}
```

---

## 🔍 DIAGNOSE FROM LOGS

### **Case 1: FRONTEND_URL is null or undefined**

**Logs show:**
```
🔍 FRONTEND_URL from env: undefined
🔍 Using frontendUrl: http://localhost:3000
```

**Problem:** Secret not set or function can't read it!

**Fix:**
1. Go to Supabase Dashboard
2. Settings → Edge Functions → Secrets
3. Check if `FRONTEND_URL` exists
4. If not, add it: `https://shopeasy-lemon.vercel.app`
5. Redeploy: `npx supabase functions deploy payments-simple`

---

### **Case 2: FRONTEND_URL has wrong value**

**Logs show:**
```
🔍 FRONTEND_URL from env: http://localhost:3000
🔍 Using frontendUrl: http://localhost:3000
```

**Problem:** Secret has wrong value!

**Fix:**
1. Supabase Dashboard → Secrets
2. Delete FRONTEND_URL
3. Add again: `https://shopeasy-lemon.vercel.app`
4. Redeploy

---

### **Case 3: FRONTEND_URL is correct but Paystack rejects it**

**Logs show:**
```
🔍 FRONTEND_URL from env: https://shopeasy-lemon.vercel.app
🔍 Using frontendUrl: https://shopeasy-lemon.vercel.app
🔍 Callback URL will be: https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx
✅ PayStack initialization response: { status: true, ... }
```

**Problem:** Paystack might be stripping callback URL

**Check Paystack response in logs:**
- Look for `authorization_url` in the response
- Should include callback parameter

---

### **Case 4: No logs at all**

**No logs appear when you try payment**

**Problem:** Edge Function not being called!

**Fix:**
1. Check browser console for errors
2. Verify API endpoint
3. Check if using correct function

---

## 🔧 IMMEDIATE ACTIONS

### **Action 1: Verify FRONTEND_URL Secret**

```bash
# Check if secret exists (can't see value from CLI)
# Go to: https://supabase.com/dashboard

Settings → Edge Functions → Secrets

Should see:
✅ FRONTEND_URL
✅ PAYSTACK_SECRET_KEY

Click eye icon 👁️ to reveal:
FRONTEND_URL = https://shopeasy-lemon.vercel.app
```

**IMPORTANT: Must be EXACTLY:**
```
https://shopeasy-lemon.vercel.app
```

**NOT:**
```
❌ https://shopeasy-lemon.vercel.app/  (no trailing slash!)
❌ http://shopeasy-lemon.vercel.app    (must be https)
❌ http://localhost:3000
```

---

### **Action 2: Redeploy Function**

```bash
# Deploy with logging
npx supabase functions deploy payments-simple

# Verify it deployed
npx supabase functions list
```

---

### **Action 3: Test and Monitor**

```bash
# Terminal 1: Watch logs
npx supabase functions logs payments-simple --follow

# Terminal 2 or Browser: Try payment

# Watch Terminal 1 for logs
```

---

## 📊 WHAT THE LOGS WILL TELL US

### **Good Logs (Everything Working):**

```
🔵 Request: POST /paystack/initialize
🔍 FRONTEND_URL from env: https://shopeasy-lemon.vercel.app
🔍 Using frontendUrl: https://shopeasy-lemon.vercel.app
🔍 Callback URL will be: https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_1735690123456_ABC
✅ PayStack initialization response: {
  status: true,
  message: "Authorization URL created",
  data: {
    authorization_url: "https://checkout.paystack.com/...",
    access_code: "...",
    reference: "SUB_1735690123456_ABC"
  }
}
```

**This means everything is working!**

---

### **Bad Logs (FRONTEND_URL not set):**

```
🔵 Request: POST /paystack/initialize
🔍 FRONTEND_URL from env: undefined
🔍 Using frontendUrl: http://localhost:3000
🔍 Callback URL will be: http://localhost:3000?payment-callback=true&reference=SUB_1735690123456_ABC
```

**This means FRONTEND_URL secret is not set!**

---

## 🎯 COMPLETE CHECKLIST

**Go through each step:**

### **1. Set FRONTEND_URL Secret:**

- [ ] Go to: https://supabase.com/dashboard
- [ ] Navigate to: Settings → Edge Functions → Secrets
- [ ] Find: FRONTEND_URL (or add if missing)
- [ ] Click eye icon to reveal value
- [ ] Value is: `https://shopeasy-lemon.vercel.app` (exactly!)
- [ ] No trailing slash
- [ ] Uses https://

---

### **2. Deploy Function:**

- [ ] Run: `npx supabase functions deploy payments-simple`
- [ ] See: "✅ Deployed function payments-simple"
- [ ] No errors during deployment

---

### **3. Test with Logging:**

- [ ] Terminal 1: `npx supabase functions logs payments-simple --follow`
- [ ] Browser: Try payment
- [ ] See logs appear in Terminal 1
- [ ] Logs show: FRONTEND_URL = `https://shopeasy-lemon.vercel.app`
- [ ] Logs show: Callback URL = `https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx`

---

### **4. Verify Payment:**

- [ ] Payment popup opens
- [ ] Complete payment with test card
- [ ] Payment succeeds in Paystack
- [ ] Browser redirects to: `https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx`
- [ ] Shows "Verifying Payment..."
- [ ] Verification succeeds

---

## 🚨 TROUBLESHOOTING

### **Issue: FRONTEND_URL shows as undefined in logs**

**Cause:** Secret not set or function can't read it

**Fix:**
```
1. Double-check secret exists in Supabase
2. Make sure you're in the right project
3. Redeploy after adding secret
4. Wait 30 seconds and try again
```

---

### **Issue: Logs don't appear at all**

**Cause:** Function not being called

**Fix:**
```
1. Check browser console (F12) for errors
2. Verify API endpoint is correct
3. Check network tab for failed requests
4. Make sure user is logged in
```

---

### **Issue: PayStack returns error**

**Cause:** Invalid callback URL or other PayStack issue

**Fix:**
```
1. Check logs for PayStack error message
2. Verify PAYSTACK_SECRET_KEY is correct
3. Make sure using test key in test mode
```

---

## 📞 REPORT BACK

**After deploying and testing, send me:**

### **1. Edge Function Logs:**

```bash
# Copy the logs from terminal and send me
npx supabase functions logs payments-simple --limit 20
```

---

### **2. What FRONTEND_URL Shows:**

```
From Supabase Dashboard → Secrets → FRONTEND_URL (reveal it):
Value = _______________________________
```

---

### **3. What Happens:**

- [ ] Logs appear when I try payment
- [ ] FRONTEND_URL in logs = `_______________________________`
- [ ] Callback URL in logs = `_______________________________`
- [ ] PayStack response = `_______________________________`
- [ ] Browser redirects to callback URL: YES / NO
- [ ] If NO, what happens instead: `_______________________________`

---

## ✅ EXPECTED OUTCOME

**After fixing:**

1. **Logs show:**
   ```
   🔍 FRONTEND_URL from env: https://shopeasy-lemon.vercel.app
   🔍 Callback URL will be: https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx
   ```

2. **Paystack Dashboard shows:**
   - Transaction has callback URL set
   - Callback URL = `https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx`

3. **After payment:**
   - Browser redirects to your app
   - Shows "Verifying Payment..."
   - Verification succeeds
   - Subscription activates

---

## 🎉 NEXT STEPS

1. **Deploy the updated function:**
   ```bash
   npx supabase functions deploy payments-simple
   ```

2. **Watch logs:**
   ```bash
   npx supabase functions logs payments-simple --follow
   ```

3. **Try payment and watch what logs say!**

4. **Report back what you see in the logs!**

---

**The logs will tell us EXACTLY what's wrong! 🔍**
