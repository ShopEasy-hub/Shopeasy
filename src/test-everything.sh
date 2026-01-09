#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 ShopEasy - Complete Diagnostic Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ID="ajvbefzqcmkdpskjdkui"
API_URL="https://${PROJECT_ID}.supabase.co/functions/v1/payments-simple"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 TEST 1: Edge Function Status${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Testing: $API_URL"
echo ""

RESPONSE=$(curl -s "$API_URL" 2>&1)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL" 2>&1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Edge Function is responding!${NC}"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
    echo -e "${RED}❌ Edge Function not responding properly (HTTP $HTTP_CODE)${NC}"
    echo "$RESPONSE"
    echo ""
    echo -e "${YELLOW}Fix: Deploy the Edge Function${NC}"
    echo "   cd supabase"
    echo "   supabase functions deploy payments-simple"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 TEST 2: Edge Function Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd supabase 2>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Supabase folder not found${NC}"
    echo "Make sure you're in the project root directory"
    exit 1
fi

echo "Checking deployed functions..."
FUNCTIONS=$(supabase functions list 2>&1)

if echo "$FUNCTIONS" | grep -q "payments-simple"; then
    echo -e "${GREEN}✅ payments-simple is deployed${NC}"
else
    echo -e "${RED}❌ payments-simple NOT deployed${NC}"
    echo ""
    echo -e "${YELLOW}Fix: Deploy it now${NC}"
    echo "   supabase functions deploy payments-simple"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 TEST 3: Environment Variables${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Checking secrets..."
SECRETS=$(supabase secrets list 2>&1)

echo "$SECRETS"
echo ""

if echo "$SECRETS" | grep -q "PAYSTACK_SECRET_KEY"; then
    echo -e "${GREEN}✅ PAYSTACK_SECRET_KEY is set${NC}"
else
    echo -e "${RED}❌ PAYSTACK_SECRET_KEY is NOT set${NC}"
    echo ""
    echo -e "${YELLOW}Fix: Set your PayStack key${NC}"
    echo "   supabase secrets set PAYSTACK_SECRET_KEY=sk_test_YOUR_KEY"
    echo ""
    echo "Get your key from:"
    echo "   https://dashboard.paystack.com/#/settings/developers"
fi

echo ""

if echo "$SECRETS" | grep -q "FRONTEND_URL"; then
    echo -e "${GREEN}✅ FRONTEND_URL is set${NC}"
    FRONTEND_URL=$(echo "$SECRETS" | grep "FRONTEND_URL" | awk '{print $2}')
    if echo "$FRONTEND_URL" | grep -q "localhost"; then
        echo -e "${YELLOW}⚠️  WARNING: FRONTEND_URL is localhost!${NC}"
        echo "   This won't work in production"
        echo "   Change to: https://your-app.vercel.app"
    fi
else
    echo -e "${RED}❌ FRONTEND_URL is NOT set${NC}"
    echo ""
    echo -e "${YELLOW}Fix: Set your frontend URL${NC}"
    echo "   supabase secrets set FRONTEND_URL=https://your-app.vercel.app"
fi

cd ..

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 TEST 4: CSS Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "styles/globals.css" ]; then
    FIRST_LINE=$(head -n 1 styles/globals.css)
    
    if echo "$FIRST_LINE" | grep -q "@tailwind"; then
        echo -e "${GREEN}✅ Using Tailwind v3 syntax (stable)${NC}"
    elif echo "$FIRST_LINE" | grep -q "@import.*tailwindcss"; then
        echo -e "${YELLOW}⚠️  Using Tailwind v4 syntax${NC}"
        echo "   This might cause build issues"
        echo "   Consider reverting to v3 syntax"
    else
        echo -e "${RED}❌ CSS file doesn't start with Tailwind import${NC}"
    fi
else
    echo -e "${RED}❌ styles/globals.css not found${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 TEST 5: Build Files${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

FILES=("index.html" "main.tsx" "App.tsx")

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}📊 DIAGNOSTIC SUMMARY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔍 What to do next:"
echo ""
echo "1. If Edge Function failed → Deploy it:"
echo "   cd supabase && supabase functions deploy payments-simple"
echo ""
echo "2. If secrets missing → Set them:"
echo "   supabase secrets set PAYSTACK_SECRET_KEY=sk_test_..."
echo "   supabase secrets set FRONTEND_URL=https://your-app.vercel.app"
echo ""
echo "3. Deploy frontend:"
echo "   git add . && git commit -m 'Fix CSS and payments' && git push"
echo ""
echo "4. Test payment with logs:"
echo "   cd supabase"
echo "   supabase functions logs payments-simple --follow"
echo "   (then make test payment in another window)"
echo ""
echo "5. Test card: 4084 0840 8408 4081 (12/25, CVV: 123)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
