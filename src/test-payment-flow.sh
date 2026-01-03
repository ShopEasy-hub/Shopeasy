#!/bin/bash

# 🔍 PayStack Payment Flow Test Script
# This script helps you diagnose payment verification issues

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 PayStack Payment Diagnostic"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get project ID
echo "📋 Step 1: Check Supabase Configuration"
echo "─────────────────────────────────────────"
if [ -f "utils/supabase/info.ts" ]; then
    PROJECT_ID=$(grep "projectId" utils/supabase/info.ts | cut -d"'" -f2)
    echo "✅ Project ID: $PROJECT_ID"
else
    echo "❌ Cannot find utils/supabase/info.ts"
    echo "   Please set your PROJECT_ID manually:"
    read -p "   Enter Project ID: " PROJECT_ID
fi
echo ""

# Check Edge Function
echo "📋 Step 2: Check Edge Function Status"
echo "─────────────────────────────────────────"
API_URL="https://${PROJECT_ID}.supabase.co/functions/v1/payments-simple"
echo "Testing: $API_URL"
echo ""

RESPONSE=$(curl -s "$API_URL")
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | grep -q '"status":"ok"'; then
    echo ""
    echo "✅ Edge Function is working!"
else
    echo ""
    echo "❌ Edge Function not responding correctly"
    echo ""
    echo "🔧 To fix this, run:"
    echo "   cd supabase"
    echo "   supabase functions deploy payments-simple"
    echo "   cd .."
    exit 1
fi
echo ""

# Test payment verification
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Step 3: Test Payment Verification"
echo "─────────────────────────────────────────"
echo ""
read -p "Do you have a payment reference to test? (y/n): " HAS_REF

if [ "$HAS_REF" = "y" ] || [ "$HAS_REF" = "Y" ]; then
    read -p "Enter payment reference: " PAYMENT_REF
    echo ""
    echo "🔍 Verifying: $PAYMENT_REF"
    echo "─────────────────────────────────────────"
    
    VERIFY_URL="${API_URL}/paystack/verify/${PAYMENT_REF}"
    VERIFY_RESPONSE=$(curl -s "$VERIFY_URL")
    
    echo "$VERIFY_RESPONSE" | jq '.' 2>/dev/null || echo "$VERIFY_RESPONSE"
    echo ""
    
    if echo "$VERIFY_RESPONSE" | grep -q '"success":true'; then
        echo "✅ Payment verified successfully!"
    else
        echo "❌ Payment verification failed"
        echo ""
        echo "💡 Common Issues:"
        echo "   1. Payment not completed on PayStack"
        echo "   2. Using wrong reference"
        echo "   3. PAYSTACK_SECRET_KEY not set in Edge Function"
        echo ""
        echo "🔧 Check Edge Function secrets:"
        echo "   supabase secrets list"
    fi
else
    echo ""
    echo "💡 To test the payment flow:"
    echo ""
    echo "   1. Go to your app's subscription page"
    echo "   2. Choose a plan and click 'Subscribe Now'"
    echo "   3. Use test card: 4084 0840 8408 4081"
    echo "   4. After payment, copy the reference from the URL"
    echo "   5. Run this script again to verify"
fi
echo ""

# Check logs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Step 4: Monitor Edge Function Logs"
echo "─────────────────────────────────────────"
echo ""
echo "To see real-time logs, run:"
echo ""
echo "   cd supabase"
echo "   supabase functions logs payments-simple --follow"
echo ""
echo "Then make a test payment and watch what happens!"
echo ""

# Environment check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Step 5: Environment Variables"
echo "─────────────────────────────────────────"
echo ""
echo "Required Edge Function secrets:"
echo ""
echo "  ✓ PAYSTACK_SECRET_KEY (test: sk_test_...)"
echo "  ✓ FRONTEND_URL (your deployed site URL)"
echo "  ✓ SUPABASE_URL (auto-set)"
echo "  ✓ SUPABASE_SERVICE_ROLE_KEY (auto-set)"
echo ""
echo "To check/set secrets:"
echo ""
echo "   supabase secrets list"
echo "   supabase secrets set PAYSTACK_SECRET_KEY=sk_test_..."
echo "   supabase secrets set FRONTEND_URL=https://yoursite.com"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Diagnostic Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
