# 🔧 DEBUG: Callback Not Working (FRONTEND_URL is Set)

## 🎯 SITUATION

- ✅ `FRONTEND_URL` is set in Supabase
- ❌ But callback page still not opening
- ❌ Stuck at Paystack success screen

**This means something else is wrong!**

---

## 🔍 STEP-BY-STEP DEBUG

### **DEBUG 1: Verify FRONTEND_URL Value**

**Supabase Dashboard:**
```
Settings → Edge Functions → Secrets
  → Find: FRONTEND_URL
    → Click the eye icon 👁️ to reveal value
```

**What does it say?**

**MUST be:**
```
https://your-app.vercel.app
```

**Common mistakes:**
```
❌ http://localhost:3000
❌ https://your-app.vercel.app/
❌ http://your-app.vercel.app (http not https)
❌ https://your-app.vercel.app?payment-callback=true (with params)
```

**If it's wrong → Update it and redeploy!**

---

### **DEBUG 2: Check if Function Was Redeployed**

**After adding FRONTEND_URL, did you redeploy?**

```bash
npx supabase functions deploy payments-simple
```

**The secret won't take effect until you redeploy!**

**Check when function was last deployed:**
```
Supabase → Edge Functions → payments-simple
  → Look at "Last deployed" timestamp
```

**Should be AFTER you added FRONTEND_URL!**

---

### **DEBUG 3: Check Paystack Transaction Details**

**Paystack Dashboard:** https://dashboard.paystack.com/

```
1. Toggle to TEST mode
2. Transactions
3. Click on your most recent payment
4. Look for "Callback URL" or "Redirect URL"
```

**What does it say?**

**Expected:**
```
https://your-app.vercel.app?payment-callback=true&reference=SUB_xxx
```

**If it says localhost:**
- FRONTEND_URL not set correctly
- Or function not redeployed

---

### **DEBUG 4: Test the Edge Function Directly**

**Open browser console (F12) and run:**

```javascript
// Test the Edge Function
fetch('https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple')
  .then(r => r.json())
  .then(d => console.log('Function response:', d))
  .catch(e => console.error('Function error:', e));
```

**Expected:**
```json
{
  "status": "ok",
  "service": "ShopEasy Payment Service",
  "version": "2.0.0"
}
```

**If error:** Function not deployed or not accessible

---

### **DEBUG 5: Check Edge Function Logs**

**See what's actually happening:**

```bash
npx supabase functions logs payments-simple --limit 50
```

**Look for:**
- Recent initialization requests
- What callback_url was sent to Paystack
- Any errors

**Search for:** `callback_url` in the logs

---

### **DEBUG 6: Check What URL Paystack Actually Redirects To**

**During payment:**

1. After payment succeeds
2. **Before** closing Paystack popup
3. **Right-click on the page** → Inspect
4. **Network tab** → Check for redirect
5. **Or watch the browser URL bar closely**

**What URL does it try to go to?**

---

### **DEBUG 7: Test Manual Callback**

**See if the routing works at all:**

```
1. Login to your app
2. Manually go to:
   https://your-app.vercel.app?payment-callback=true&reference=SUB_TEST_123
3. Does it show "Verifying Payment..." page?
```

**If YES:** Routing works, issue is with Paystack redirect  
**If NO:** Routing is broken, issue is in App.tsx

---

### **DEBUG 8: Check Browser Console During Payment**

**F12 → Console tab**

**Clear console**

**Try payment again**

**Look for:**
- Any errors in red
- Payment initialization logs
- Callback detection logs

**What do you see?**

---

## ⚡ LIKELY ISSUES & FIXES

### **ISSUE 1: FRONTEND_URL Set Wrong**

**Symptom:** Value is localhost or has trailing slash

**Fix:**
```
Update in Supabase to:
  FRONTEND_URL = https://your-actual-vercel-url.vercel.app

Then redeploy:
  npx supabase functions deploy payments-simple
```

---

### **ISSUE 2: Function Not Redeployed**

**Symptom:** Added secret but didn't redeploy

**Fix:**
```bash
npx supabase functions deploy payments-simple

# Wait for:
# ✅ Deployed function payments-simple
```

---

### **ISSUE 3: Multiple Edge Functions**

**Symptom:** Deployed wrong function or using old function

**Check what functions exist:**
```bash
npx supabase functions list
```

**Should see:** `payments-simple`

**Also check if these exist:**
- `payments`
- `server`

**If multiple exist, delete old ones:**
```bash
npx supabase functions delete payments
npx supabase functions delete server
```

---

### **ISSUE 4: Cached Old Function**

**Symptom:** Function cached with old callback URL

**Fix:**
```bash
# Force redeploy
npx supabase functions deploy payments-simple --no-verify-jwt

# Clear browser cache
# Ctrl+Shift+Delete → Clear cache

# Try payment again
```

---

### **ISSUE 5: Session Expired**

**Symptom:** Redirects but immediately goes to login

**Fix:**
```
1. Make sure you're logged in
2. Check session is valid
3. Try payment again
4. Complete payment quickly (don't wait long)
```

---

### **ISSUE 6: CORS or Network Issue**

**Symptom:** Console shows network error

**Fix:**
```bash
# Redeploy with CORS headers
npx supabase functions deploy payments-simple
```

---

## 🔧 COMPLETE RESET

**If nothing works, do a complete reset:**

### **STEP 1: Clear Everything**

