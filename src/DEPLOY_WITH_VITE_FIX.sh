#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 ShopEasy - Complete Fix Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Verifying Configuration Files${NC}"
echo "─────────────────────────────────────────────────"

FILES=("vite.config.ts" "package.json" "tsconfig.json" "tailwind.config.js" "postcss.config.js")
ALL_EXIST=true

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
        ALL_EXIST=false
    fi
done

echo ""

if [ "$ALL_EXIST" = false ]; then
    echo -e "${RED}❌ Some config files are missing!${NC}"
    echo "This script should have created them."
    echo "Please check the previous output for errors."
    exit 1
fi

echo -e "${GREEN}✅ All configuration files present!${NC}"
echo ""

echo -e "${BLUE}Step 2: Checking Git Status${NC}"
echo "─────────────────────────────────────────────────"

if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not a git repository${NC}"
    echo ""
    echo "Initialize git first:"
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    exit 1
fi

echo -e "${GREEN}✅ Git repository detected${NC}"
echo ""

echo -e "${BLUE}Step 3: Staging Changes${NC}"
echo "─────────────────────────────────────────────────"

git add .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Changes staged${NC}"
else
    echo -e "${RED}❌ Failed to stage changes${NC}"
    exit 1
fi

echo ""

echo -e "${BLUE}Step 4: Committing Changes${NC}"
echo "─────────────────────────────────────────────────"

git commit -m "Fix: Add Vite config, Tailwind v3, and build setup for Figma Make compatibility" || echo "No changes to commit (already committed)"

echo ""

echo -e "${BLUE}Step 5: Pushing to Repository${NC}"
echo "─────────────────────────────────────────────────"

git push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Pushed to repository successfully!${NC}"
else
    echo -e "${RED}❌ Failed to push${NC}"
    echo ""
    echo "Common issues:"
    echo "  1. No remote configured: git remote add origin <URL>"
    echo "  2. Not authenticated: Check git credentials"
    echo "  3. Branch protection: May need to push to different branch"
    exit 1
fi

echo ""

echo -e "${BLUE}Step 6: Deploying Edge Function${NC}"
echo "─────────────────────────────────────────────────"

cd supabase

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Supabase folder not found, skipping Edge Function deployment${NC}"
    cd ..
else
    echo "Deploying payments-simple Edge Function..."
    supabase functions deploy payments-simple
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Edge Function deployed!${NC}"
    else
        echo -e "${YELLOW}⚠️  Edge Function deployment failed${NC}"
        echo "You may need to deploy it manually"
    fi
    
    echo ""
    echo -e "${YELLOW}Checking environment variables...${NC}"
    supabase secrets list
    
    cd ..
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 What Happens Next:"
echo ""
echo "1. ⏰ Vercel will build your app (2-3 minutes)"
echo "2. 🎨 UI should render with full styling (no more 'alphabets'!)"
echo "3. 💳 Payment verification should work (if Edge Function deployed)"
echo ""
echo "🧪 Test Your Deployment:"
echo ""
echo "1. Wait 2-3 minutes for Vercel to finish building"
echo "2. Open your app in Incognito mode (Ctrl+Shift+N)"
echo "3. Check if design is back ✅"
echo "4. Test payment:"
echo "   - Login → Settings → Subscription"
echo "   - Card: 4084 0840 8408 4081"
echo "   - Expiry: 12/25, CVV: 123"
echo ""
echo "🔍 If Payment Still Fails:"
echo ""
echo "cd supabase"
echo "supabase secrets set PAYSTACK_SECRET_KEY=sk_test_YOUR_KEY"
echo "supabase secrets set FRONTEND_URL=https://your-app.vercel.app"
echo "supabase functions logs payments-simple --follow"
echo ""
echo "Then test payment and watch the logs!"
echo ""
echo -e "${GREEN}✅ You're all set!${NC}"
echo ""
