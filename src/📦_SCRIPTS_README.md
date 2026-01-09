# 📦 DIAGNOSTIC SCRIPTS FOR PAYMENT CALLBACK ISSUE

## 🎯 QUICK START

I've created several scripts to help you diagnose and fix the payment callback issue.

---

## ✅ METHOD 1: One-Click Shell Script (EASIEST!)

**For Mac/Linux:**

```bash
# Make script executable
chmod +x deploy-and-watch.sh

# Run it
./deploy-and-watch.sh
```

**For Windows:**

```bash
# Just double-click or run
deploy-and-watch.bat
```

**What it does:**
1. ✅ Deploys the updated Edge Function with debug logging
2. ✅ Automatically starts watching logs
3. ✅ Shows you instructions
4. ✅ Waits for you to try a payment
5. ✅ Displays logs in real-time

**Then:**
- Open your app in browser
- Try payment
- Watch the terminal for logs showing FRONTEND_URL value

---

## ✅ METHOD 2: Browser-Based Diagnostic Dashboard (NO TERMINAL!)

### **Step 1: Deploy Diagnostic Function**

```bash
npx supabase functions deploy diagnostic
```

### **Step 2: Open Dashboard in Browser**

Simply open this file in your browser:
```
diagnostic-dashboard.html
```

Or go to:
```
file:///path/to/your/project/diagnostic-dashboard.html
```

**What it does:**
- ✅ Shows FRONTEND_URL value from Edge Function
- ✅ Shows Paystack configuration
- ✅ Checks if values are correct
- ✅ Gives recommendations
- ✅ Lets you test callback URL with one click
- ✅ Shows sample callback URL
- ✅ All in a nice visual dashboard!

**No terminal needed! Everything in the browser!**

---

## ✅ METHOD 3: Manual Commands

If you prefer to run commands manually:

### **Step 1: Deploy Functions**

```bash
# Deploy updated payments function
npx supabase functions deploy payments-simple

# Deploy diagnostic function (optional but helpful)
npx supabase functions deploy diagnostic
```

### **Step 2: Watch Logs**

```bash
npx supabase functions logs payments-simple --follow
```

### **Step 3: Test**

- Open app in browser
- Try payment
- Watch terminal

---

## 🎯 WHICH METHOD SHOULD I USE?

### **Use Method 1 (Shell Script) if:**
- ✅ You're comfortable with terminal
- ✅ You want everything automated
- ✅ You want to see logs in real-time

### **Use Method 2 (Browser Dashboard) if:**
- ✅ You prefer visual interfaces
- ✅ You don't like using terminal
- ✅ You want to check configuration without trying payment
- ✅ You want a one-click solution

### **Use Method 3 (Manual) if:**
- ✅ You want full control
- ✅ You're already familiar with Supabase CLI
- ✅ You want to understand each step

---

## 📋 WHAT EACH SCRIPT DOES

### **`deploy-and-watch.sh` / `deploy-and-watch.bat`**
**Purpose:** Automated deployment and log watching

**What it does:**
1. Checks if Supabase CLI is installed
2. Deploys `payments-simple` Edge Function
3. Shows instructions
4. Starts watching logs
5. You try payment, logs appear

**Output shows:**
```
🔍 FRONTEND_URL from env: https://shopeasy-lemon.vercel.app
🔍 Callback URL will be: https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx
```

---

### **`diagnostic-dashboard.html`**
**Purpose:** Visual diagnostic dashboard in browser

**Features:**
- ✅ Check FRONTEND_URL value
- ✅ Check Paystack configuration
- ✅ See if values are correct
- ✅ Get recommendations
- ✅ Test callback URL
- ✅ View sample callback URL
- ✅ All checks color-coded (green = good, red = bad)

**Requirements:**
- Must deploy diagnostic function first: `npx supabase functions deploy diagnostic`

---

### **`/supabase/functions/diagnostic/index.ts`**
**Purpose:** Edge Function that returns configuration info

