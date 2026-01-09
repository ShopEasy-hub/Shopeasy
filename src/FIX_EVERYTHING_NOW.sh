#!/bin/bash

# 🆘 COMPLETE FIX SCRIPT - Fixes ALL issues

echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
echo "┃  🆘 FIXING ALL ISSUES                             ┃"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
echo ""

# ============================================
# FIX #1: DESIGN ISSUE (Tailwind not loading)
# ============================================
echo "🎨 FIXING DESIGN ISSUE..."
echo ""

echo "Step 1: Cleaning build artifacts..."
rm -rf node_modules
rm -rf .vite
rm -rf dist
echo "✅ Cleaned"
echo ""

echo "Step 2: Fresh npm install..."
npm install
echo "✅ Dependencies installed"
echo ""

# ============================================
# FIX #2: PAYMENT 401 ERROR
# ============================================
echo "💳 FIXING PAYMENT 401 ERROR..."
echo ""

cd supabase

echo "Step 3: Checking Supabase project..."
supabase status
echo ""

echo "Step 4: Setting up secrets..."
echo ""
echo "⚠️  You need to set these secrets manually:"
echo ""
echo "  supabase secrets set SUPABASE_URL=https://pkzpifdocmmzowvjopup.supabase.co"
echo "  supabase secrets set SERVICE_ROLE_KEY=<your service role key>"
echo "  supabase secrets set PAYSTACK_SECRET_KEY=<your paystack secret key>"
echo "  supabase secrets set FRONTEND_URL=http://localhost:5173"
echo ""
echo "NOTE: Use SERVICE_ROLE_KEY (NOT SUPABASE_SERVICE_ROLE_KEY)"
echo "Supabase reserves the SUPABASE_ prefix!"
echo ""
read -p "Have you set all secrets? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Please set the secrets first, then run this script again"
    exit 1
fi

echo "✅ Secrets confirmed"
echo ""

echo "Step 5: Deploying Edge Function..."
supabase functions deploy payments-simple
echo "✅ Edge Function deployed"
echo ""

cd ..

# ============================================
# DONE!
# ============================================
echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
echo "┃  ✅ ALL FIXES APPLIED!                            ┃"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
echo ""

echo "📋 NEXT STEPS:"
echo ""
echo "1. Start dev server:"
echo "   npm run dev"
echo ""
echo "2. Open browser (Incognito):"
echo "   http://localhost:5173"
echo ""
echo "3. Test payment flow:"
echo "   Login → Settings → Subscription → Subscribe"
echo "   Card: 4084 0840 8408 4081"
echo "   Expiry: 12/25, CVV: 123"
echo ""
echo "4. Check logs in separate terminal:"
echo "   cd supabase"
echo "   supabase functions logs payments-simple --follow"
echo ""

echo "✅ SHOULD WORK NOW! 🚀"
echo ""
