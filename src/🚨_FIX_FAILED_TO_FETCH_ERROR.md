# 🚨 FIX "Failed to Fetch" Error - Payment Initialization

## ❌ THE ERROR

```
PayStack initialization error: TypeError: Failed to fetch
at initializePaystackPayment (payment.ts:103:28)
```

**What it means:** Your app can't reach the Edge Function API

---

## 🎯 ROOT CAUSES

The "Failed to fetch" error happens when:

1. ❌ **Edge Function not deployed**
2. ❌ **Edge Function not yet activated** (first deploy takes time)
3. ❌ **Wrong API endpoint URL**
4. ❌ **CORS issues**
5. ❌ **Network/connectivity issues**

---

## ⚡ COMPLETE FIX (5 Minutes)

### **STEP 1: Check if Function Exists**

**Open in browser:**
```
https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple
```

**Expected response:**
```json
{
  "status": "ok",
  "service": "ShopEasy Payment Service",
  "version": "2.0.0",
  "message": "Payments API is running (Simple version)"
}
```

**If you see error:** Function is not deployed or not accessible!

---

### **STEP 2: Deploy the Function**

**Terminal:**

```bash
# Make sure you're logged in
npx supabase login

# Deploy the function
npx supabase functions deploy payments-simple

# Expected output:
# Bundling payments-simple...
# Deploying payments-simple (project ref: pkzpifdocmmzowvjopup)
# ✅ Deployed function payments-simple
```

---

### **STEP 3: Add Required Secrets**

**Supabase Dashboard:** https://supabase.com/dashboard

```
Settings → Edge Functions → Secrets

Add TWO secrets:

Secret #1:
  Name:  PAYSTACK_SECRET_KEY
  Value: sk_test_xxxxxxxxxxxxxxxxxxxxx
         (your TEST secret key)

Secret #2:
  Name:  FRONTEND_URL
  Value: https://your-app.vercel.app
         (your Vercel URL, NO trailing slash)
```

**After adding secrets, redeploy:**
```bash
npx supabase functions deploy payments-simple
```

---

### **STEP 4: Wait for Activation (First Deploy Only)**

**If this is your FIRST time deploying Edge Functions:**

⏱️ **Wait 2-5 minutes** for the function to activate

**Then test the endpoint again:**
```
https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple
```

Should return `{"status": "ok", ...}`

---

### **STEP 5: Test Payment Again**

1. **Hard refresh your app** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Try payment again**
3. ✅ **Should work now!**

---

## 🔍 DETAILED TROUBLESHOOTING

### **Issue 1: Function Not Found (404)**

**Browser shows:**
```
Function not found
or
404 Not Found
```

**Fix:**
```bash
# Deploy the function
npx supabase functions deploy payments-simple

# Verify it's deployed
npx supabase functions list

# Should show:
# payments-simple
```

---

### **Issue 2: CORS Error**

**Console shows:**
```
Access to fetch blocked by CORS policy
```

**Cause:** Edge Function not handling CORS properly

**Check:** The `payments-simple/index.ts` already has CORS headers

**Fix:** Redeploy the function
```bash
npx supabase functions deploy payments-simple
```

---

### **Issue 3: Unauthorized (401)**

**Error shows:**
```
Unauthorized
or
401 Error
```

**Cause:** User session expired or invalid

**Fix:**
1. Logout and login again
2. Try payment again
3. Check browser console for auth errors

---

### **Issue 4: Payment Gateway Not Configured (500)**

**Error shows:**
```
Payment gateway not configured
```

**Cause:** `PAYSTACK_SECRET_KEY` not set in Supabase

**Fix:**
```
1. Supabase → Settings → Edge Functions → Secrets
2. Add: PAYSTACK_SECRET_KEY = sk_test_xxxxx
3. Redeploy: npx supabase functions deploy payments-simple
```

---

### **Issue 5: Function Still Not Working**

**Try these steps:**

#### **A. Check Supabase CLI is Installed**

```bash
npx supabase --version

# Should show version number
# If not, install:
npm install -g supabase
```

---

#### **B. Login to Supabase**

```bash
npx supabase login

# Follow prompts to authenticate
```

---

#### **C. Link to Project**

