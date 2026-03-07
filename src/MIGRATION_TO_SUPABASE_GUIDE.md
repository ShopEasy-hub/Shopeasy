# 🔄 Migration from Deno KV to Supabase PostgreSQL

## ⚠️ IMPORTANT: Complete Migration Guide

Your ShopSpot POS system is being migrated from **Deno KV Store** to **Supabase PostgreSQL** for better stability, reliability, and scalability.

---

## 📋 Prerequisites

Before starting the migration:

1. ✅ Supabase project created
2. ✅ Project URL and Anon Key available
3. ✅ Database ready to accept migrations
4. ✅ Backup of existing data (if any)

---

## 🚀 Step 1: Run Database Migration

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `/supabase/migrations/001_complete_database_setup.sql`
5. Click **Run** or press `Ctrl/Cmd + Enter`
6. Wait for success message: ✅ ShopSpot database migration completed successfully!

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push

```

---

## 🔐 Step 2: Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Where to find these values:**
1. Open your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy the **Project URL** and **anon/public key**

---

## 🔄 Step 3: Update Imports Across Your App

You need to update imports from the old KV-based API to the new Supabase API.

### Before (Old):
```typescript
import { getProducts, createProduct } from '../lib/api';
```

### After (New):
```typescript
import { getProducts, createProduct } from '../lib/api-supabase';
```

### Files to Update:

- [ ] `/pages/Dashboard.tsx`
- [ ] `/pages/Inventory.tsx`
- [ ] `/pages/POSTerminal.tsx`
- [ ] `/pages/Transfers.tsx`
- [ ] `/pages/Warehouses.tsx`
- [ ] `/pages/Suppliers.tsx`
- [ ] `/pages/ShortDated.tsx`
- [ ] `/pages/Expenses.tsx`
- [ ] `/pages/Returns.tsx`
- [ ] `/pages/Reports.tsx`
- [ ] `/pages/Settings.tsx`
- [ ] `/pages/Users.tsx`

---

## 📝 Step 4: Update Authentication Flow

### Old Login (KV-based):
```typescript
const result = await fetchAPI('/auth/signup', {
  method: 'POST',
  body: JSON.stringify({ email, password, name, orgName })
});
```

### New Login (Supabase):
```typescript
import { signUp, signIn } from '../lib/api-supabase';

// Sign up
const { user, organization } = await signUp(email, password, name, orgName);

// Sign in
const { session, user } = await signIn(email, password);
```

Update `/pages/LoginPage.tsx` and `/pages/SetupPage.tsx` to use the new authentication methods.

---

## 🏢 Step 5: Update Organization & Branch Context

The app state needs to be updated to work with Supabase UUIDs instead of KV string keys.

### Update App.tsx:

```typescript
import { getUserProfile } from './lib/api-supabase';

// On app load, fetch user profile
useEffect(() => {
  async function loadUserProfile() {
    const profile = await getUserProfile();
    setAppState(prev => ({
      ...prev,
      userId: profile.id,
      orgId: profile.organization_id,
      userRole: profile.role,
    }));
  }
  loadUserProfile();
}, []);
```

---

## 🔄 Step 6: Update Inventory Management

### Old (KV Store):
```typescript
await updateStock(branchId, productId, quantity, 'set');
```

### New (Supabase with Upsert):
```typescript
import { upsertInventory } from '../lib/api-supabase';

await upsertInventory(
  orgId,
  productId,
  quantity,
  branchId,  // or undefined for warehouse
  undefined   // or warehouseId for warehouse
);
```

**Benefits:**
- ✅ Automatic duplicate prevention via database constraint
- ✅ Atomic operations with PostgreSQL ACID guarantees
- ✅ No more stock duplication issues
- ✅ Automatic timestamp updates

---

## 📦 Step 7: Update Transfer System

### New Transfer Flow:

```typescript
import { createTransfer, updateTransferStatus } from '../lib/api-supabase';

// Create transfer
const transfer = await createTransfer(
  orgId,
  productId,
  quantity,
  { warehouseId: sourceWarehouse },  // from
  { branchId: targetBranch },         // to
  'Monthly stock replenishment'
);

// Approve and complete transfer (triggers automatic stock update)
await updateTransferStatus(transfer.id, 'completed');
```

**What happens automatically:**
1. Transfer status updated to 'completed'
2. Stock deducted from source (warehouse)
3. Stock added to destination (branch)
4. Timestamps updated
5. All in one atomic transaction!

---

## 📸 Step 8: Enable Supplier Invoice Upload

### Upload Invoice:

```typescript
import { uploadSupplierInvoice } from '../lib/api-supabase';

const handleFileUpload = async (supplierId: string, file: File) => {
  const supplier = await uploadSupplierInvoice(supplierId, file);
  console.log('Invoice uploaded:', supplier.invoice_url);
};
```

### View Invoice:

```typescript
const supplier = await getSuppliers(orgId);
if (supplier.invoice_url) {
  window.open(supplier.invoice_url, '_blank');
}
```

---

## 🔄 Step 9: Add Real-time Subscriptions

Enable real-time updates when inventory or transfers change:

```typescript
import { subscribeToInventoryChanges, subscribeToTransfers } from '../lib/api-supabase';

