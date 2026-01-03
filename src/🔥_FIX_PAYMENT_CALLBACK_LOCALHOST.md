# 🔥 FIX PAYMENT CALLBACK LOCALHOST ISSUE

## ❌ THE PROBLEM

After successful payment, Paystack redirects to:
```
http://localhost:3000/?payment-callback=true&reference=...
```

Instead of your live URL:
```
https://your-app.vercel.app/?payment-callback=true&reference=...
```

---

## 🎯 THE CAUSE

The Edge Function is missing the `FRONTEND_URL` environment variable, so it's using the fallback:

**Code in `/supabase/functions/server/index.tsx`:**
```typescript
callback_url: `${Deno.env.get('FRONTEND_URL') || 'http://localhost:3000'}/payment-callback`
                                                   ↑
                                                   Falling back to this!
```

---

## ⚡ THE FIX (5 MINUTES)

### **STEP 1: Add FRONTEND_URL to Supabase**

1. **Go to:** https://supabase.com/dashboard
2. **Select** your ShopEasy project
3. **Click:** Settings → Edge Functions (in left sidebar)
4. **Scroll to:** "Secrets" section
5. **Click:** "Add Secret"
6. **Add:**
   ```
   Secret Name: FRONTEND_URL
   Secret Value: https://your-app.vercel.app
   ```
   ⚠️ **IMPORTANT:** 
   - No trailing slash!
   - Use your actual Vercel URL
   - Example: `https://shopeasy.vercel.app`

7. **Click:** "Add Secret"

---

### **STEP 2: Redeploy Edge Function**

**In your terminal:**

```bash
# Navigate to project
cd /path/to/shopeasy

# Deploy with new environment variable
npx supabase functions deploy server

# Wait for success:
# ✅ Deployed function server
```

---

### **STEP 3: Test Payment Again**

1. Go to your app
2. Try to subscribe to a plan
3. Complete payment
4. **Should redirect to:** `https://your-app.vercel.app/?payment-callback=true`
5. ✅ **Success!**

---

## 🎯 EXACT LOCATION IN SUPABASE

**Visual Guide:**

```
Supabase Dashboard
  └─> Your Project (ShopEasy)
      └─> ⚙️ Settings (bottom of sidebar)
          └─> Edge Functions
              └─> Scroll down to "Secrets"
                  └─> Click "Add Secret"
                      
                      Secret Name:  FRONTEND_URL
                      Secret Value: https://your-app.vercel.app
                      
                      └─> Click "Add Secret"
```

---

## 📝 WHAT TO PUT AS FRONTEND_URL

### **Production (Vercel):**

**Find your Vercel URL:**

1. Go to Vercel Dashboard
2. Click on your project
3. Look for: `https://your-project.vercel.app`
4. Copy it

**Add to Supabase:**
```
FRONTEND_URL = https://your-project.vercel.app
```

⚠️ **NO trailing slash!**
- ✅ Correct: `https://your-app.vercel.app`
- ❌ Wrong: `https://your-app.vercel.app/`

---

### **Custom Domain (If You Have One):**

If you set up a custom domain like `https://shopeasy.com`:

```
FRONTEND_URL = https://shopeasy.com
```

---

### **Preview/Staging:**

If you have a staging environment:

```
FRONTEND_URL = https://your-app-staging.vercel.app
```

---

## 🔍 VERIFY IT'S SET CORRECTLY

### **Option 1: Check Supabase Dashboard**

1. Settings → Edge Functions → Secrets
2. Should see:
   ```
   FRONTEND_URL (hidden) [Delete]
   ```

### **Option 2: Test in Edge Function**

**Add temporary logging to edge function:**

In `/supabase/functions/server/index.tsx`, find the payment initialization and add:

```typescript
console.log('🔗 Callback URL:', Deno.env.get('FRONTEND_URL'));
```

**Then:**
1. Redeploy: `npx supabase functions deploy server`
2. Make a payment
3. Check Supabase Logs:
   - Settings → Logs → Edge Functions
   - Filter: server function
   - Should see: `🔗 Callback URL: https://your-app.vercel.app`

---

## 🚨 COMMON MISTAKES

### **❌ Mistake 1: Trailing Slash**

**Wrong:**
```
FRONTEND_URL = https://your-app.vercel.app/
                                         ↑ Don't add this!
```

**Correct:**
```
FRONTEND_URL = https://your-app.vercel.app
```

**Why:** The code adds `/payment-callback`, so with trailing slash it becomes:
```
https://your-app.vercel.app//payment-callback
                            ↑↑ Double slash = error
```

---

### **❌ Mistake 2: Using HTTP instead of HTTPS**

**Wrong:**
```
FRONTEND_URL = http://your-app.vercel.app
               ↑ Should be https!
```

**Correct:**
```
FRONTEND_URL = https://your-app.vercel.app
               ↑
```

**Why:** Vercel uses HTTPS by default. HTTP will fail.

---

### **❌ Mistake 3: Using localhost**

**Wrong:**
```
FRONTEND_URL = http://localhost:5173
```

