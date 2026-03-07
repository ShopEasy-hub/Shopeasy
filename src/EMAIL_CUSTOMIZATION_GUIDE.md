# 📧 Email Customization Guide - ShopSpot Branding

## 🚨 IMPORTANT: Two Steps Required

### ✅ Step 1: Fix Redirect URL (CODE) - DONE
### ⏳ Step 2: Customize Email Template (SUPABASE DASHBOARD) - DO THIS NOW

---

## Problem You Experienced

### Issue 1: ❌ Localhost Redirect
**Problem:** Reset link opened `http://localhost:3000` instead of your production site

**Why it happened:** The code was using `window.location.origin`, which is localhost during development

**✅ FIXED:** Updated code to use proper production URL from `/lib/config.ts`

### Issue 2: ❌ Supabase Branding
**Problem:** Email shows Supabase branding instead of ShopSpot

**Why it happens:** Default Supabase email template

**✅ FIX REQUIRED:** Follow Step 2 below to customize

---

## 🔧 Step 1: Update Production URL (REQUIRED!)

### File: `/lib/config.ts`

**Find this line:**
```typescript
const PRODUCTION_URL = 'https://your-production-domain.com';
```

**Replace with YOUR actual production domain:**
```typescript
// Examples:
const PRODUCTION_URL = 'https://ShopSpot.yourdomain.com';
// OR
const PRODUCTION_URL = 'https://pos.yourdomain.com';
// OR
const PRODUCTION_URL = 'https://yourdomain.com';
```

**⚠️ IMPORTANT:**
- Use `https://` (not `http://`)
- No trailing slash
- Must match your deployed domain exactly

---

## 📧 Step 2: Customize Supabase Email Template

### 2.1 Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Log in to your account
3. Select your ShopSpot project
4. Navigate to: **Authentication** → **Email Templates**

---

### 2.2 Select "Reset Password" Template

In the Email Templates section, you'll see several templates:
- Confirm Signup
- Invite User
- Magic Link
- Change Email
- **Reset Password** ← SELECT THIS ONE

Click on **"Reset Password"**

---

### 2.3 Customize the Template

You'll see an editor with variables. Here's the **COMPLETE CUSTOM TEMPLATE** for ShopSpot:

