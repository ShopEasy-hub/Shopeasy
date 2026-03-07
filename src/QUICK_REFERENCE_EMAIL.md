# 📧 Quick Reference: Email Reset Setup

## 🎯 Your 2 Problems → 2 Solutions

```
┌─────────────────────────────────────────────────────┐
│ PROBLEM 1: Link opened localhost                   │
│ SOLUTION:  Update /lib/config.ts line 25           │
│ TIME:      1 minute                                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ PROBLEM 2: Email shows Supabase                    │
│ SOLUTION:  Customize template in Supabase          │
│ TIME:      4 minutes                                │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Solution 1: Production URL

**File:** `/lib/config.ts`

**Find:**
```typescript
const PRODUCTION_URL = 'https://your-production-domain.com';
```

**Change to:**
```typescript
const PRODUCTION_URL = 'https://ShopSpot-pos.vercel.app';
// ↑ Your actual deployed URL
```

**Examples:**
- Vercel: `'https://my-app.vercel.app'`
- Netlify: `'https://my-app.netlify.app'`
- Custom: `'https://pos.mydomain.com'`

✅ **Done!** Commit and deploy.

---

## 📧 Solution 2: Email Template

**Supabase Dashboard:**
1. https://supabase.com/dashboard
2. Your project → Authentication → Email Templates
3. Click "Reset Password"
4. Delete all content
5. Paste template from `/EMAIL_CUSTOMIZATION_GUIDE.md` (lines 49-183)
6. Subject: `Reset Your ShopSpot Password`
7. Save

✅ **Done!** Test by requesting reset.

---

## 🧪 How to Test

```bash
# 1. Go to login page
→ Click "Reset password"

# 2. Enter email
→ Click "Send Reset Link"

# 3. Check inbox
→ Should see ShopSpot branded email ✅

# 4. Click button in email
→ Should open your site (not localhost) ✅

# 5. Set new password
→ Should work and redirect to login ✅
```

---

## 📊 Before vs After

### Email From:
```
BEFORE: Supabase Auth <noreply@supabase.io>
AFTER:  ShopSpot Support <noreply@ShopSpot.com> ✅
```

### Email Subject:
```
BEFORE: Reset Your Password
AFTER:  Reset Your ShopSpot Password ✅
```

### Email Design:
```
BEFORE: Plain text, generic
AFTER:  HTML, branded, professional ✅
```

### Reset Link:
```
BEFORE: http://localhost:3000 (even in production!)
AFTER:  https://your-domain.com ✅
```

---

## 📁 Documentation Files

```
START_HERE_EMAIL_FIX.md          ← Best place to start
  ↓
QUICK_FIX_EMAIL_SETUP.md         ← Alternative quick guide
  ↓
EMAIL_CUSTOMIZATION_GUIDE.md     ← Complete detailed guide
  ↓
SETUP_PRODUCTION_URL.md          ← URL config explained
  ↓
EMAIL_ISSUES_FIXED.md            ← Summary of changes
  ↓
QUICK_REFERENCE_EMAIL.md         ← This file!
```

**Confused?** Start with `START_HERE_EMAIL_FIX.md`

---

## 🚨 Common Issues

| Issue | Fix |
|-------|-----|
| Still opens localhost | Update `/lib/config.ts` + deploy |
| Still shows Supabase | Save template in Supabase again |
| Email not received | Check spam, wait 3 mins |
| Link expired | Valid for 1 hour, request new reset |

---

## ✅ Checklist

**Code:**
- [ ] Updated `/lib/config.ts` line 25
- [ ] Saved file
- [ ] Committed changes
- [ ] Deployed to production

**Supabase:**
- [ ] Pasted custom template
- [ ] Updated subject line
- [ ] Changed sender name
- [ ] Saved changes

**Testing:**
- [ ] Requested reset
- [ ] Email looks branded
- [ ] Link works
- [ ] Password reset successful

---

## 🎯 Success = All These True

- ✅ Email subject: "Reset Your ShopSpot Password"
- ✅ Email from: "ShopSpot Support"
- ✅ Email has green header with 🏪
- ✅ Email is professional HTML
- ✅ No Supabase branding visible
- ✅ Link opens production URL (when deployed)
- ✅ Can successfully reset password

---

## 💡 Remember

**In Development:**
- Link uses `localhost` ← This is CORRECT! ✅

**In Production:**
- Link uses your `PRODUCTION_URL` ← After you configure it! ✅

System **auto-detects** which to use!

---

## ⏱️ Time Required

| Task | Time |
|------|------|
| Update config file | 1 min |
| Customize email | 4 min |
| Test | 2 min |
| **TOTAL** | **7 min** |

---

## 🚀 Quick Start Commands

```bash
# 1. Edit config
code /lib/config.ts
# Update line 25, save

# 2. Go to Supabase
# https://supabase.com/dashboard
# Auth → Email Templates → Reset Password
# Paste template, save

# 3. Test
# Request reset from your app
# Check email
# Click link
# Done! ✅
```

---

## 📞 Still Need Help?

**Read these in order:**

1. `/START_HERE_EMAIL_FIX.md` - Start here! 
2. `/QUICK_FIX_EMAIL_SETUP.md` - 5-min guide
3. `/EMAIL_CUSTOMIZATION_GUIDE.md` - Complete guide

**Still stuck?**
- Check Supabase docs: https://supabase.com/docs
- Check browser console for warnings
- Clear cache and try again

---

## 🎉 Result

After 7 minutes of work:

```
Professional password reset system ✅
ShopSpot branding throughout ✅
Correct URLs everywhere ✅
Happy users ✅
```

**You've got this!** 💪

---

**Quick Start:** See `/START_HERE_EMAIL_FIX.md`