```bash
npx supabase link --project-ref pkzpifdocmmzowvjopup

# Enter your database password when prompted
```

---

#### **D. Deploy Again**

```bash
npx supabase functions deploy payments-simple

# Should see success message
```

---

#### **E. Check Function Logs**

```bash
npx supabase functions logs payments-simple

# Or in dashboard:
# Settings → Logs → Edge Functions → Filter: payments-simple
```

---

## 🧪 TEST THE API ENDPOINT

### **Method 1: Browser**

**Open in new tab:**
```
https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple
```

**Should see:**
```json
{
  "status": "ok",
  "service": "ShopEasy Payment Service",
  "version": "2.0.0",
  "message": "Payments API is running (Simple version)"
}
```

---

### **Method 2: cURL**

**Terminal:**
```bash
curl https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple

# Should return JSON with "status": "ok"
```

---

### **Method 3: Postman/Insomnia**

```
GET https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple

Expected: 200 OK with JSON response
```

---

## 📋 COMPLETE DEPLOYMENT CHECKLIST

### **Prerequisites:**
- [ ] Supabase CLI installed (`npx supabase --version`)
- [ ] Logged in to Supabase (`npx supabase login`)
- [ ] Project linked (optional but recommended)

### **Deployment:**
- [ ] Function file exists: `/supabase/functions/payments-simple/index.ts`
- [ ] Run: `npx supabase functions deploy payments-simple`
- [ ] See: "✅ Deployed function payments-simple"
- [ ] Wait 2-5 minutes (first deploy only)

### **Configuration:**
- [ ] Add `PAYSTACK_SECRET_KEY` to Supabase secrets
- [ ] Add `FRONTEND_URL` to Supabase secrets
- [ ] Redeploy after adding secrets

### **Verification:**
- [ ] API endpoint returns `{"status": "ok"}`
- [ ] Function shows in Supabase dashboard
- [ ] Function shows in `npx supabase functions list`

### **Testing:**
- [ ] Hard refresh app (Ctrl+Shift+R)
- [ ] Try payment with test card
- [ ] No "Failed to fetch" error ✅
- [ ] Payment initialization succeeds ✅

---

## 🎯 YOUR SPECIFIC API ENDPOINT

**Your app is calling:**
```
https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple/paystack/initialize
```

**Test base URL first:**
```
https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple
```

**If base URL works, full endpoint should work too!**

---

## 🔧 QUICK FIXES TO TRY

### **Fix 1: Redeploy**

```bash
npx supabase functions deploy payments-simple
```

Sometimes just redeploying fixes the issue!

---

### **Fix 2: Hard Refresh**

**Browser:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

This clears cached API errors.

---

### **Fix 3: Check Browser Console**

**F12 → Console Tab**

Look for:
- ❌ CORS errors
- ❌ 404 errors
- ❌ Network errors
- ✅ What the actual error is

---

### **Fix 4: Check Network Tab**

**F12 → Network Tab**

1. Try payment again
2. Look for request to `payments-simple`
3. Check:
   - Status code (should be 200)
   - Response (should have `success: true`)
   - Error message if failed

---

## 💡 COMMON SCENARIOS

### **Scenario 1: First Time Deploying**

**What happens:**
- Function takes 2-5 minutes to activate
- First requests might fail
- Then it starts working

**Solution:**
- Wait 5 minutes after first deploy
- Test endpoint again
- Should work!

---

### **Scenario 2: Function Deployed But No Secrets**

**What happens:**
- Endpoint returns 200 OK
- But payment initialization fails with "Payment gateway not configured"

**Solution:**
- Add secrets to Supabase
- Redeploy function
- Try again

---

### **Scenario 3: Function Deployed Yesterday**

**What happens:**
- Edge Functions can "go to sleep" if not used
- First request wakes them up (might be slow/fail)
- Subsequent requests work fine

**Solution:**
- Try payment 2-3 times
- Or wait 30 seconds and try again
- Should work after "waking up"

---

## 🎯 STEP-BY-STEP: COMPLETE FRESH SETUP

**If nothing else works, start from scratch:**

### **1. Install/Update Supabase CLI**

```bash
npm install -g supabase
```

---

### **2. Login**

```bash
npx supabase login
```

---

### **3. Deploy Function**

