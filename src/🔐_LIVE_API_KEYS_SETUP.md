# 🔐 LIVE API KEYS SETUP GUIDE

## Quick Reference for Production Deployment

**⚠️ CRITICAL: Follow these steps EXACTLY to go live safely**

---

## 📍 WHERE TO GET YOUR LIVE KEYS

### Paystack Dashboard

1. **Login:**  
   https://dashboard.paystack.com/

2. **Navigate:**  
   Settings → API Keys & Webhooks

3. **Copy These Keys:**
   ```
   Public Key:  pk_live_xxxxxxxxxxxxxxxxxxxxx
   Secret Key:  sk_live_xxxxxxxxxxxxxxxxxxxxx
   ```

4. **⚠️ IMPORTANT:**
   - NEVER share your secret key
   - NEVER commit keys to Git
   - Store only in environment variables

---

## 🔧 WHERE TO ADD THE KEYS

### Option 1: Vercel (Recommended)

```bash
# 1. Go to: https://vercel.com/dashboard
# 2. Select your ShopSpot project
# 3. Click: Settings → Environment Variables
# 4. Add these variables:
```

**Variables to Add:**

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_PAYSTACK_PUBLIC_KEY` | `pk_live_your_key` | Production |
| `PAYSTACK_SECRET_KEY` | `sk_live_your_secret` | Production |
| `VITE_APP_ENV` | `production` | Production |

**Then:**
1. Click "Save"
2. Redeploy: `vercel --prod`

---

### Option 2: Netlify

```bash
# 1. Go to: https://app.netlify.com/
# 2. Select your site
# 3. Site Settings → Environment Variables
# 4. Add the same variables as above
```

**Then:**
1. Click "Save"
2. Trigger new deployment

---

### Option 3: Railway

```bash
# 1. Go to: https://railway.app/
# 2. Select your project
# 3. Click: Variables tab
# 4. Add:
```

```
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_key
PAYSTACK_SECRET_KEY=sk_live_your_secret
VITE_APP_ENV=production
```

---

### Option 4: Custom VPS/Server

```bash
# 1. SSH into your server
ssh user@your-server.com

# 2. Navigate to app directory
cd /var/www/ShopSpot

# 3. Create/Edit .env.production
nano .env.production

# 4. Add these lines:
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_key_here
PAYSTACK_SECRET_KEY=sk_live_your_actual_secret_here
VITE_APP_ENV=production
VITE_SUPABASE_URL=https://pkzpifdocmmzowvjopup.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 5. Set secure permissions
chmod 600 .env.production

# 6. Verify file is NOT tracked by git
cat .gitignore | grep .env.production
# Should show: .env.production

# 7. Rebuild and restart
npm run build
pm2 restart ShopSpot
# or
systemctl restart ShopSpot
```

---

## 🪝 WEBHOOK SETUP

### 1. Get Your Webhook URL

Your webhook URL should be:
```
https://your-production-domain.com/api/webhooks/paystack
```

### 2. Add to Paystack Dashboard

1. Go to: https://dashboard.paystack.com/
2. Navigate: Settings → Webhooks
3. Click: "Add Webhook"
4. Paste your URL
5. Select these events:
   - ✅ `charge.success`
   - ✅ `subscription.create`
   - ✅ `subscription.disable`
   - ✅ `subscription.not_renew`
6. Click "Save"
7. Copy the **Webhook Secret**

### 3. Add Webhook Secret to Environment

Add this variable:
```
PAYSTACK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

---

## ✅ VERIFICATION STEPS

### 1. Check Keys Format

**Public Key:**
```
✅ Correct: pk_live_xxxxxxxxxxxxxxxxxxxxx
❌ Wrong:   pk_test_xxxxxxxxxxxxxxxxxxxxx
❌ Wrong:   pk_live (incomplete)
```

**Secret Key:**
```
✅ Correct: sk_live_xxxxxxxxxxxxxxxxxxxxx
❌ Wrong:   sk_test_xxxxxxxxxxxxxxxxxxxxx
❌ Wrong:   sk_live (incomplete)
```

### 2. Verify Environment

After deployment, open your app in browser:

1. **Open Console (F12)**
2. **Look for these messages:**
   ```
   💳 Payment Environment: LIVE
   🔴 LIVE MODE - Real payments will be processed!
   ```

