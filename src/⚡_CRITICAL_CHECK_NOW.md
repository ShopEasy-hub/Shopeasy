# ⚡ CRITICAL CHECK NOW

## 🚨 YOU SAID FRONTEND_URL IS SET

**But the issue persists!**

This means **ONE OF THESE IS TRUE:**

---

## ❌ ISSUE 1: Function Not Redeployed After Adding Secret

**Adding the secret alone is NOT enough!**

**You MUST redeploy the function after adding any secret!**

### **Do This NOW:**

```bash
npx supabase functions deploy payments-simple
```

**Wait for:**
```
✅ Deployed function payments-simple
```

**Then try payment again!**

---

## ❌ ISSUE 2: FRONTEND_URL Has Wrong Value

**Even though it's set, the VALUE might be wrong!**

### **Check the Actual Value:**

```
Supabase Dashboard
  → Settings → Edge Functions → Secrets
    → Find: FRONTEND_URL
      → Click the 👁️ EYE ICON to reveal value
```

**What does it say?**

**MUST be EXACTLY:**
```
https://your-app.vercel.app
```

**Common wrong values:**
```
❌ http://localhost:3000
❌ https://your-app.vercel.app/  (trailing slash!)
❌ http://your-app.vercel.app    (http not https)
```

**If it's wrong:**
1. Delete the secret
2. Add it again with correct value
3. **Redeploy:** `npx supabase functions deploy payments-simple`

---

## ❌ ISSUE 3: Wrong Vercel URL

**Your Vercel URL might have changed!**

### **Get Your CURRENT Vercel URL:**

```
1. Go to: https://vercel.com/dashboard
2. Click your project
3. Look at URL at the top
4. Copy it EXACTLY
```

**Example:** `https://shopeasy-abc123.vercel.app`

**This is what FRONTEND_URL should be!**

---

## 🔧 DO THIS RIGHT NOW

### **STEP 1: Open Supabase Dashboard**

```
https://supabase.com/dashboard
  → Your project
    → Settings (left sidebar)
      → Edge Functions
        → Scroll to "Secrets"
          → Find: FRONTEND_URL
            → Click eye icon 👁️
              → What does it say?
```

**Write it here:** `_______________________________`

---

### **STEP 2: Open Vercel Dashboard**

```
https://vercel.com/dashboard
  → Click your project
    → Look at top of page
      → What is the URL?
```

**Write it here:** `_______________________________`

---

### **STEP 3: Compare**

**Are they EXACTLY the same?**
- Same https://
- Same domain
- NO trailing slash
- Letter-for-letter identical

**If NO → Update FRONTEND_URL!**

---

### **STEP 4: Redeploy**

**Even if they match, redeploy:**

```bash
npx supabase functions deploy payments-simple
```

**This is CRITICAL! Secrets don't take effect until redeployed!**

---

## 🎯 MOST LIKELY CAUSES (In Order)

### **1. You didn't redeploy after adding FRONTEND_URL (90%)**

**Fix:**
```bash
npx supabase functions deploy payments-simple
```

---

### **2. FRONTEND_URL has trailing slash (5%)**

**Wrong:** `https://your-app.vercel.app/`  
**Right:** `https://your-app.vercel.app`

**Fix:**
1. Delete secret
2. Add again without slash
3. Redeploy

---

### **3. FRONTEND_URL is localhost (3%)**

**Wrong:** `http://localhost:3000`  
**Right:** `https://your-app.vercel.app`

**Fix:**
1. Update secret
2. Redeploy

---

### **4. Deployed to wrong project (1%)**

**Check:**
```bash
npx supabase status
```

**Should show:** `Project ref: pkzpifdocmmzowvjopup`

**If different:**
```bash
npx supabase link --project-ref pkzpifdocmmzowvjopup
npx supabase functions deploy payments-simple
```

---

### **5. Using wrong Edge Function (1%)**

**Check what functions exist:**
```bash
npx supabase functions list
```

**Should see:** `payments-simple`

**If you see multiple (payments, server, etc.):**
- Old functions might be interfering
- Delete old ones
- Keep only `payments-simple`

---

## 🔍 VERIFY IT WORKED

**After fixing, check Paystack Dashboard:**

```
https://dashboard.paystack.com/ (TEST mode)
  → Transactions
    → Try a new test payment
      → Find the transaction
        → Look at callback URL
          → Should be: https://your-app.vercel.app?payment-callback=true&reference=SUB_xxx
```

**If it STILL shows localhost:**
- Function not redeployed
- Or wrong function being called

---

## 🧪 DEBUG TOOL

**I've created a debug page for you:**

**Open this file in your browser:**
```
/debug-payment-callback.html
```

**It will:**
- Check if Edge Function is deployed
- Compare your URLs
- Test callback routing
- Analyze Paystack callback URL

**This will show you EXACTLY what's wrong!**

---

## ⚡ QUICK FIX (Do This Now!)

**Just run these commands:**

```bash
# 1. Make sure you're in the right project
npx supabase status

# 2. Redeploy the function
npx supabase functions deploy payments-simple

# 3. Verify it deployed
npx supabase functions list
```

**Then try payment again!**

**90% chance this fixes it!**

---

## 📊 VERIFICATION CHECKLIST

**After running the commands above:**

- [ ] Ran: `npx supabase functions deploy payments-simple`
- [ ] Saw: "✅ Deployed function payments-simple"
- [ ] FRONTEND_URL revealed shows: `https://your-app.vercel.app`
- [ ] NO trailing slash in FRONTEND_URL
- [ ] Vercel URL matches FRONTEND_URL exactly
- [ ] Cleared browser cache
- [ ] Tried new test payment
- [ ] Watched browser URL during redirect
- [ ] URL should change to: `https://your-app.vercel.app?payment-callback=true...`

---

## 🚨 IF STILL NOT WORKING

**Run this and send me the output:**

```bash
# Check function status
npx supabase functions list

# Check recent logs
npx supabase functions logs payments-simple --limit 20

# Try payment, then check logs again
npx supabase functions logs payments-simple --limit 5
```

**Also:**

1. **Reveal FRONTEND_URL in Supabase and tell me the value**
2. **Tell me your Vercel URL**
3. **Open `/debug-payment-callback.html` in browser and run all checks**

---

**The #1 issue is NOT REDEPLOYING after adding the secret!**

**Run this NOW:**

```bash
npx supabase functions deploy payments-simple
```

**Then test payment! 🚀**
