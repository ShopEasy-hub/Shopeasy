# 🔍 DIAGNOSE: Payment Callback Not Working

## ❌ PROBLEM

Previously: Redirected to verification page but failed  
Now: Verification page doesn't open at all - stuck at Paystack success screen

---

## 🎯 WHAT SHOULD HAPPEN

After successful payment in Paystack:

```
1. Paystack shows "Payment Successful" ✅
2. Paystack redirects to:
   https://your-app.vercel.app?payment-callback=true&reference=SUB_xxx
3. App detects payment-callback=true in URL
4. App shows PaymentCallback page
5. PaymentCallback shows "Verifying Payment..."
6. Calls verification API
7. Shows success or error
```

---

## 🔍 DIAGNOSTIC STEPS

### **STEP 1: Check What URL Paystack is Redirecting To**

**After payment succeeds but before it redirects:**

1. **Look at the browser URL bar**
2. **What URL does it try to go to?**

**Expected:**
```
https://your-app.vercel.app?payment-callback=true&reference=SUB_1735689123456_ABC123
```

**If you see:**
```
http://localhost:3000?payment-callback=true&reference=SUB_xxx
```
→ `FRONTEND_URL` is not set! (See Fix 1 below)

**If redirected but page is blank:**
→ URL might be correct but app not detecting it (See Fix 2 below)

---

### **STEP 2: Open Browser Console (IMPORTANT!)**

**Press F12 → Console tab**

**Look for these logs:**

```javascript
// Should see:
🔄 Payment callback received: {reference: "SUB_xxx", ...}
📦 Pending payment from storage: ...

// If you DON'T see these logs:
→ PaymentCallback component is not rendering
→ URL detection failed
```

---

### **STEP 3: Check URL Parameters**

**In browser console, type:**

```javascript
console.log(window.location.href);
console.log(window.location.search);
console.log(new URLSearchParams(window.location.search).get('payment-callback'));
console.log(new URLSearchParams(window.location.search).get('reference'));
```

**Expected output:**
```
https://your-app.vercel.app?payment-callback=true&reference=SUB_xxx
?payment-callback=true&reference=SUB_xxx
true
SUB_xxx
```

**If you see `null` for payment-callback or reference:**
→ URL format is wrong or parameters missing

---

### **STEP 4: Check Current Page State**

**In browser console, type:**

```javascript
// Check what page the app thinks it's on
console.log('Current page should be payment-callback');
```

**Expected:** Should be on payment-callback page

**If on different page:**
→ URL detection logic failed

---

## ⚡ FIXES BASED ON DIAGNOSIS

### **FIX 1: FRONTEND_URL Not Set**

**Symptom:** Redirects to `http://localhost:3000`

**Solution:**

```
Supabase → Settings → Edge Functions → Secrets

Add:
  FRONTEND_URL = https://your-app.vercel.app

Then redeploy:
  npx supabase functions deploy payments-simple
```

---

### **FIX 2: URL Format Wrong**

**Symptom:** URL doesn't have `?payment-callback=true`

**Possible causes:**
1. Edge Function not using correct callback URL
2. Paystack overriding callback URL
3. URL getting stripped somewhere

**Solution:**

Check Edge Function is deployed with correct code:

```bash
# Redeploy to ensure latest code
npx supabase functions deploy payments-simple

# Check function logs
npx supabase functions logs payments-simple
```

---

### **FIX 3: Session Expired**

**Symptom:** Redirects but shows login page

**Cause:** User session expired during payment

**Solution:**

The app should handle this. Check if you're logged in:

```javascript
// In browser console
console.log('Logged in?', await fetch('/api/session'));
```

**If logged out:**
1. Login again
2. Try payment again
3. Don't wait too long at Paystack screen

---

### **FIX 4: CORS/Security Issue**

**Symptom:** Console shows CORS error or security error

**Solution:**

Check browser console for errors. If you see:
- CORS error → Edge Function needs CORS headers
- Mixed content → Using http instead of https

---

## 🔧 MANUAL TEST OF CALLBACK URL

**Try this to test if callback detection works:**

### **Method 1: Manual URL**

1. **Open your app:** `https://your-app.vercel.app`
2. **Login first**
3. **Then manually go to:**
   ```
   https://your-app.vercel.app?payment-callback=true&reference=SUB_TEST_123
   ```
4. **Expected:** Should show "Verifying Payment..." page
5. **Then:** Will fail verification (test reference) but proves routing works

---

### **Method 2: Browser Console**

```javascript
// Manually trigger navigation
window.location.href = '/?payment-callback=true&reference=SUB_TEST_123';
```

**Expected:** Should navigate to payment callback page

---

## 🎯 CHECK EDGE FUNCTION CALLBACK URL

**See what callback URL the Edge Function is sending to Paystack:**

### **Method 1: Check Paystack Dashboard**

```
1. Go to: https://dashboard.paystack.com/
2. Switch to: TEST mode
3. Click: Transactions
4. Find: Your recent payment
5. Look for: Callback URL or Redirect URL
6. Should be: https://your-app.vercel.app?payment-callback=true&reference=SUB_xxx
```

**If it shows `http://localhost:3000`:**
→ `FRONTEND_URL` not set in Supabase!

---

