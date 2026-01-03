#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 ShopEasy - Complete Deployment Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "App.tsx" ]; then
    echo -e "${RED}❌ Error: App.tsx not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}Step 1: Deploy Edge Function${NC}"
echo "─────────────────────────────────────────────────"
cd supabase

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    exit 1
fi

# Deploy Edge Function
echo "Deploying payments-simple Edge Function..."
supabase functions deploy payments-simple

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Edge Function deployed successfully!${NC}"
else
    echo -e "${RED}❌ Edge Function deployment failed${NC}"
    echo ""
    echo "Common issues:"
    echo "  1. Not logged in: Run 'supabase login'"
    echo "  2. Project not linked: Run 'supabase link'"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Check Environment Variables${NC}"
echo "─────────────────────────────────────────────────"

# List secrets
echo "Current secrets:"
supabase secrets list

echo ""
echo -e "${YELLOW}Required secrets:${NC}"
echo "  ✓ PAYSTACK_SECRET_KEY (sk_test_... or sk_live_...)"
echo "  ✓ FRONTEND_URL (https://your-app.vercel.app)"
echo ""

read -p "Do you need to set PayStack secret key? (y/n): " SET_PAYSTACK
if [ "$SET_PAYSTACK" = "y" ] || [ "$SET_PAYSTACK" = "Y" ]; then
    echo ""
    echo "Get your PayStack secret key from:"
    echo "https://dashboard.paystack.com/#/settings/developers"
    echo ""
    read -p "Enter your PayStack secret key: " PAYSTACK_KEY
    supabase secrets set PAYSTACK_SECRET_KEY="$PAYSTACK_KEY"
    echo -e "${GREEN}✅ PayStack secret key set!${NC}"
fi

echo ""
read -p "Do you need to set Frontend URL? (y/n): " SET_FRONTEND
if [ "$SET_FRONTEND" = "y" ] || [ "$SET_FRONTEND" = "Y" ]; then
    echo ""
    echo "Enter your deployed frontend URL (NO trailing slash)"
    echo "Example: https://shopeasy.vercel.app"
    read -p "Frontend URL: " FRONTEND_URL
    supabase secrets set FRONTEND_URL="$FRONTEND_URL"
    echo -e "${GREEN}✅ Frontend URL set!${NC}"
fi

# Go back to root
cd ..

echo ""
echo -e "${YELLOW}Step 3: Deploy Frontend${NC}"
echo "─────────────────────────────────────────────────"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Git not initialized${NC}"
    echo "Please initialize git and connect to your repository"
    exit 1
fi

# Stage all changes
echo "Staging changes..."
git add .

# Commit
echo "Committing changes..."
git commit -m "Fix: CSS styling and payment verification system" || echo "No changes to commit"

# Push
echo "Pushing to repository..."
git push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
else
    echo -e "${RED}❌ Git push failed${NC}"
    echo "Please check your git configuration and try again"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Wait 2-3 minutes for Vercel to build"
echo "2. Open your app in Incognito mode (Ctrl+Shift+N)"
echo "3. Test payment with card: 4084 0840 8408 4081"
echo ""
echo "🔍 To monitor Edge Function logs in real-time:"
echo "   cd supabase"
echo "   supabase functions logs payments-simple --follow"
echo ""
echo "📊 To test Edge Function:"
echo "   curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/payments-simple"
echo ""
echo -e "${GREEN}✅ All systems ready!${NC}"
echo ""
