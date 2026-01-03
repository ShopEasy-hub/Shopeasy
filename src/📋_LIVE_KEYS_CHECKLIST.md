# 📋 SWITCH TO LIVE PAYSTACK KEYS - Checklist

---

## ✅ STEP-BY-STEP CHECKLIST

### **🔑 STEP 1: GET PAYSTACK LIVE KEYS**

- [ ] Go to https://dashboard.paystack.com/
- [ ] Login to your account
- [ ] Click: Settings → API Keys & Webhooks
- [ ] **Switch to LIVE mode** (toggle in top-right)
- [ ] Copy Public Key (starts with `pk_live_`)
- [ ] Copy Secret Key (starts with `sk_live_`)
- [ ] ⚠️ **KEEP SECRET KEY PRIVATE!**

---

### **🚀 STEP 2: UPDATE VERCEL (FRONTEND)**

#### **A. Add Environment Variables**

- [ ] Go to https://vercel.com/
- [ ] Select your ShopEasy project
- [ ] Click: Settings → Environment Variables
- [ ] Click "Add New"

**Variable 1:**
- [ ] Name: `VITE_PAYSTACK_PUBLIC_KEY`
- [ ] Value: `pk_live_xxxxx` (paste your key)
- [ ] Environment: ✅ Production, ✅ Preview, ✅ Development
- [ ] Click "Save"

**Variable 2:**
- [ ] Name: `PAYSTACK_SECRET_KEY`
- [ ] Value: `sk_live_xxxxx` (paste your key)
- [ ] Environment: ✅ Production, ✅ Preview, ✅ Development
- [ ] Click "Save"

#### **B. Redeploy**

**Option A: Git Push**
- [ ] `git commit --allow-empty -m "Update to live keys"`
- [ ] `git push origin main`
- [ ] Wait for deployment (2-3 minutes)

**Option B: Manual Redeploy**
- [ ] Go to: Deployments tab
- [ ] Click "..." on latest deployment
- [ ] Click "Redeploy"
- [ ] ❌ Uncheck "Use existing Build Cache"
- [ ] Click "Redeploy"
- [ ] Wait for completion

**Verify:**
- [ ] Deployment shows "Ready"
- [ ] No errors in build logs

---

### **🔧 STEP 3: UPDATE SUPABASE (BACKEND)**

#### **A. Add Edge Function Secret**

- [ ] Go to https://supabase.com/dashboard
- [ ] Select your ShopEasy project
- [ ] Click: Settings → Edge Functions
- [ ] Scroll to "Secrets" section
- [ ] Click "Add Secret"
- [ ] Name: `PAYSTACK_SECRET_KEY`
- [ ] Value: `sk_live_xxxxx` (paste your secret key)
- [ ] Click "Add Secret"

#### **B. Deploy Edge Function**

**In your terminal:**

- [ ] Open terminal/command prompt
- [ ] Navigate to project: `cd /path/to/shopeasy`
- [ ] Run: `npx supabase functions deploy server`
- [ ] Wait for: "✅ Deployed function server"
- [ ] Verify no errors

---

### **💻 STEP 4: UPDATE LOCAL DEVELOPMENT**

#### **A. Create `.env` File**

- [ ] Open project folder
- [ ] Create file named `.env` in root
- [ ] ⚠️ **Make sure `.env` is in `.gitignore`**

#### **B. Add Keys to `.env`**

**Add this content:**

