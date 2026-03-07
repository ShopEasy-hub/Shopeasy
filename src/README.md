# ShopSpot - Cloud POS System

## 🚨 Having Issues? Start Here!

### Getting "Invalid JWT" errors? Can't login?

**→ Open `JWT_ERROR_FIX.md` for instant fix!** (Just refresh or re-login)

### Stock showing zero? Delete not working? POS/Transfers broken?

**→ Open `START_HERE.md` for the 2-minute fix!**

## Quick Fix Steps

1. **Delete Stock:** Login → Click "Database Status" (sidebar) → Click "Delete All Stock"
2. **Fix Database:** Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup/sql/new) → Run SQL from `CRITICAL_FIX_RUN_THIS_SQL.sql`
3. **Test:** Create a product with stock → Verify it shows correctly
4. **Done!** ✅

## What is ShopSpot?

A comprehensive cloud-based Point of Sale system for multi-branch supermarkets and pharmacies.

### Features

- 🏪 **Multi-Branch Management** - Manage multiple stores from one system
- 💳 **POS Terminal** - Tablet-optimized checkout interface
- 📦 **Inventory Management** - Real-time stock tracking across branches
- 🔄 **Inter-Branch Transfers** - Move stock between locations with approval workflows
- 📊 **Reports & Analytics** - Sales, stock, and business insights
- 👥 **Role-Based Access Control** - Admin, Manager, Cashier, and Auditor roles
- 💊 **Expiry Date Tracking** - Monitor short-dated products (for pharmacies)
- 💰 **Expense Tracking** - Record and categorize business expenses
- 🏭 **Warehouse Management** - Centralized stock distribution
- 🚚 **Supply Chain** - Supplier and purchase order management
- 💳 **Subscription Billing** - Integrated Flutterwave payment gateway

### Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL database, Edge Functions)
- **UI Components:** shadcn/ui
- **Payment:** Flutterwave integration
- **Storage:** Key-value store for fast data access

## Database Status Page

Access via sidebar → "Database Status" to:

- ✅ Check system health
- 🗑️ Delete all stock (reset corrupted data)
- 🔄 Run diagnostics
- 📊 View data status

## Documentation

- `START_HERE.md` - Quick fix guide (START HERE IF ISSUES!)
- `CRITICAL_FIX_RUN_THIS_SQL.sql` - Database security fix
- `FIX_INSTRUCTIONS_READ_NOW.md` - Detailed troubleshooting
- `Attributions.md` - Credits and licenses

## Support

If you need help:
1. Check `START_HERE.md`
2. Check browser console (F12 → Console)
3. Go to Database Status page for diagnostics
4. Share error messages for specific help

## Development

This app uses:
- Supabase project: `pkzpifdocmmzowvjopup`
- Edge Function: `make-server-088c2cd9`
- Database table: `kv_store_088c2cd9`

## Access URLs

- **App:** Your deployed URL
- **Supabase Dashboard:** https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup
- **SQL Editor:** https://supabase.com/dashboard/project/pkzpifdocmmzowvjopup/sql/new
- **Database Status:** Add `?database-status=true` to your app URL

---

**Need immediate help?** → `START_HERE.md`
