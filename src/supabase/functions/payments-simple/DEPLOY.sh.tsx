#!/bin/bash

# 🚀 Quick Deploy Script for payments-simple Edge Function
# This deploys the updated function with dynamic callback URL support

echo "🚀 Deploying payments-simple Edge Function..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "📥 Install it with:"
    echo "   npm install -g supabase"
    echo ""
    echo "Or deploy manually via Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup/functions"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
if ! supabase projects list &> /dev/null
then
    echo "🔐 Logging in to Supabase..."
    supabase login
fi

echo "🔗 Linking to project..."
supabase link --project-ref pkzpifdocmmzowvjopup

echo ""
echo "📦 Deploying function..."
supabase functions deploy payments-simple

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🧪 Test the health endpoint:"
echo "   curl https://pkzpifdocmmzowvjopup.supabase.co/functions/v1/payments-simple/health"
echo ""
echo "🎉 Your app now works with Figma Make preview URL!"