**Correct:**
```
FRONTEND_URL = https://your-app.vercel.app
```

**Why:** Localhost only works on your computer. Paystack can't redirect to your computer!

---

### **❌ Mistake 4: Forgot to Redeploy**

**After adding secret, you MUST redeploy:**

```bash
npx supabase functions deploy server
```

**If you don't redeploy, the function won't see the new variable!**

---

## 🧪 TESTING AFTER FIX

### **Test 1: Check Redirect URL**

1. Start a payment
2. Open browser DevTools (F12)
3. Go to Network tab
4. Complete payment
5. Check redirect URL in address bar
6. Should be: `https://your-app.vercel.app/?payment-callback=true`

---

### **Test 2: Check Paystack Dashboard**

1. Go to: https://dashboard.paystack.com/
2. Click: Transactions
3. Find your test transaction
4. Click on it
5. Look for "Redirect URL"
6. Should show: `https://your-app.vercel.app/payment-callback`

---

### **Test 3: Full Flow**

1. Choose a plan
2. Click Subscribe
3. Complete payment (use test card)
4. ✅ Should redirect to your live app
5. ✅ Subscription should activate
6. ✅ Dashboard should unlock

---

## 📋 QUICK CHECKLIST

- [ ] Added `FRONTEND_URL` to Supabase Secrets
- [ ] Used correct format: `https://your-app.vercel.app` (no trailing slash)
- [ ] Deployed edge function: `npx supabase functions deploy server`
- [ ] Waited for deployment to complete
- [ ] Tested payment
- [ ] Redirects to live URL (not localhost) ✅
- [ ] Payment callback works
- [ ] Subscription activates

---

## 🔄 FOR MULTIPLE ENVIRONMENTS

If you have multiple environments (dev, staging, prod):

### **Development:**
```
FRONTEND_URL = http://localhost:5173
```

### **Staging:**
```
FRONTEND_URL = https://your-app-staging.vercel.app
```

### **Production:**
```
FRONTEND_URL = https://your-app.vercel.app
```

**⚠️ Problem:** Supabase Edge Functions only have ONE set of secrets!

**Solution:** Use different Supabase projects for each environment, or detect environment in code:

```typescript
const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 
  (Deno.env.get('ENVIRONMENT') === 'production' 
    ? 'https://your-app.vercel.app' 
    : 'http://localhost:5173');
```

---

## 🎯 FINAL VERIFICATION

**After fixing, your payment flow should be:**

```
1. User clicks "Subscribe"
   └─> Opens Paystack popup

2. User completes payment
   └─> Paystack processes payment

3. Payment successful
   └─> Paystack redirects to:
       https://your-app.vercel.app/?payment-callback=true&reference=...
       ↑
       Your live URL!

4. Your app receives callback
   └─> Verifies payment
   └─> Activates subscription
   └─> Shows success message
```

---

## 🚨 STILL SHOWING LOCALHOST?

### **Check 1: Secret is Set**

**Supabase Dashboard:**
```
Settings → Edge Functions → Secrets
  ✅ FRONTEND_URL should be listed
```

### **Check 2: Function Redeployed**

**Terminal:**
```bash
npx supabase functions deploy server

# Should see:
# ✅ Deployed function server
# Version: <timestamp>
```

### **Check 3: Correct URL**

**Verify URL format:**
```
✅ https://your-app.vercel.app
❌ https://your-app.vercel.app/
❌ http://your-app.vercel.app
❌ http://localhost:3000
```

### **Check 4: Clear Cache**

**Sometimes Paystack caches the old URL:**

1. Go to Paystack Dashboard
2. Settings → API Keys
3. Toggle Live Mode OFF then ON
4. Try payment again

---

## 💡 PRO TIP: Add to Vercel Too

**Also add FRONTEND_URL to Vercel environment variables:**

**Vercel Dashboard:**
```
Settings → Environment Variables → Add New

Name: FRONTEND_URL
Value: https://your-app.vercel.app
Environment: Production, Preview, Development
```

**This helps if your frontend also needs it!**

---

## 📞 STILL STUCK?

### **Debug Steps:**

1. **Check Supabase Logs:**
   ```
   Settings → Logs → Edge Functions
   Filter: server
   Look for: "PayStack initialization" logs
   ```

2. **Check Paystack Logs:**
   ```
   Dashboard → Transactions → Click transaction
   Look for: "Redirect URL" field
   ```

3. **Check Browser Console:**
   ```
   F12 → Console
   Look for: Payment-related errors
   ```

---

## ✅ SUMMARY

**The Fix:**
```
1. Supabase → Settings → Edge Functions → Secrets
2. Add: FRONTEND_URL = https://your-app.vercel.app
3. Terminal: npx supabase functions deploy server
4. Test payment → Should redirect to live URL ✅
```

**That's it! Your payments should now redirect correctly!** 🎉

---

**Related Guides:**
- Live Keys Setup: `/🔐_SWITCH_TO_LIVE_PAYSTACK_KEYS.md`
- Quick Setup: `/⚡_LIVE_KEYS_QUICK_SETUP.md`
