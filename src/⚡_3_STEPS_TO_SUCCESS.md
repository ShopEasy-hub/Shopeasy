# ⚡ 3 Steps to Success

## Fix ALL Stock Issues in 15 Minutes! 🎯

---

## Step 1️⃣: Run Database Migration (5 min)

### **What to do:**

1. **Open** → https://supabase.com/dashboard
2. **Click** → Your project
3. **Click** → "SQL Editor" (left sidebar)
4. **Click** → "New Query"
5. **Open file** → `/supabase/migrations/HYBRID_MIGRATION.sql`
6. **Copy ALL** → Ctrl/Cmd + A, then Ctrl/Cmd + C
7. **Paste** → Into SQL Editor
8. **Click RUN** → Or press Ctrl/Cmd + Enter

### **What you'll see:**

```
✅ ShopSpot HYBRID migration completed!
📊 Tables: organizations, branches, warehouses, products...
🔒 RLS policies: ENABLED on all tables
⚙️ Triggers: inventory upsert, transfer completion...
```

### **Verify it worked:**

1. **Click** → "Table Editor" (left sidebar)
2. **Check** → You should see these tables:
   - organizations ✅
   - branches ✅
   - warehouses ✅
   - products ✅
   - suppliers ✅
   - inventory ✅ (renamed from 'stock')
   - transfers ✅
   - sales ✅
   - sale_items ✅
   - user_profiles ✅ (renamed from 'user_organizations')
   - expenses ✅
   - returns ✅

**✅ Step 1 Complete!** Database is ready!

---

## Step 2️⃣: Update Credentials (2 min)

### **What to do:**

1. **In Supabase Dashboard** → Settings → API
2. **Copy:**
   - Project URL (e.g., `https://abc123.supabase.co`)
   - anon/public key (long string starting with `eyJ...`)

3. **Open** → `/utils/supabase/info.tsx`
4. **Replace:**
   ```typescript
   export const projectId = 'abc123'; // YOUR PROJECT ID
   export const publicAnonKey = 'eyJ...'; // YOUR ANON KEY
   ```

**✅ Step 2 Complete!** Credentials configured!

---

## Step 3️⃣: Update Code (5-10 min)

### **Files to update:**

Update imports in these files:

```typescript
// ❌ OLD (Broken)
import { getProducts } from '../lib/api';

// ✅ NEW (Fixed!)
import { getProducts } from '../lib/api-supabase';
```

### **List of files:**

1. **`/pages/LoginPage.tsx`**
   ```typescript
   import { signIn, signUp } from '../lib/api-supabase';
   ```

2. **`/pages/Inventory.tsx`**
   ```typescript
   import { getProducts, upsertInventory, getInventory } from '../lib/api-supabase';
   ```

3. **`/pages/POSTerminal.tsx`**
   ```typescript
   import { getProducts, createSale, getInventory } from '../lib/api-supabase';
   ```

4. **`/pages/Transfers.tsx`**
   ```typescript
   import { getTransfers, createTransfer, updateTransferStatus } from '../lib/api-supabase';
   ```

5. **`/pages/Warehouses.tsx`**
   ```typescript
   import { getWarehouses, createWarehouse, getInventory } from '../lib/api-supabase';
   ```

6. **`/pages/Suppliers.tsx`**
   ```typescript
   import { getSuppliers, createSupplier, uploadSupplierInvoice } from '../lib/api-supabase';
   ```

7. **`/pages/Dashboard.tsx`**
   ```typescript
   import { getProducts, getSales, getExpenses, getInventory } from '../lib/api-supabase';
   ```

### **Key changes:**

**Inventory.tsx - Stock adjustment:**
```typescript
// ❌ OLD
await updateStock(branchId, productId, quantity, 'set');

// ✅ NEW - Prevents duplicates!
await upsertInventory(appState.orgId, productId, quantity, branchId);
```

**POSTerminal.tsx - Create sale:**
```typescript
// ❌ OLD
await fetchAPI('/sales', { method: 'POST', body: ... });

// ✅ NEW - Auto-deducts inventory!
await createSale({
  orgId: appState.orgId,
  branchId: appState.currentBranchId,
  items: cartItems,
  total,
  paymentMethod,
  // ... other fields
});
```

**Transfers.tsx - Complete transfer:**
```typescript
// ✅ NEW - Auto-syncs stock!
await updateTransferStatus(transferId, 'completed');
```

**Suppliers.tsx - Upload invoice:**
```typescript
// ✅ NEW - File upload!
const handleFileUpload = async (supplierId: string, file: File) => {
  await uploadSupplierInvoice(supplierId, file);
};
```

**✅ Step 3 Complete!** Code updated!

---

## Test! 🧪 (3 min)

### **1. Restart Dev Server**
```bash
npm run dev
```

### **2. Test Stock Persistence**
1. Add product
2. Add stock (100 units)
3. **Refresh page (F5)**
4. Stock still there? → **✅ PASS!**

### **3. Test No Duplicates**
1. Adjust same product stock again (change to 150)
2. Open Supabase → Table Editor → inventory
3. Only ONE row for this product? → **✅ PASS!**

### **4. Test POS Sale**
1. Make a sale (sell 5 units)
2. Check inventory
3. Stock decreased by 5? → **✅ PASS!**

### **5. Test Transfer**
1. Create transfer: Warehouse → Branch (50 units)
2. Set status to 'completed'
3. Both locations updated? → **✅ PASS!**

---

## 🎉 Success!

### **You now have:**

✅ **Zero stock duplicates** - Impossible by database design
✅ **Stock persists forever** - Never resets to zero
✅ **Auto warehouse sync** - Transfers work automatically
✅ **Auto POS deduction** - Sales deduct stock automatically
✅ **Invoice upload** - Full file management
✅ **Multi-tenant security** - Complete data isolation
✅ **Production ready** - Enterprise-grade database

### **All your stock issues are SOLVED!** 🎯

---

## Need More Details?

**Step-by-step guide:** [🎯 FINAL_MIGRATION_STEPS.md](/🎯_FINAL_MIGRATION_STEPS.md)

**Quick start:** [⚡ QUICK_START.md](/⚡_QUICK_START.md)

**Technical details:** [🎯 COMPLETE_REBUILD_SUMMARY.md](/🎯_COMPLETE_REBUILD_SUMMARY.md)

**All documentation:** [📚 DOCUMENTATION_INDEX.md](/📚_DOCUMENTATION_INDEX.md)

---

## Troubleshooting

### "Stock still resets!"
- Check you updated imports to `api-supabase.ts`
- Verify Supabase credentials are correct

### "I see duplicates!"
- Verify migration ran successfully
- Use `upsertInventory()` function
- Check unique constraint exists

### "Transfer doesn't work!"
- Set status to 'completed' (not 'approved')
- Verify trigger exists in Supabase

### "POS doesn't deduct!"
- Check trigger exists
- Verify product exists in inventory
- Ensure correct branch_id

**Full troubleshooting:** [🎯 FINAL_MIGRATION_STEPS.md](/🎯_FINAL_MIGRATION_STEPS.md)

---

## That's It! 🚀

**3 simple steps.**
**15 minutes total.**
**ALL stock issues fixed.**

**Your ShopSpot POS is now production-ready!** 💪

---

*Version 1.0 | Migration: Deno KV → Supabase PostgreSQL*
