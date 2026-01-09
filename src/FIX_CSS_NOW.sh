#!/bin/bash

echo "================================================"
echo "    SHOPEASY CSS FIX - Automated Repair"
echo "================================================"
echo ""

echo "[1/4] Stopping any running processes..."
pkill -9 node 2>/dev/null || echo "   - No running node processes"
sleep 1

echo "[2/4] Clearing Vite cache..."
if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    echo "   - Vite cache cleared"
else
    echo "   - No Vite cache found"
fi

echo "[3/4] Clearing build directory..."
if [ -d "dist" ]; then
    rm -rf dist
    echo "   - Build directory cleared"
else
    echo "   - No build directory found"
fi

echo "[4/4] Starting dev server..."
echo ""
echo "================================================"
echo " Open http://localhost:3000 in your browser"
echo " You should see a DIAGNOSTIC PAGE with tests"
echo "================================================"
echo ""
npm run dev
