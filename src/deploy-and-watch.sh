#!/bin/bash

# Deploy and Watch Script for Payment Callback Debugging
# This script will deploy the Edge Function and watch logs

echo "=================================="
echo "🚀 ShopEasy Payment Debug Script"
echo "=================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Step 1: Deploy function
echo "=================================="
echo "STEP 1: Deploying Edge Function"
echo "=================================="
echo ""

npx supabase functions deploy payments-simple

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed!"
    echo "Please check the error above and try again."
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""

# Step 2: Show instructions
echo "=================================="
echo "STEP 2: What to do next"
echo "=================================="
echo ""
echo "I will now start watching logs in real-time."
echo ""
echo "📋 In another window:"
echo "  1. Go to: https://shopeasy-lemon.vercel.app"
echo "  2. Press F12 to open console"
echo "  3. Try making a payment"
echo "  4. Watch THIS terminal for logs"
echo ""
echo "🔍 Look for these lines:"
echo "  🔍 FRONTEND_URL from env: ..."
echo "  🔍 Callback URL will be: ..."
echo ""
echo "Press Ctrl+C to stop watching logs"
echo ""
echo "=================================="
echo "STEP 3: Watching logs..."
echo "=================================="
echo ""

# Step 3: Watch logs
npx supabase functions logs payments-simple --follow