useEffect(() => {
  // Subscribe to inventory changes
  const inventorySub = subscribeToInventoryChanges(orgId, (payload) => {
    console.log('Inventory changed:', payload);
    // Refresh inventory data
    loadInventory();
  });

  // Subscribe to transfer updates
  const transferSub = subscribeToTransfers(orgId, (payload) => {
    console.log('Transfer updated:', payload);
    // Refresh transfers
    loadTransfers();
  });

  return () => {
    inventorySub.unsubscribe();
    transferSub.unsubscribe();
  };
}, [orgId]);
```

---

## 🧪 Step 10: Testing Checklist

### ✅ Authentication
- [ ] Sign up creates organization + user profile
- [ ] Sign in works with email/password
- [ ] User session persists across page refreshes
- [ ] Sign out clears session

### ✅ Organization & Branches
- [ ] Can create branches
- [ ] Can switch between branches
- [ ] Data filters by selected branch

### ✅ Inventory
- [ ] Can add products
- [ ] Can adjust stock levels
- [ ] Stock persists after page refresh
- [ ] No duplicate stock entries for same product/location
- [ ] Stock shows correctly in different branches

### ✅ Warehouses
- [ ] Can create warehouses
- [ ] Warehouse stock is separate from branch stock
- [ ] Can view warehouse inventory

### ✅ Transfers
- [ ] Can create transfer from warehouse to branch
- [ ] Transfer shows as 'pending'
- [ ] Approving transfer updates both locations automatically
- [ ] Transfer status changes to 'completed'

### ✅ POS Terminal
- [ ] Can add products to cart
- [ ] Stock validation works (can't sell more than available)
- [ ] Completing sale deducts inventory automatically
- [ ] Receipt generated correctly
- [ ] Stock updates show immediately

### ✅ Suppliers
- [ ] Can create suppliers
- [ ] Can upload invoice (file upload)
- [ ] Can view invoice URL
- [ ] Invoice accessible via link

### ✅ Short Dated Products
- [ ] Products with expiry dates show correctly
- [ ] Calculates days until expiry
- [ ] Filters by warning period
- [ ] Shows stock levels

---

## 🐛 Troubleshooting

### Issue: "relation does not exist"
**Solution:** Run the migration SQL again. Make sure you're connected to the correct database.

### Issue: "RLS policy violation"
**Solution:** Check that:
1. User is authenticated
2. User has a profile with organization_id
3. RLS policies are enabled on all tables

### Issue: Stock still duplicating
**Solution:** 
1. Check that you're using `upsertInventory()` instead of direct insert
2. Verify unique constraint exists: `UNIQUE (product_id, branch_id, warehouse_id)`
3. Clear existing duplicates first

### Issue: Stock resets to zero
**Solution:**
1. Ensure you're filtering by `organization_id` AND correct `branch_id`/`warehouse_id`
2. Check that real-time subscriptions are refreshing data correctly

### Issue: Transfers not updating stock
**Solution:**
1. Ensure transfer status is set to 'completed' (not just 'approved')
2. Check trigger `handle_transfer_completion` exists
3. Verify source has enough stock

---

## 📊 Database Performance

### Indexes Created:
- ✅ Products: organization_id, sku, barcode
- ✅ Inventory: organization_id, branch_id, warehouse_id, product_id
- ✅ Transfers: organization_id, from_branch_id, to_branch_id, status
- ✅ Sales: organization_id, branch_id, created_at

### Automatic Triggers:
- ✅ `update_updated_at_column` - Updates timestamps automatically
- ✅ `upsert_inventory` - Prevents duplicate stock entries
- ✅ `complete_transfer` - Auto-updates stock on transfer completion
- ✅ `deduct_sale_inventory` - Auto-deducts stock on sale
- ✅ `add_return_inventory` - Auto-adds stock on return

---

## 🎯 Benefits After Migration

### Before (Deno KV):
- ❌ Stock duplicates frequently
- ❌ Stock resets after refresh
- ❌ Manual stock deduction prone to errors
- ❌ No transaction support
- ❌ Limited query capabilities

### After (Supabase PostgreSQL):
- ✅ **Zero duplicates** - enforced by database constraints
- ✅ **Stock persists** - proper relational database
- ✅ **Automatic stock updates** - via triggers
- ✅ **ACID transactions** - guaranteed consistency
- ✅ **Powerful queries** - with joins and aggregations
- ✅ **Real-time sync** - via Supabase Realtime
- ✅ **Scalable** - handle millions of records
- ✅ **Auditable** - proper logging and timestamps

---

## 🔮 Next Steps

After migration is complete:

1. **Monitor Performance:**
   - Check query speeds in Supabase Dashboard → Database → Query Performance
   - Ensure indexes are being used effectively

2. **Set Up Backups:**
   - Enable Supabase automated backups
   - Schedule daily exports for compliance

3. **Add Analytics:**
   - Use Supabase Edge Functions for custom reporting
   - Integrate with BI tools for advanced analytics

4. **Scale As Needed:**
   - Upgrade Supabase plan for more connections
   - Add read replicas for high-traffic scenarios

---

## 📞 Support

If you encounter issues during migration:

1. Check the Supabase logs: Dashboard → Logs
2. Review browser console for JavaScript errors
3. Test individual API functions in isolation
4. Verify RLS policies are not blocking legitimate access

---

## ✅ Migration Complete Checklist

- [ ] Database migration SQL executed successfully
- [ ] Environment variables configured
- [ ] All imports updated to use `api-supabase.ts`
- [ ] Authentication flow updated
- [ ] Inventory management using upsert
- [ ] Transfer system using new API
- [ ] POS terminal working with new stock system
- [ ] Supplier invoice upload functional
- [ ] Real-time subscriptions enabled
- [ ] All tests passing

---

**🎉 Congratulations!** Your ShopSpot POS is now running on a robust, scalable Supabase PostgreSQL backend with automatic stock management, zero duplicates, and real-time synchronization!