```bash
# Delete all payment-related functions
npx supabase functions delete payments-simple
npx supabase functions delete payments
npx supabase functions delete server
```

---

### **STEP 2: Redeploy Clean**

```bash
# Deploy only payments-simple
npx supabase functions deploy payments-simple
```

---

### **STEP 3: Verify Secrets**

```
Supabase → Settings → Edge Functions → Secrets

Should have:
✅ PAYSTACK_SECRET_KEY = sk_test_xxxxx
✅ FRONTEND_URL = https://your-app.vercel.app
```

---

### **STEP 4: Test**

```
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Login
4. Try payment
5. Should work!
```

---

## 📊 DETAILED DIAGNOSTICS

### **Create a Test Payment and Check Logs**

```bash
# Terminal 1: Watch logs live
npx supabase functions logs payments-simple --follow

# Terminal 2: Try payment in browser
# Watch the logs in Terminal 1
```

**Look for:**
```
Initializing payment...
callback_url: https://...
PayStack response: {...}
```

**If callback_url shows localhost:**
- FRONTEND_URL not set or not redeployed

---

### **Check Supabase Project Ref**

**Make sure you're deploying to the right project:**

```bash
# Check current project
npx supabase status

# Should show:
# Project ref: pkzpifdocmmzowvjopup
```

**If wrong project:**
```bash
# Link to correct project
npx supabase link --project-ref pkzpifdocmmzowvjopup
```

---

## 🎯 EXACT CALLBACK URL FORMAT

**The Edge Function creates this callback URL:**

```typescript
callback_url: `${frontendUrl}?payment-callback=true&reference=${reference}`
```

**Example:**
```
https://shopeasy-abc123.vercel.app?payment-callback=true&reference=SUB_1735689123456_ABC123
```

**App.tsx detects it with:**
```typescript
urlParams.get('payment-callback') === 'true'
```

**Both need to match!**

---

## 🔍 CHECK VERCEL URL

**Make sure your FRONTEND_URL matches your actual Vercel deployment:**

### **Find Your Vercel URL:**

```
1. Vercel Dashboard: https://vercel.com/dashboard
2. Click your project
3. Look at the URL at the top
4. Copy it EXACTLY
```

### **Compare with FRONTEND_URL:**

```
Supabase secret: https://shopeasy-abc123.vercel.app
Vercel actual:   https://shopeasy-abc123.vercel.app

✅ Match? Good!
❌ Don't match? Update FRONTEND_URL!
```

---

## 📋 COMPLETE CHECKLIST

**Go through each item:**

- [ ] FRONTEND_URL secret exists in Supabase
- [ ] Value is correct (checked by revealing it)
- [ ] Value has NO trailing slash
- [ ] Value uses https:// not http://
- [ ] Value matches Vercel URL exactly
- [ ] PAYSTACK_SECRET_KEY also set (sk_test_xxx)
- [ ] Function deployed: `npx supabase functions deploy payments-simple`
- [ ] Deployed AFTER adding FRONTEND_URL secret
- [ ] Function shows in list: `npx supabase functions list`
- [ ] API endpoint works (returns {"status":"ok"})
- [ ] No old functions (payments, server) interfering
- [ ] Browser cache cleared
- [ ] Logged in to app
- [ ] Tried payment with test card
- [ ] Checked browser console for errors
- [ ] Checked Paystack dashboard for callback URL

---

## 🚨 IF STILL NOT WORKING

**Try this nuclear option:**

### **1. Reveal and Copy FRONTEND_URL**

```
Supabase → Secrets → FRONTEND_URL → Click eye icon
  → Copy the value
  → Paste it here: ___________________
```

---

### **2. Reveal and Copy Your Vercel URL**

```
Vercel → Your project → Top of page
  → Copy the URL
  → Paste it here: ___________________
```

---

### **3. Compare**

**Are they EXACTLY the same?**
- Letter for letter
- No extra slash
- Same https://

**If different → That's your problem!**

---

### **4. Check Function Logs During Payment**

```bash
# Start watching logs
npx supabase functions logs payments-simple --follow

# In another window, try payment

# In logs, look for what callback_url was sent
```

---

### **5. Test With Hardcoded URL**

**Temporarily edit the Edge Function:**

Edit `/supabase/functions/payments-simple/index.ts` line 92:

```typescript
// TEMPORARY DEBUG - Replace with your actual URL
callback_url: `https://your-actual-vercel-url.vercel.app?payment-callback=true&reference=${reference}`,
```

**Deploy:**
```bash
npx supabase functions deploy payments-simple
```

**Try payment again**

**Did it work?**
- **YES** → FRONTEND_URL secret has wrong value
- **NO** → Different issue (maybe Paystack not redirecting)

**Revert the hardcode after testing!**

---

## 📞 REPORT BACK

**Please check these and report:**

1. **FRONTEND_URL value (reveal it):** `_________________`
2. **Your Vercel URL:** `_________________`
3. **Do they match exactly?** YES / NO
4. **When was function last deployed?** `_________________`
5. **After or before adding FRONTEND_URL?** AFTER / BEFORE
6. **Paystack dashboard shows callback URL as:** `_________________`
7. **Manual test (/?payment-callback=true) works?** YES / NO
8. **Browser console shows errors?** YES / NO (what errors?)
9. **Edge function logs show callback_url as:** `_________________`

---

**With this info, I can pinpoint exactly what's wrong! 🔍**