### **Method 2: Check Edge Function Logs**

```bash
npx supabase functions logs payments-simple

# Look for the initialization request
# Should see callback_url being sent to Paystack
```

---

## 📊 COMPARISON: BEFORE vs NOW

### **Before (Was Working-ish):**

```
1. Payment succeeds ✅
2. Redirects to callback URL ✅
3. Verification page shows ✅
4. Verification fails ❌
```

**This meant:**
- Callback URL was correct
- App was detecting the callback
- But verification API had issues

---

### **Now (Not Working):**

```
1. Payment succeeds ✅
2. Stuck at Paystack success screen ❌
3. Doesn't redirect at all
```

**This means:**
- **Callback URL is wrong or missing**
- **Most likely: `FRONTEND_URL` not set**

---

## ⚡ MOST LIKELY CAUSE

**You probably haven't added `FRONTEND_URL` to Supabase secrets yet!**

**Quick fix:**

```
1. Supabase Dashboard
   → Settings → Edge Functions → Secrets
   
2. Add secret:
   Name: FRONTEND_URL
   Value: https://your-actual-vercel-url.vercel.app

3. Redeploy:
   npx supabase functions deploy payments-simple

4. Try payment again
```

---

## 🧪 STEP-BY-STEP TESTING

### **Test 1: Check Secrets Are Set**

```
Supabase → Settings → Edge Functions → Secrets

Should see:
✅ PAYSTACK_SECRET_KEY
✅ FRONTEND_URL

If FRONTEND_URL is missing → Add it!
```

---

### **Test 2: Check Function is Deployed**

```bash
npx supabase functions list

# Should show:
# payments-simple
```

---

### **Test 3: Check API Endpoint**

```
https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple

# Should return:
# {"status":"ok",...}
```

---

### **Test 4: Try Payment**

```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Login again
4. Try payment with test card
5. Watch what happens
```

---

### **Test 5: Check Console Logs**

**F12 → Console tab**

**Look for:**
- Payment initialization logs
- Callback detection logs
- Any errors in red

---

## 📋 DIAGNOSTIC CHECKLIST

**Check each of these:**

### **Supabase Setup:**
- [ ] `FRONTEND_URL` secret exists
- [ ] Value is: `https://your-app.vercel.app` (NO slash at end)
- [ ] `PAYSTACK_SECRET_KEY` secret exists
- [ ] Value is: `sk_test_xxxxx` (test mode)
- [ ] Function deployed: `payments-simple`
- [ ] API endpoint returns `{"status":"ok"}`

### **During Payment:**
- [ ] Click Subscribe → Popup opens
- [ ] Enter test card → Payment processes
- [ ] Paystack shows success
- [ ] **Check URL it tries to redirect to**
- [ ] Expected: `https://your-app.vercel.app?payment-callback=true&reference=SUB_xxx`
- [ ] If localhost → `FRONTEND_URL` not set!

### **After Redirect:**
- [ ] **F12 → Console tab**
- [ ] Look for: `🔄 Payment callback received`
- [ ] If missing → Callback page not rendering
- [ ] Check: What page am I on?
- [ ] Expected: payment-callback page

### **Verification:**
- [ ] Shows "Verifying Payment..." spinner
- [ ] Calls verification API
- [ ] Shows success or error message

---

## 🎯 MOST COMMON ISSUE

**90% of the time, it's this:**

```
FRONTEND_URL is not set in Supabase Edge Function secrets!
```

**Fix:**

```bash
# 1. Add the secret
Supabase → Settings → Edge Functions → Secrets
  → FRONTEND_URL = https://your-app.vercel.app

# 2. Redeploy
npx supabase functions deploy payments-simple

# 3. Test payment again
# ✅ Should work!
```

---

## 📞 WHAT TO CHECK RIGHT NOW

**Open TWO browser tabs:**

### **Tab 1: Paystack Dashboard**
```
https://dashboard.paystack.com/ (TEST mode)
  → Transactions
    → Your latest payment
      → Look at callback URL
        → Should be: https://your-app.vercel.app?payment-callback=true...
        → If localhost: FRONTEND_URL not set!
```

### **Tab 2: Supabase Dashboard**
```
https://supabase.com/dashboard
  → Your project
    → Settings → Edge Functions → Secrets
      → Check: FRONTEND_URL exists?
        → If NO: Add it now!
        → If YES: Check the value is correct
```

---

## ✅ AFTER FIXING

**You should see:**

```
1. Payment succeeds in Paystack ✅
2. Redirects to: https://your-app.vercel.app?payment-callback=true&reference=SUB_xxx ✅
3. URL changes in browser ✅
4. App shows "Verifying Payment..." ✅
5. Console shows: 🔄 Payment callback received ✅
6. Verification happens ✅
7. Shows success or error ✅
```

---

## 🎉 SUMMARY

**The most likely issue:**

```
FRONTEND_URL secret is missing or wrong in Supabase!
```

**Quick fix:**

```bash
# 1. Add secret in Supabase
FRONTEND_URL = https://your-app.vercel.app

# 2. Redeploy function
npx supabase functions deploy payments-simple

# 3. Test payment
# ✅ Should redirect and verify!
```

---

**Try the diagnostic steps above and let me know what you find! 🔍**
