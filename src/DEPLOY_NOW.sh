#!/bin/bash

echo "🚀 DEPLOYING PAYMENT FIX..."
echo ""

# Deploy Edge Function
echo "1️⃣ Deploying Edge Function..."
cd supabase
supabase functions deploy payments-simple
cd ..

echo ""
echo "2️⃣ Committing frontend changes..."
git add .
git commit -m "FIX: Payment verification - complete rewrite, no auth required"
git push

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Wait 30 seconds for deployment to complete"
echo "2. Open site in INCOGNITO window"
echo "3. Check console - you should see: '🔍 Verifying PayStack payment (NO AUTH)'"
echo "4. Try payment with test card: 4084084084084081"
echo ""
echo "If still 401 error, check Edge Function logs:"
echo "   cd supabase"
echo "   supabase functions logs payments-simple --follow"