#### 📝 Copy and Paste This Template:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your ShopSpot Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      width: 64px;
      height: 64px;
      background-color: white;
      border-radius: 12px;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .message {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    .button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    }
    .info-box {
      background-color: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 16px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .info-box p {
      margin: 8px 0;
      color: #166534;
      font-size: 14px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 8px 0;
      color: #6b7280;
      font-size: 14px;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
    .security-note {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .security-note p {
      margin: 0;
      color: #92400e;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">🏪</div>
      <h1>ShopSpot POS</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Hello,</p>
      
      <p class="message">
        We received a request to reset your password for your ShopSpot account. 
        If you made this request, click the button below to create a new password.
      </p>

      <!-- Reset Button -->
      <div class="button-container">
        <a href="{{ .ConfirmationURL }}" class="button">
          Reset My Password
        </a>
      </div>

      <!-- Info Box -->
      <div class="info-box">
        <p><strong>⏰ This link expires in 1 hour</strong></p>
        <p>For security reasons, this password reset link will only work once and will expire after 60 minutes.</p>
      </div>

      <!-- Alternative Link -->
      <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">
        If the button above doesn't work, copy and paste this link into your browser:
      </p>
      <p style="word-break: break-all; color: #10b981; font-size: 12px; background: #f9fafb; padding: 12px; border-radius: 4px;">
        {{ .ConfirmationURL }}
      </p>

      <!-- Security Warning -->
      <div class="security-note">
        <p>
          <strong>⚠️ Didn't request this?</strong><br>
          If you didn't ask to reset your password, you can safely ignore this email. 
          Your password will remain unchanged.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>ShopSpot - Cloud POS System</strong></p>
      <p>
        Need help? Contact us at 
        <a href="mailto:support@ShopSpot.com">support@ShopSpot.com</a>
      </p>
      <p style="margin-top: 20px; color: #9ca3af; font-size: 12px;">
        © 2024 ShopSpot. All rights reserved.
      </p>
      <p style="color: #9ca3af; font-size: 12px;">
        This is an automated message from your ShopSpot POS system.
      </p>
    </div>
  </div>
</body>
</html>
```

---

### 2.4 Customize Email Subject

In the same template editor, find the **Subject** field at the top:

**Default:**
```
Reset Your Password
```

**Change to:**
```
Reset Your ShopSpot Password
```

---

### 2.5 Update Email Sender (IMPORTANT!)

Still in Supabase Dashboard:

1. Go to: **Project Settings** → **Auth**
2. Scroll to: **SMTP Settings**
3. You have two options:

#### Option A: Quick Fix (Use Supabase Email)

Update these fields:
- **Sender Email:** `noreply@mail.yourdomain.com` (if verified)
- **Sender Name:** `ShopSpot Support`

#### Option B: Custom SMTP (Recommended for Production)

Enable **Custom SMTP** and configure:

```
SMTP Host: smtp.your-email-provider.com
SMTP Port: 587
SMTP User: your-smtp-username
SMTP Password: your-smtp-password
Sender Email: noreply@ShopSpot.com
Sender Name: ShopSpot Support
```

**Popular SMTP Providers:**
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **Amazon SES** (Very cheap: $0.10 per 1,000 emails)
- **Gmail SMTP** (Free but limited)

---

### 2.6 Save Changes

1. Click **Save** at the bottom of the email template
2. Click **Save** again in SMTP settings (if you changed them)

---

## 🧪 Testing the Email

### Test Your Changes:

1. Go to your ShopSpot login page
2. Click **"Reset password"**
3. Enter your email address
4. Click **"Send Reset Link"**
5. Check your email inbox

### ✅ What You Should See:

**Email Subject:**
```
Reset Your ShopSpot Password
```

**From:**
```
ShopSpot Support <noreply@ShopSpot.com>
```

**Email Content:**
- 🏪 ShopSpot logo/icon at top
- Green header with "ShopSpot POS"
- Professional message
- Green "Reset My Password" button
- Security warnings
- ShopSpot branding throughout
- **NO Supabase branding** ✅

### ✅ What the Link Should Do:

**When you click "Reset My Password" button:**
- Should open: `https://your-production-domain.com?reset-password=true`
- **NOT** `http://localhost:3000`
- Shows the reset password page
- Allows you to set new password

---

## 🎨 Further Customization Options

### Add Your Logo

Replace this line in the HTML template:
```html
<div class="logo">🏪</div>
```

With your actual logo:
```html
<div class="logo">
  <img src="https://your-domain.com/logo.png" alt="ShopSpot" style="width: 64px; height: 64px;">
</div>
```

### Change Colors

Find these color codes in the template and replace:

**Primary Green:** `#10b981` → Your brand color
**Dark Green:** `#059669` → Darker shade of your brand color

Example for blue branding:
```css
/* Change from green to blue */
background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
border-left: 4px solid #3b82f6;
color: #3b82f6;
```

### Update Contact Information

In the footer section, update:
```html
<a href="mailto:support@ShopSpot.com">support@ShopSpot.com</a>
```

To your actual support email.

---

## 📋 Checklist: Before Going Live

### Code Configuration:
- [ ] Updated `PRODUCTION_URL` in `/lib/config.ts`
- [ ] Updated `supportEmail` in `/lib/config.ts`
- [ ] Updated `supportPhone` in `/lib/config.ts`
- [ ] Updated `email.fromEmail` in `/lib/config.ts`
- [ ] Deployed code to production

### Supabase Configuration:
- [ ] Customized "Reset Password" email template
- [ ] Updated email subject line
- [ ] Changed sender name to "ShopSpot Support"
- [ ] Configured custom SMTP (optional but recommended)
- [ ] Updated sender email address
- [ ] Saved all changes

### Testing:
- [ ] Tested password reset on production site
- [ ] Confirmed email shows ShopSpot branding
- [ ] Confirmed reset link opens production URL (not localhost)
- [ ] Confirmed can successfully reset password
- [ ] Tested from different email providers (Gmail, Outlook, etc.)

---

## 🚨 Common Issues & Solutions

### Issue: Email Still Goes to Spam

**Solutions:**
1. Set up custom SMTP with verified domain
2. Add SPF record to your DNS:
   ```
   v=spf1 include:_spf.supabase.com ~all
   ```
3. Add DKIM record (provided by your SMTP provider)
4. Use a professional email service (SendGrid, Mailgun)

### Issue: Link Still Opens Localhost

**Solutions:**
1. Clear browser cache
2. Check `/lib/config.ts` - ensure `PRODUCTION_URL` is correct
3. Redeploy your application
4. Try in incognito mode
5. Check Supabase email template uses `{{ .ConfirmationURL }}` variable

### Issue: Email Not Received

**Solutions:**
1. Check spam/junk folder
2. Check Supabase logs: Dashboard → Logs → Auth Logs
3. Verify email address is correct
4. Wait a few minutes (can be delayed)
5. Check SMTP configuration

### Issue: "Invalid or Expired Link"

**Solutions:**
1. Link expires after 1 hour - request new reset
2. Link can only be used once - request new reset
3. Check if you're logged in - logout first
4. Clear browser cookies

---

## 📧 Example: How Your Email Will Look

```
┌────────────────────────────────────────┐
│    🏪 (Your Logo)                      │
│    ShopSpot POS                        │
│  (Green gradient header)               │
├────────────────────────────────────────┤
│                                        │
│  Hello,                                │
│                                        │
│  We received a request to reset your  │
│  password for your ShopSpot account.   │
│                                        │
│  ┌──────────────────────────────┐     │
│  │   Reset My Password          │     │
│  │  (Green button, clickable)   │     │
│  └──────────────────────────────┘     │
│                                        │
│  ⏰ This link expires in 1 hour        │
│                                        │
│  ⚠️ Didn't request this?               │
│  You can safely ignore this email.     │
│                                        │
├────────────────────────────────────────┤
│  ShopSpot - Cloud POS System          │
│  support@ShopSpot.com                  │
│  © 2024 ShopSpot. All rights reserved. │
└────────────────────────────────────────┘
```

---

## 🎯 Quick Start Summary

### For Development (Right Now):

1. **Update `/lib/config.ts`:**
   ```typescript
   const PRODUCTION_URL = 'https://your-actual-domain.com';
   ```

2. **Go to Supabase Dashboard:**
   - Authentication → Email Templates
   - Select "Reset Password"
   - Copy/paste the ShopSpot template above
   - Change subject to "Reset Your ShopSpot Password"
   - Save

3. **Test:**
   - Request password reset
   - Check email
   - Click link
   - Should work! ✅

### For Production (Before Launch):

1. Set up custom SMTP (SendGrid/Mailgun)
2. Verify your domain
3. Add your logo to email template
4. Update all contact info
5. Test thoroughly

---

## 📚 Additional Resources

### Supabase Email Documentation:
https://supabase.com/docs/guides/auth/auth-email-templates

### SMTP Provider Setup Guides:
- **SendGrid:** https://docs.sendgrid.com/for-developers/sending-email/getting-started-smtp
- **Mailgun:** https://documentation.mailgun.com/en/latest/quickstart-sending.html
- **Amazon SES:** https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html

---

## ✅ Final Result

After completing this guide:

✅ Password reset emails show **ShopSpot branding**  
✅ Reset links open **your production domain** (not localhost)  
✅ Professional, trustworthy email design  
✅ Clear instructions for users  
✅ Security warnings included  
✅ Mobile-responsive email template  
✅ Branded from: "ShopSpot Support"  

**Your users will receive a professional, branded experience!** 🎉

---

**Need Help?**  
If you're stuck at any step, check the Supabase dashboard logs or contact Supabase support. The email customization is straightforward once you know where to find it!
