#!/bin/bash

# 🚀 Deploy Payment Fix - Redeploy Edge Function
# This will fix the 401 error on payment verification

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Deploying Payment Verification Fix"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📋 What this does:"
echo "  ✅ Redeploys the Edge Function with NO AUTH on verify endpoint"
echo "  ✅ Adds more logging to debug the issue"
echo "  ✅ Should fix the 401 Unauthorized error"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not installed!"
    echo "Install it: npm install -g supabase"
    exit 1
fi

# Check if project is linked
echo "🔍 Checking Supabase project link..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase!"
    echo "Run: supabase login"
    exit 1
fi

# Deploy the function
echo ""
echo "🚀 Deploying payments-simple Edge Function..."
echo ""

supabase functions deploy payments-simple --no-verify-jwt

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Deployment Successful!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Go back to your payment page"
    echo "  2. Refresh the page (F5)"
    echo "  3. Try the payment verification again"
    echo ""
    echo "🔍 To check logs:"
    echo "  supabase functions logs payments-simple --tail"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Check the error message above"
    exit 1
fi