3. **Check for mode indicator:**
   - Should show: **"🔴 LIVE"** badge
   - NOT: "🟡 TEST"

### 3. Test Small Transaction

**Before announcing to public:**

1. Go to Subscription Plans
2. Select Starter Plan (₦7,500)
3. Choose Monthly billing
4. Use YOUR OWN real card
5. Complete payment
6. Verify:
   - Payment appears in Paystack dashboard
   - Subscription activates in your app
   - Receipt email sent
7. **Optional:** Refund if this was just a test

---

## 🚨 TROUBLESHOOTING

### Issue: Still showing TEST mode

**Solution:**
```bash
# 1. Verify keys are correct
# Check environment variables in hosting platform
# Make sure it's pk_live_ not pk_test_

# 2. Redeploy application
vercel --prod
# or trigger new build in Netlify/Railway

# 3. Clear browser cache
# Hard refresh: Ctrl + Shift + R (Windows/Linux)
# or Cmd + Shift + R (Mac)
```

### Issue: "Payment Not Configured" error

**Solution:**
```bash
# Keys are missing or not loaded
# 1. Check environment variables are saved
# 2. Redeploy after adding variables
# 3. Verify .env.production exists (if using VPS)
```

### Issue: Payments failing

**Solution:**
```bash
# 1. Check Paystack dashboard for error messages
# 2. Verify 3D Secure is enabled
# 3. Check webhook is receiving events
# 4. Review server logs for errors
```

### Issue: Webhook not receiving events

**Solution:**
```bash
# 1. Verify webhook URL is accessible (publicly)
curl -X POST https://your-domain.com/api/webhooks/paystack

# 2. Check webhook secret is correct
# 3. Test webhook in Paystack dashboard
# 4. Review server logs
```

---

## 🔒 SECURITY CHECKLIST

Before going live:

- [ ] Live keys stored ONLY in environment variables
- [ ] No keys in Git repository
- [ ] `.env.production` in `.gitignore`
- [ ] Webhook secret configured
- [ ] HTTPS enabled on domain
- [ ] File permissions set (VPS: `chmod 600 .env.production`)
- [ ] Test keys removed from production environment
- [ ] Paystack 3D Secure enabled
- [ ] Transaction notifications enabled

---

## 📊 MONITORING

### Paystack Dashboard

**Monitor these daily:**

1. **Transactions:**  
   Dashboard → Transactions

2. **Failed Payments:**  
   Dashboard → Transactions → Failed

3. **Subscriptions:**  
   Dashboard → Subscriptions

4. **Webhooks:**  
   Settings → Webhooks → Events Log

### Your Application

**Monitor:**

1. New user sign-ups
2. Trial → Paid conversions
3. Payment success rate
4. Error logs
5. Support tickets

---

## 📞 SUPPORT

### If Something Goes Wrong:

**Paystack Support:**
- Email: support@paystack.com
- Phone: +234-01-888-3000
- Live Chat: dashboard.paystack.com

**Your Technical Team:**
- Email: dev@ShopSpot.ng
- Phone: +234-XXX-XXX-XXXX

---

## ✅ QUICK CHECKLIST

Before launch, confirm:

- [ ] Live public key added to environment
- [ ] Live secret key added to environment
- [ ] Webhook URL configured in Paystack
- [ ] Webhook secret added to environment
- [ ] Application redeployed with new keys
- [ ] Browser shows "🔴 LIVE MODE"
- [ ] Small test transaction successful
- [ ] Test transaction refunded (if needed)
- [ ] Team briefed and ready
- [ ] Support channels active

---

## 🎉 READY TO LAUNCH!

Once all checkboxes above are ✅, you're ready to:

1. **Announce your launch**
2. **Start accepting real payments**
3. **Grow your business!**

---

**Last Updated:** December 15, 2024  
**Version:** 2.0.0  
**Status:** Production Ready 🚀

---

## 🔗 QUICK LINKS

- [Full Deployment Guide](./🚀_PRODUCTION_DEPLOYMENT_CHECKLIST.md)
- [Pricing Configuration](./config/pricing.ts)
- [Database Fix](./🔧_RUN_THIS_IN_SUPABASE_SQL_EDITOR.sql)
- [Environment Template](./.env.production)

---

**Need help?** Contact your technical team immediately.  
**Emergency?** Call Paystack support: +234-01-888-3000
