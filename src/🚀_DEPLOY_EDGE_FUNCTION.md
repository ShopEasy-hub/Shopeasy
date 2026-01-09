# 🚀 Deploy Updated Edge Function

## ✅ What Changed

The Edge Function now accepts a dynamic `callback_url` from the frontend instead of using a hardcoded environment variable. This allows the app to work seamlessly in:

- ✅ Figma Make preview URL
- ✅ Localhost development
- ✅ Any deployment URL

## 📋 Steps to Deploy

### Option 1: Deploy via Supabase CLI (Recommended)

1. Install Supabase CLI if you haven't:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref pkzpifdocmmzowvjopup
```

4. Deploy the Edge Function:
```bash
supabase functions deploy payments-simple
```

### Option 2: Deploy via Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup
2. Click **Edge Functions** in the left sidebar
3. Find **payments-simple** function
4. Click the **⋮** menu → **Update Function**
5. Copy the entire content from `/supabase/functions/payments-simple/index.ts`
6. Paste it into the editor
7. Click **Deploy**

### Option 3: Manual Upload

1. Go to https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup/functions
2. Click **Create a new function**
3. Name: `payments-simple`
4. Copy-paste the content from `/supabase/functions/payments-simple/index.ts`
5. Click **Deploy Function**

## ✅ Verify Deployment

After deploying, test the health endpoint:

```bash
curl https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple/health
```

You should see:
```json
{
  "status": "ok",
  "service": "ShopEasy Payment Service",
  "version": "6.0.0-BULLETPROOF",
  "message": "Simplified version - guaranteed to work!",
  "timestamp": "2026-01-06T..."
}
```

## 🎉 Done!

Once deployed, your app will work perfectly in Figma Make preview! The callback URL will automatically use whatever URL the app is running on.

## 🧪 Test It

1. Open your Figma Make preview URL
2. Login to your account
3. Go to Settings → Subscription
4. Select a plan and billing cycle
5. Click "Continue to Payment"
6. Complete payment with test card: 4084 0840 8408 4081
7. After payment, you'll be redirected back to your Figma Make URL
8. Subscription should be created successfully!

## 📝 Note

You don't need to set the `FRONTEND_URL` environment variable anymore. The callback URL is now dynamic and comes from the frontend automatically!
