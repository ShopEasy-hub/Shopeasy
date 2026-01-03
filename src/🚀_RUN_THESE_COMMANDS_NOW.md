# 🚀 RUN THESE COMMANDS NOW

## ⚡ QUICK FIX (3 Commands)

I've added debug logging to your Edge Function. Let's deploy it and see what's happening!

---

### **COMMAND 1: Deploy Updated Function**

```bash
npx supabase functions deploy payments-simple
```

**Expected output:**
```
✅ Deployed function payments-simple
```

---

### **COMMAND 2: Watch Logs (Keep This Running)**

**Open Terminal and run:**

```bash
npx supabase functions logs payments-simple --follow
```

**Keep this terminal open!** It will show real-time logs when you try payment.

---

### **COMMAND 3: Try Payment**

**In your browser:**
1. Go to: https://shopeasy-lemon.vercel.app
2. Login
3. Try to make a payment
4. **Watch the terminal from Command 2**

---

## 🔍 WHAT TO LOOK FOR

**In the logs, you should see:**

```
🔵 Request: POST /paystack/initialize
🔍 FRONTEND_URL from env: https://shopeasy-lemon.vercel.app
🔍 Using frontendUrl: https://shopeasy-lemon.vercel.app
🔍 Callback URL will be: https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx
✅ PayStack initialization response: {...}
```

---

## 🚨 POSSIBLE OUTCOMES

### **Outcome 1: FRONTEND_URL is undefined**

**Logs show:**
```
🔍 FRONTEND_URL from env: undefined
🔍 Using frontendUrl: http://localhost:3000
```

**This means:** Secret is NOT set or NOT being read!

**Fix:**
1. Go to Supabase Dashboard
2. Settings → Edge Functions → Secrets
3. Add: `FRONTEND_URL` = `https://shopeasy-lemon.vercel.app`
4. Redeploy: `npx supabase functions deploy payments-simple`
5. Try payment again

---

### **Outcome 2: FRONTEND_URL is localhost**

**Logs show:**
```
🔍 FRONTEND_URL from env: http://localhost:3000
```

**This means:** Secret has wrong value!

**Fix:**
1. Supabase Dashboard → Secrets
2. Delete or update FRONTEND_URL
3. Set to: `https://shopeasy-lemon.vercel.app`
4. Redeploy
5. Try again

---

### **Outcome 3: FRONTEND_URL is correct!**

**Logs show:**
```
🔍 FRONTEND_URL from env: https://shopeasy-lemon.vercel.app
🔍 Callback URL will be: https://shopeasy-lemon.vercel.app?payment-callback=true&reference=SUB_xxx
```

**This means:** Callback URL IS being sent to Paystack!

**But if it still doesn't redirect:**
- Check PayStack response in logs
- Check if there's an error from Paystack
- Send me the full logs

---

### **Outcome 4: No logs appear**

**Nothing shows in terminal when you try payment**

**This means:** Function not being called!

**Fix:**
1. Check browser console (F12) for errors
2. Check network tab - is the API call failing?
3. Make sure you're logged in
4. Check if there's a different error

---

## 📋 QUICK CHECKLIST

**Before running commands:**

- [ ] I'm in my project folder
- [ ] I have Supabase CLI installed
- [ ] I'm connected to internet
- [ ] I know my Vercel URL: `https://shopeasy-lemon.vercel.app`

**After running Command 1:**

- [ ] Saw "✅ Deployed function payments-simple"
- [ ] No errors during deployment

**After running Command 2:**

- [ ] Terminal is waiting and showing "Waiting for logs..."
- [ ] Kept this terminal open

**After running Command 3:**

- [ ] Tried payment in browser
- [ ] Logs appeared in terminal
- [ ] I can see what FRONTEND_URL value is

---

## 📞 SEND ME THE LOGS

**After you've tried the commands, copy and send me:**

1. **What FRONTEND_URL shows in logs:**
   ```
   🔍 FRONTEND_URL from env: _______________________
   ```

2. **What callback URL shows in logs:**
   ```
   🔍 Callback URL will be: _______________________
   ```

3. **Any errors in the logs**

4. **What happened in the browser:**
   - [ ] Payment popup opened
   - [ ] Payment succeeded in Paystack
   - [ ] Redirected to my app: YES / NO
   - [ ] If NO, what happened: _______________________

---

## ✅ SUCCESS INDICATORS

**You'll know it worked when:**

1. ✅ Logs show: `FRONTEND_URL from env: https://shopeasy-lemon.vercel.app`
2. ✅ Logs show: `Callback URL will be: https://shopeasy-lemon.vercel.app?payment-callback=true...`
3. ✅ Payment succeeds in Paystack
4. ✅ Browser automatically redirects to your app
5. ✅ Shows "Verifying Payment..." page
6. ✅ Verification succeeds
7. ✅ Subscription activates

---

## 🎯 SUMMARY

**The commands:**

```bash
# 1. Deploy with logging
npx supabase functions deploy payments-simple

# 2. Watch logs (keep running)
npx supabase functions logs payments-simple --follow

# 3. Try payment in browser and watch terminal
```

**The logs will show us EXACTLY what FRONTEND_URL value is being used!**

---

**Run the commands and let me know what the logs say! 🚀**