```bash
cd /path/to/your/shopeasy/project

npx supabase functions deploy payments-simple --project-ref pkzpifdocmmzowvjopup
```

---

### **4. Add Secrets**

**Supabase Dashboard:**
```
Settings → Edge Functions → Secrets

Add:
- PAYSTACK_SECRET_KEY = sk_test_xxxxx
- FRONTEND_URL = https://your-app.vercel.app
```

---

### **5. Redeploy**

```bash
npx supabase functions deploy payments-simple --project-ref pkzpifdocmmzowvjopup
```

---

### **6. Wait**

**Wait 2-5 minutes for activation**

---

### **7. Test Endpoint**

**Browser:**
```
https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple
```

**Should return:** `{"status": "ok", ...}`

---

### **8. Test Payment**

1. Hard refresh app
2. Try payment with test card
3. ✅ Should work!

---

## 📊 CHECK SUPABASE DASHBOARD

### **Edge Functions Page:**

```
Supabase Dashboard
  → Edge Functions (left sidebar)
    → Should see: payments-simple
      → Status: Deployed
      → Last deployed: <recent timestamp>
```

**If not there:** Function is not deployed!

---

### **Edge Function Logs:**

```
Settings
  → Logs
    → Edge Functions
      → Filter: payments-simple
        → Should see recent logs
```

**If no logs:** Function never received requests

---

## ✅ VERIFICATION STEPS

**After deploying, verify:**

### **1. API Responds:**
```bash
curl https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple

# Returns: {"status":"ok",...}
```

### **2. Function Listed:**
```bash
npx supabase functions list

# Shows: payments-simple
```

### **3. Secrets Set:**
```
Dashboard → Settings → Edge Functions → Secrets
  ✅ PAYSTACK_SECRET_KEY
  ✅ FRONTEND_URL
```

### **4. Payment Works:**
```
App → Billing → Subscribe
  ✅ No "Failed to fetch" error
  ✅ Redirects to Paystack
```

---

## 🎉 SUCCESS INDICATORS

**You've fixed it when:**

- ✅ API endpoint returns `{"status": "ok"}`
- ✅ No "Failed to fetch" error
- ✅ Payment popup opens
- ✅ Paystack payment page loads
- ✅ Can enter card details
- ✅ Payment processes

---

## 📞 STILL NOT WORKING?

### **Get More Info:**

**1. Check exact error:**
```javascript
// In browser console (F12)
// The full error message will show here
```

**2. Check function logs:**
```bash
npx supabase functions logs payments-simple --follow

# Then try payment and watch logs
```

**3. Check network request:**
```
F12 → Network → Try payment
  → Click failed request
    → Check Response tab
      → See actual error
```

---

## 💡 COMMON ERROR MESSAGES

| Error | Cause | Fix |
|-------|-------|-----|
| `Failed to fetch` | Function not deployed | Deploy function |
| `404 Not Found` | Wrong URL or not deployed | Check URL, deploy |
| `CORS error` | CORS not configured | Redeploy function |
| `401 Unauthorized` | No auth token | Login again |
| `500 Internal Error` | Function crashed | Check logs |
| `Payment gateway not configured` | No secrets | Add secrets |

---

## 🚀 QUICK COMMAND REFERENCE

```bash
# Login
npx supabase login

# Deploy function
npx supabase functions deploy payments-simple

# List functions
npx supabase functions list

# View logs
npx supabase functions logs payments-simple

# View logs (live)
npx supabase functions logs payments-simple --follow

# Test endpoint
curl https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple
```

---

## ✅ SUMMARY: FIX "FAILED TO FETCH"

```bash
# 1. Deploy function
npx supabase functions deploy payments-simple

# 2. Add secrets in Supabase Dashboard
PAYSTACK_SECRET_KEY = sk_test_xxxxx
FRONTEND_URL = https://your-app.vercel.app

# 3. Redeploy
npx supabase functions deploy payments-simple

# 4. Wait 2-5 minutes (first deploy only)

# 5. Test endpoint
curl https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple

# 6. Hard refresh app (Ctrl+Shift+R)

# 7. Try payment
# ✅ Should work!
```

---

**That's it! The "Failed to fetch" error should be gone! 🎉**
