# ShopSpot Database Structure 2025

## 🎯 Current Database Architecture

ShopSpot has been **completely migrated** from a KV store to proper PostgreSQL tables.

### ❌ OLD System (DEPRECATED)
- **Table**: `kv_store_088c2cd9`
- **Type**: Key-Value store
- **API**: `/lib/api.ts`
- **Status**: **DEPRECATED - DO NOT USE**

### ✅ NEW System (ACTIVE)
- **Tables**: Proper PostgreSQL relational tables
- **API**: `/lib/api-supabase.ts`
- **Status**: **ACTIVE - USE THIS**

---

## 📊 Current Database Tables

### Core Tables

#### 1. **organizations**
Stores multi-tenant organization data
```sql
- id (UUID)
- name (TEXT)
- logo (TEXT)
- subscription_plan (TEXT)
- subscription_status (TEXT)
- subscription_expires_at (TIMESTAMPTZ)
- owner_id (UUID → auth.users)
- created_at, updated_at
```

#### 2. **user_profiles**
User information with role-based access
```sql
- id (UUID → auth.users)
- organization_id (UUID → organizations)
- name (TEXT)
- email (TEXT)
- role (TEXT: owner, admin, manager, cashier, auditor)
- status (TEXT: active, inactive)
- branch_id (UUID → branches)
- created_at, updated_at
```

#### 3. **branches**
Physical store locations
```sql
- id (UUID)
- organization_id (UUID → organizations)
- name (TEXT)
- location (TEXT)
- is_active (BOOLEAN)
- created_at, updated_at
```

#### 4. **warehouses**
Centralized storage facilities
```sql
- id (UUID)
- organization_id (UUID → organizations)
- name (TEXT)
- location (TEXT)
- is_active (BOOLEAN)
- created_at, updated_at
```

#### 5. **products**
Product master data
```sql
- id (UUID)
- organization_id (UUID → organizations)
- name (TEXT)
- barcode (TEXT, UNIQUE per org)
- category (TEXT)
- unit (TEXT)
- cost_price (NUMERIC)
- selling_price (NUMERIC)
- reorder_level (INTEGER)
- supplier_id (UUID → suppliers)
- created_at, updated_at
```

#### 6. **inventory**
Branch-level stock tracking
```sql
- id (UUID)
- product_id (UUID → products)
- branch_id (UUID → branches)
- quantity (INTEGER)
- expiry_date (DATE)
- updated_at
```

#### 7. **stock**
Warehouse-level stock tracking
```sql
- id (UUID)
- product_id (UUID → products)
- warehouse_id (UUID → warehouses)
- quantity (INTEGER)
- expiry_date (DATE)
- updated_at
```

#### 8. **transfers**
Inter-location stock transfers
```sql
- id (UUID)
- organization_id (UUID → organizations)
- from_location_type (TEXT: warehouse, branch)
- from_location_id (UUID)
- to_location_type (TEXT: warehouse, branch)
- to_location_id (UUID)
- status (TEXT: pending, approved, in_transit, received, rejected)
- requested_by (UUID → user_profiles)
- approved_by (UUID → user_profiles)
- created_at, updated_at
```

#### 9. **transfer_items**
Individual items in transfers
```sql
- id (UUID)
- transfer_id (UUID → transfers)
- product_id (UUID → products)
- quantity (INTEGER)
- expiry_date (DATE)
```

#### 10. **sales**
Sales transactions
```sql
- id (UUID)
- organization_id (UUID → organizations)
- branch_id (UUID → branches)
- total_amount (NUMERIC)
- payment_method (TEXT)
- served_by (UUID → user_profiles)
- created_at
```

#### 11. **sale_items**
Individual items in sales
```sql
- id (UUID)
- sale_id (UUID → sales)
- product_id (UUID → products)
- quantity (INTEGER)
- unit_price (NUMERIC)
- subtotal (NUMERIC)
```

#### 12. **returns**
Product returns/refunds
```sql
- id (UUID)
- organization_id (UUID → organizations)
- branch_id (UUID → branches)
- sale_id (UUID → sales)
- product_id (UUID → products)
- quantity (INTEGER)
- amount (NUMERIC)
- reason (TEXT)
- processed_by (UUID → user_profiles)
- created_at
```

#### 13. **expenses**
Business expenses tracking
```sql
- id (UUID)
- organization_id (UUID → organizations)
- branch_id (UUID → branches)
- category (TEXT)
- amount (NUMERIC)
- description (TEXT)
- date (DATE)
- recorded_by (UUID → user_profiles)
- created_at
```

#### 14. **suppliers**
Supplier information
```sql
- id (UUID)
- organization_id (UUID → organizations)
- name (TEXT)
- contact (TEXT)
- email (TEXT)
- address (TEXT)
- invoice_path (TEXT)
- created_at, updated_at
```

