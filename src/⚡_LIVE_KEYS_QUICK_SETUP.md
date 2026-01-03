# ⚡ LIVE PAYSTACK KEYS - Quick Setup (5 Minutes)

## 🎯 GET YOUR KEYS

**Paystack Dashboard:** https://dashboard.paystack.com/

1. Settings → API Keys
2. **Switch to LIVE mode** (toggle)
3. Copy:
   - Public: `pk_live_xxxxx`
   - Secret: `sk_live_xxxxx`

---

## 🚀 VERCEL (PRODUCTION)

### **1. Add Environment Variables**

**Vercel Dashboard → Your Project → Settings → Environment Variables**

```
VITE_PAYSTACK_PUBLIC_KEY = pk_live_xxxxx
PAYSTACK_SECRET_KEY = sk_live_xxxxx
```

✅ Check: Production, Preview, Development

### **2. Redeploy**

```bash
git commit --allow-empty -m "Switch to live keys"
git push
```

OR: Deployments → Redeploy latest

---

## 🔧 SUPABASE (BACKEND)

### **1. Add Secret**

**Supabase Dashboard → Settings → Edge Functions**

```
Secret Name: PAYSTACK_SECRET_KEY
Value: sk_live_xxxxx
```

### **2. Deploy Function**

```bash
npx supabase functions deploy server
```

---

## 💻 LOCAL DEVELOPMENT

### **1. Create `.env` File**

```bash
touch .env
```

### **2. Add Keys**

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
```

### **3. Restart Server**

```bash
npm run dev
```

---

## ✅ VERIFY

**Open app → Check bottom-right corner:**

- ✅ 🔴 **LIVE MODE** → Working!
- ❌ 🟡 TEST MODE → Still test keys
- ❌ Not configured → Keys missing

**Browser console should show:**
```
💳 Payment Environment: LIVE
🔴 LIVE MODE - Real payments will be processed!
```

---

## 🔐 SECURITY CHECKLIST

- [ ] `.env` file is in `.gitignore`
- [ ] Never commit keys to git
- [ ] Keep secret key private
- [ ] Test with Paystack test card first

---

## 🧪 TEST SAFELY

**Paystack Test Card (works in live mode too!):**

```
Card: 5060 6666 6666 6666 666
Expiry: 12/30
CVV: 123
```

---

## 🚨 ROLLBACK TO TEST

**If anything goes wrong:**

```
Vercel: VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxx
Supabase: PAYSTACK_SECRET_KEY=sk_test_xxxx
Local: Update .env to pk_test/sk_test
```

Then redeploy everything!

---

## ⚡ COMPLETE CHECKLIST

- [ ] Updated Vercel env vars
- [ ] Redeployed Vercel app
- [ ] Added Supabase secret
- [ ] Deployed edge function
- [ ] Updated local `.env`
- [ ] Restarted dev server
- [ ] Verified "LIVE MODE" indicator
- [ ] Tested payment with test card
- [ ] Monitored Paystack dashboard

---

**Done! You're now accepting real payments! 🎉💰**

Full guide: `/🔐_SWITCH_TO_LIVE_PAYSTACK_KEYS.md`
