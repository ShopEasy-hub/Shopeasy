# 🧪 Test Payment Flow on Localhost

## Quick Setup

### 1. Start Your Dev Server
```bash
npm run dev
# Should be running on http://localhost:5173
```

### 2. Test Payment Callback Without Paystack

Just open this URL in your browser to simulate a payment callback:

```
http://localhost:5173?reference=test_123456789&status=success
```

You should see:
- ✅ The PaymentCallback component loads
- ✅ Shows "Processing Payment" briefly
- ✅ Then shows the PaymentVerification page
- ✅ Console logs showing the payment flow

### 3. Check Console Logs

Open DevTools (F12) and you should see:
```
🌐 APP INIT - URL INFO: { ... }
🔍 Payment callback check: { hasPaymentCallback: true, reference: "test_123456789", ... }
💳 ✅ Payment callback detected - routing to payment-callback page
🔥 PaymentCallback component mounted
🔄 Payment callback received: { reference: "test_123456789", ... }
```

### 4. Test Different Scenarios

**Test with reference parameter (Paystack style):**
```
http://localhost:5173?reference=test_ref_123&status=success
```

**Test with trxref parameter (Paystack actual):**
```
http://localhost:5173?trxref=test_trx_456
```

**Test with tx_ref (Flutterwave style):**
```
http://localhost:5173?tx_ref=test_fw_789&status=successful
```

## What Should Happen

1. **URL Detection** - App.tsx detects payment parameters in URL
2. **Route to Payment Page** - Skips auth check and goes to payment-callback
3. **Show Payment Info** - PaymentCallback extracts the reference
4. **Verify Payment** - PaymentVerification calls Edge Function to verify
5. **Update Subscription** - If successful, updates org subscription
6. **Redirect to Dashboard** - Finally redirects to dashboard

## Common Issues

### Issue: Blank Page
**Check:**
- Is dev server running?
- Open console - any errors?
- Does URL have `?reference=` or `?trxref=`?

### Issue: "No payment reference found"
**Solution:**
- Make sure URL has at least one of: reference, trxref, tx_ref, transaction_id
- Example: `http://localhost:5173?reference=test123`

### Issue: Edge Function Error
**Check:**
```bash
# Check Edge Function is deployed
supabase functions list

# Check logs
supabase functions logs payments-simple
```

## Test Real Paystack Integration

### 1. Use Paystack Test Mode

In your Edge Function, make sure you're using test keys:
- Test Secret Key: `sk_test_...`
- Test Public Key: `pk_test_...`

### 2. Test Card Details
```
Card Number: 4084084084084081
CVV: 408
Expiry: 12/30
PIN: 0000
OTP: 123456
```

### 3. Start Payment Flow
1. Login to your app
2. Go to Subscription Plans
3. Select a plan
4. Click "Pay with Paystack"
5. Use test card above
6. Complete payment
7. Should redirect back to `http://localhost:5173?trxref=...`

### 4. Watch the Console

You should see all the debug logs showing:
- Payment callback detected
- Reference extracted
- Edge Function called
- Payment verified
- Subscription updated
- Redirect to dashboard

## Quick Test Command

Run this in terminal to open test URL:
```bash
# Mac/Linux
open "http://localhost:5173?reference=test_$(date +%s)&status=success"

# Windows (PowerShell)
Start-Process "http://localhost:5173?reference=test_$(Get-Date -UFormat %s)&status=success"

# Windows (Command Prompt)
start http://localhost:5173?reference=test_123456&status=success
```

## Debugging Checklist

- [ ] Dev server running on localhost:5173
- [ ] Console open (F12)
- [ ] URL has payment parameters (reference/trxref/tx_ref)
- [ ] Edge Function deployed (`supabase functions deploy payments-simple`)
- [ ] Supabase project linked (`supabase link`)
- [ ] Environment variables set in Edge Function
- [ ] Using test mode keys (sk_test_... and pk_test_...)

## Expected Console Output

```
🏪 ShopEasy POS System
🚀🚀🚀 ShopEasy Version: 3.0.0-PAYMENT-VERIFICATION-NO-AUTH-REQUIRED
🌐 APP INIT - URL INFO: {
  href: "http://localhost:5173?reference=test_123",
  pathname: "/",
  search: "?reference=test_123",
  allParams: { reference: "test_123" }
}
🔍 Payment callback check: {
  hasPaymentCallback: true,
  reference: "test_123",
  trxref: null,
  tx_ref: null,
  status: null
}
💳 ✅ Payment callback detected - routing to payment-callback page
🔥 PaymentCallback component mounted
🔄 Payment callback received: {
  reference: "test_123",
  status: null,
  transactionId: null,
  allParams: { reference: "test_123" }
}
```

## Next Steps

Once localhost works:
1. Deploy to production (Vercel/Netlify)
2. Update Paystack callback URL to production URL
3. Switch to live keys when ready to go live
4. Test with real payments

## Need Help?

Check these files:
- `/App.tsx` - URL detection and routing logic
- `/pages/PaymentCallback.tsx` - Payment callback handler
- `/pages/PaymentVerification.tsx` - Actual verification logic
- `/supabase/functions/payments-simple/index.ts` - Edge Function
- `/lib/payment.ts` - Payment utilities

All logs are prefixed with emojis for easy searching in console! 🎯
