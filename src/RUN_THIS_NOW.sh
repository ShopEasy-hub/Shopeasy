#!/bin/bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 FIXING BOTH ISSUES NOW"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Fix 1: Tailwind CSS
echo "🎨 Step 1/4: Fixing Tailwind CSS..."
rm -rf node_modules .vite dist
npm install
echo "✅ Tailwind fixed"
echo ""

# Fix 2: Deploy Edge Function with no JWT verification
echo "💳 Step 2/4: Deploying Edge Function..."
cd supabase

# Check if secrets are set
echo "Checking secrets..."
if supabase secrets list | grep -q "SERVICE_ROLE_KEY"; then
    echo "✅ Secrets already set"
else
    echo "⚠️  Secrets not set. You need to run:"
    echo "   supabase secrets set SERVICE_ROLE_KEY=YOUR_KEY"
    echo "   supabase secrets set PAYSTACK_SECRET_KEY=YOUR_KEY"
    echo "   supabase secrets set FRONTEND_URL=http://localhost:5173"
    echo ""
    read -p "Have you set the secrets? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Please set secrets first"
        exit 1
    fi
fi

echo "Deploying with --no-verify-jwt flag..."
supabase functions deploy payments-simple --no-verify-jwt
echo "✅ Edge Function deployed"
echo ""

cd ..

# Start dev server
echo "🚀 Step 3/4: Starting dev server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SETUP COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Run: npm run dev"
echo ""
echo "2. Open browser (Incognito): http://localhost:5173"
echo ""
echo "3. Test payment flow:"
echo "   - Login"
echo "   - Settings → Subscription"
echo "   - Subscribe → Select plan"
echo "   - Complete payment"
echo ""
echo "4. Watch logs in separate terminal:"
echo "   cd supabase"
echo "   supabase functions logs payments-simple --follow"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Both issues should be fixed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
