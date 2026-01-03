# ⚡ SIMPLE 2-STEP FIX

Your issues:
1. ✅ **Design lost** - Fixed! CSS import added
2. ⚠️ **Payments not verifying** - Need to deploy

---

## Copy & Paste These Commands:

```bash
# === OPTION 1: Automatic (Recommended) ===
chmod +x DEPLOY_EVERYTHING.sh
./DEPLOY_EVERYTHING.sh
```

**That's it!** The script will:
- Deploy the Edge Function ✅
- Ask you to set PayStack keys ✅
- Deploy the frontend fix ✅

---

## OR Manual (if script doesn't work):

```bash
# Step 1: Deploy Edge Function
cd supabase
supabase functions deploy payments-simple

# Step 2: Set PayStack key (get from https://dashboard.paystack.com)
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Step 3: Set frontend URL (your actual Vercel URL)
supabase secrets set FRONTEND_URL=https://your-app.vercel.app

# Step 4: Go back and deploy frontend
cd ..
git add .
git commit -m "Fix CSS and payments"
git push
```

---

## Wait 2 Minutes

Vercel needs time to build.

---

## Test

1. Open **Incognito window** (Ctrl+Shift+N)
2. Go to your app
3. Login → Settings → Subscription
4. Click "Subscribe Now"
5. Use test card: **4084 0840 8408 4081**
   - Expiry: 12/25
   - CVV: 123
6. Should work! ✅

---

## Still Not Working?

Run this and share output:

```bash
cd supabase
supabase functions list
supabase secrets list
curl https://ajvbefzqcmkdpskjdkui.supabase.co/functions/v1/payments-simple
```

I'll tell you exactly what's wrong! 🎯