#### 15. **audit_logs** ⭐ NEW
Audit trail for compliance and product history
```sql
- id (UUID)
- organization_id (UUID → organizations)
- user_id (UUID → auth.users)
- action (TEXT: sale, update, delete, transfer, etc.)
- entity_type (TEXT: product, sale, inventory, etc.)
- entity_id (UUID)
- changes (JSONB: before/after values)
- ip_address (TEXT)
- user_agent (TEXT)
- created_at
```

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with policies for:
- ✅ Multi-tenant isolation (users only see their org's data)
- ✅ Role-based access control
- ✅ Service role has full access (for backend operations)

---

## 🚀 How to Use

### ✅ Correct Way
```typescript
// Import from api-supabase
import { getProducts, createProduct, upsertInventory } from '../lib/api-supabase';

// Use the functions
const products = await getProducts();
await createProduct(productData);
await upsertInventory(branchId, productId, quantity);
```

### ❌ Wrong Way (DO NOT DO THIS)
```typescript
// DON'T import from old API
import { getProducts } from '../lib/api'; // ❌ WRONG!

// DON'T reference kv_store table
const data = await supabase.from('kv_store_088c2cd9').select(); // ❌ WRONG!
```

---

## 🔄 Migration Status

| Component | Status | API Used |
|-----------|--------|----------|
| Authentication | ✅ Migrated | api-supabase |
| Products | ✅ Migrated | api-supabase |
| Inventory | ✅ Migrated | api-supabase |
| Stock | ✅ Migrated | api-supabase |
| Transfers | ✅ Migrated | api-supabase |
| Sales | ✅ Migrated | api-supabase |
| Returns | ✅ Migrated | api-supabase |
| Expenses | ✅ Migrated | api-supabase |
| Suppliers | ✅ Migrated | api-supabase |
| Users | ✅ Migrated | api-supabase |
| Warehouses | ✅ Migrated | api-supabase |
| Branches | ✅ Migrated | api-supabase |
| Settings | ✅ Migrated | api-supabase |
| Audit Logs | ✅ Migrated | api-supabase |
| Admin Panel | ✅ Migrated | api-supabase |
| Super Admin | ✅ Migrated | api-supabase |
| Product History | ✅ Migrated | api-supabase |

---

## 🎯 SQL Migrations

Choose **ONE** of these to run:

### Option 1: Fresh Install (Recommended)
```bash
# File: /supabase/migrations/000_CLEAN_REBUILD_2025.sql
# Use this for: New projects or complete rebuild
```

### Option 2: Hybrid Migration
```bash
# File: /supabase/migrations/HYBRID_MIGRATION.sql
# Use this for: Existing databases (preserves data)
```

### Option 3: Product History Only
```bash
# File: /supabase/migrations/ADD_PRODUCT_HISTORY_AUDIT.sql
# Use this for: Adding audit_logs table only
```

---

## 📁 File Structure

```
/lib/
  ├── api-supabase.ts    ✅ USE THIS (NEW)
  ├── api.ts             ❌ DEPRECATED (OLD)
  ├── supabase.ts        ✅ Supabase client
  └── payment.ts         ✅ Payment integration

/supabase/
  ├── migrations/
  │   ├── 000_CLEAN_REBUILD_2025.sql    ← Fresh install
  │   ├── CLEAN_REBUILD_2025.sql        ← Same as above
  │   ├── HYBRID_MIGRATION.sql          ← Existing DB
  │   └── ADD_PRODUCT_HISTORY_AUDIT.sql ← Audit logs only
  └── functions/
      └── server/
          ├── index.tsx        ← Edge function (not used)
          └── kv_store.tsx     ← DEPRECATED
```

---

## 🛡️ Important Notes

1. **KV Store Table Removed**
   - The `kv_store_088c2cd9` table is NO LONGER USED
   - All references have been removed
   - Edge functions are deprecated

2. **API Migration Complete**
   - All pages now use `api-supabase.ts`
   - Old `api.ts` is kept for reference only
   - No code should import from old API

3. **Database Triggers Active**
   - Auto-sync between warehouse stock and branch inventory
   - Automatic inventory deduction on sales
   - Transfer completion updates stock levels
   - All handled by PostgreSQL triggers

4. **Real-time Subscriptions**
   - Inventory changes broadcast to all connected clients
   - Transfer status updates in real-time
   - Sales updates dashboard automatically

---

## 🔍 Verification

To verify your database is properly set up:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should show:
-- audit_logs
-- branches
-- expenses
-- inventory
-- organizations
-- products
-- returns
-- sale_items
-- sales
-- stock
-- suppliers
-- transfer_items
-- transfers
-- user_profiles
-- warehouses

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND rowsecurity = true;

-- Check triggers exist
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

---

## 📞 Support

If you see errors about `kv_store_088c2cd9`:
1. ✅ Ensure you've run the migration SQL
2. ✅ Verify all code uses `api-supabase.ts`
3. ✅ Clear browser cache and refresh
4. ✅ Check Supabase dashboard for table existence

---

**Last Updated**: November 2, 2025
**Database Version**: 2.0 (PostgreSQL)
**Migration Status**: ✅ Complete