**Returns:**
```json
{
  "status": "ok",
  "environment": {
    "FRONTEND_URL": {
      "exists": true,
      "value": "https://shopeasy-lemon.vercel.app",
      "isLocalhost": false,
      "hasTrailingSlash": false,
      "protocol": "https"
    },
    "PAYSTACK_SECRET_KEY": {
      "exists": true,
      "isTest": true,
      "preview": "sk_test_..."
    }
  },
  "checks": {
    "frontendUrlValid": true,
    "paystackConfigured": true
  },
  "recommendations": ["✅ Everything looks good!"]
}
```

---

## 🚀 RECOMMENDED WORKFLOW

### **Quick Check (1 Minute):**

```bash
# Deploy diagnostic function
npx supabase functions deploy diagnostic

# Open diagnostic-dashboard.html in browser
# Click "Run Diagnostics"
# See if FRONTEND_URL is correct
```

**If dashboard shows issues → fix them → redeploy**

---

### **Full Test (3 Minutes):**

```bash
# Option A: Use script (easiest)
./deploy-and-watch.sh

# Option B: Manual
npx supabase functions deploy payments-simple
npx supabase functions logs payments-simple --follow

# Then try payment in browser
# Watch logs
```

---

## 🔍 WHAT TO LOOK FOR

### **In Shell Script Logs:**
```
🔍 FRONTEND_URL from env: https://shopeasy-lemon.vercel.app
🔍 Callback URL will be: https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx
```

**Good:** Shows your production URL  
**Bad:** Shows `undefined` or `http://localhost:3000`

---

### **In Browser Dashboard:**

**Good indicators:**
- ✅ FRONTEND_URL shows your Vercel URL
- ✅ Protocol shows "https"
- ✅ Is Localhost? shows "NO"
- ✅ Trailing Slash? shows "NO"
- ✅ All checks are green

**Bad indicators:**
- ❌ FRONTEND_URL shows "NOT SET"
- ❌ FRONTEND_URL shows localhost
- ❌ Protocol shows "http"
- ❌ Checks are red

---

## 🛠️ TROUBLESHOOTING

### **Script says "Supabase CLI not found"**

**Fix:**
```bash
npm install -g supabase
```

---

### **Diagnostic dashboard shows "Connection Failed"**

**Fix:**
```bash
# Deploy diagnostic function
npx supabase functions deploy diagnostic

# Refresh dashboard
```

---

### **Logs show "FRONTEND_URL from env: undefined"**

**Fix:**
1. Go to Supabase Dashboard
2. Settings → Edge Functions → Secrets
3. Add: `FRONTEND_URL` = `https://shopeasy-lemon.vercel.app`
4. Redeploy: `npx supabase functions deploy payments-simple`
5. Run script again

---

### **Logs show "FRONTEND_URL from env: http://localhost:3000"**

**Fix:**
1. Go to Supabase Dashboard
2. Settings → Edge Functions → Secrets
3. Update FRONTEND_URL to: `https://shopeasy-lemon.vercel.app`
4. Redeploy
5. Run script again

---

## 📞 WHAT TO SEND ME

After running scripts, send me:

### **Option 1: Screenshot of Diagnostic Dashboard**
- Just take a screenshot of the dashboard
- Shows everything I need!

### **Option 2: Terminal Logs**
```
=== LOGS FROM TERMINAL ===
🔍 FRONTEND_URL from env: [copy what it says]
🔍 Callback URL will be: [copy what it says]
✅ PayStack initialization response: [copy response]
```

---

## ✅ SUCCESS INDICATORS

**You'll know it's fixed when:**

### **In Terminal:**
```
🔍 FRONTEND_URL from env: https://shopeasy-lemon.vercel.app
🔍 Callback URL will be: https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx
```

### **In Dashboard:**
- All checks are ✅ green
- Recommendations say "Everything looks good!"
- Sample callback URL shows your production URL

### **In Browser:**
- Payment redirects back to your app
- Shows "Verifying Payment..."
- Verification succeeds
- Subscription activates

---

## 🎯 SUMMARY

**Easiest way:**
1. Run: `./deploy-and-watch.sh` (or `.bat` on Windows)
2. Try payment in browser
3. Check what FRONTEND_URL value shows in logs
4. Send me the logs

**Alternative (no terminal):**
1. Run: `npx supabase functions deploy diagnostic`
2. Open: `diagnostic-dashboard.html` in browser
3. Click "Run Diagnostics"
4. Screenshot and send me

---

**Let's get this fixed! 🚀**