```env
# Paystack Live Keys
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx

# Keep your existing Supabase keys
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

- [ ] Paste your actual `pk_live_` key
- [ ] Paste your actual `sk_live_` key
- [ ] Save file

#### **C. Restart Dev Server**

- [ ] Stop server (Ctrl+C)
- [ ] Run: `npm run dev`
- [ ] Wait for server to start

---

### **✅ STEP 5: VERIFY IT'S WORKING**

#### **A. Check Visual Indicator**

**Production (Vercel):**
- [ ] Open: https://your-app.vercel.app
- [ ] Look at bottom-right corner
- [ ] Should show: 🔴 **LIVE MODE**

**Local Development:**
- [ ] Open: http://localhost:5173 (or your port)
- [ ] Look at bottom-right corner
- [ ] Should show: 🔴 **LIVE MODE**

#### **B. Check Browser Console**

- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Should see:
  ```
  💳 Payment Environment: LIVE
  🔴 LIVE MODE - Real payments will be processed!
  ```

#### **C. Check Environment Variable (DevTools)**

**In console, type:**
```javascript
import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
```

- [ ] Should return: `"pk_live_xxxxx"`
- [ ] NOT: `"pk_test_xxxxx"`

---

### **🧪 STEP 6: TEST PAYMENT (CAREFULLY!)**

⚠️ **WARNING: Use test card first! Real cards will be charged!**

#### **A. Test with Paystack Test Card**

**Test card that works in live mode:**
```
Card Number: 5060 6666 6666 6666 666
Expiry: 12/30
CVV: 123
PIN: 1234
OTP: 123456
```

**Test Flow:**
- [ ] Go to: Billing → Choose Plan
- [ ] Select any plan
- [ ] Click "Subscribe"
- [ ] Enter test card details above
- [ ] Complete payment
- [ ] **Should process successfully** ✅
- [ ] Subscription activates
- [ ] Plan features unlock

#### **B. Check Paystack Dashboard**

- [ ] Go to: https://dashboard.paystack.com/
- [ ] Click: Transactions
- [ ] **Should see test transaction** ✅
- [ ] Status: Success

---

### **🔐 SECURITY CHECKLIST**

- [ ] `.env` file is NOT committed to git
- [ ] `.gitignore` includes `.env`
- [ ] Secret keys not shared publicly
- [ ] Secret keys not in screenshots
- [ ] Secret keys not in Slack/email
- [ ] Vercel environment variables are private
- [ ] Supabase secrets are secure

**Verify `.gitignore`:**
```
- [ ] Open `.gitignore` file
- [ ] Should contain: `.env`
- [ ] Should contain: `.env.local`
```

---

### **📊 MONITORING CHECKLIST**

#### **After Going Live:**

**Daily:**
- [ ] Check Paystack dashboard for transactions
- [ ] Monitor for failed payments
- [ ] Check for refund requests

**Weekly:**
- [ ] Review settlement reports
- [ ] Check customer feedback
- [ ] Monitor payment success rate

**Monthly:**
- [ ] Review total revenue
- [ ] Check Paystack fees
- [ ] Analyze payment patterns

---

## 🚨 EMERGENCY ROLLBACK

**If something goes wrong, rollback immediately:**

### **Quick Rollback Steps:**

1. **Vercel:**
   - [ ] Settings → Environment Variables
   - [ ] Change `VITE_PAYSTACK_PUBLIC_KEY` to `pk_test_xxxxx`
   - [ ] Redeploy

2. **Supabase:**
   - [ ] Settings → Edge Functions → Secrets
   - [ ] Update `PAYSTACK_SECRET_KEY` to `sk_test_xxxxx`
   - [ ] Run: `npx supabase functions deploy server`

3. **Local:**
   - [ ] Update `.env` to test keys
   - [ ] Restart dev server

---

## 📱 MOBILE APP (IF APPLICABLE)

**If using Capacitor/mobile build:**

- [ ] Update: `android/app/src/main/assets/.env`
- [ ] Update: `ios/App/App/.env`
- [ ] Add: `VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx`
- [ ] Run: `npm run build`
- [ ] Run: `npx cap sync`
- [ ] Test on device

---

## 🎯 FINAL VERIFICATION

**Everything working if:**

- [ ] ✅ Vercel shows 🔴 LIVE MODE
- [ ] ✅ Local shows 🔴 LIVE MODE
- [ ] ✅ Console shows "LIVE MODE" message
- [ ] ✅ Test payment works
- [ ] ✅ Subscription activates
- [ ] ✅ Paystack dashboard shows transaction
- [ ] ✅ No console errors
- [ ] ✅ No build errors
- [ ] ✅ All features accessible

---

## 📞 SUPPORT CONTACTS

**If you need help:**

### **Paystack Support:**
- Email: support@paystack.com
- Phone: +234 (1) 448 5423
- Docs: https://paystack.com/docs/

### **Check Logs:**
1. **Browser:** DevTools → Console
2. **Vercel:** Deployments → Functions
3. **Supabase:** Logs → Edge Functions
4. **Paystack:** Dashboard → Logs

---

## ✅ COMPLETION CHECKLIST

**Mark when 100% complete:**

- [ ] ✅ Paystack live keys obtained
- [ ] ✅ Vercel environment variables updated
- [ ] ✅ Vercel redeployed successfully
- [ ] ✅ Supabase secret added
- [ ] ✅ Edge function deployed
- [ ] ✅ Local `.env` updated
- [ ] ✅ Dev server restarted
- [ ] ✅ Live mode indicator showing
- [ ] ✅ Test payment successful
- [ ] ✅ Paystack dashboard shows transaction
- [ ] ✅ Security measures in place
- [ ] ✅ `.env` not in git
- [ ] ✅ Team notified
- [ ] ✅ Monitoring setup

---

**🎉 CONGRATULATIONS! You're now accepting real payments!**

---

## 📚 REFERENCE DOCS

- Full Guide: `/🔐_SWITCH_TO_LIVE_PAYSTACK_KEYS.md`
- Quick Setup: `/⚡_LIVE_KEYS_QUICK_SETUP.md`
- Payment Docs: `/PAYMENT_SETUP_INSTRUCTIONS.md`
- Paystack Docs: https://paystack.com/docs/

---

**Last Updated:** December 31, 2025
