#!/bin/bash

# Deploy diagnostic function without JWT verification

echo "================================"
echo "Deploying Diagnostic Function"
echo "================================"
echo ""

echo "This function will be publicly accessible (no auth required)"
echo ""

npx supabase functions deploy diagnostic --no-verify-jwt

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Diagnostic function deployed successfully!"
echo ""
echo "Now open diagnostic-dashboard.html in your browser"
echo ""
