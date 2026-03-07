# 📸 VISUAL GUIDE - Step by Step

## Error You Got
```
❌ Failed to run sql query: ERROR: 42704: 
   unrecognized exception condition "duplicate_key"
```

**Cause:** Wrong PostgreSQL exception name

**Fix:** Use `/supabase/migrations/COMPLETE_FIX_V3_CORRECTED.sql` instead

---

## Step-by-Step Visual Guide

### STEP 1: Open Supabase Dashboard
```
┌─────────────────────────────────────────┐
│  https://app.supabase.com              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Select Your Project               │ │
│  │ ▼ ShopSpot (or your project name)│ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### STEP 2: Go to SQL Editor
```
┌─────────────────────────────────────────┐
│ Left Sidebar:                           │
│                                         │
│ 📊 Database                             │
│ 🔐 Authentication                       │
│ 📝 SQL Editor  ← CLICK THIS            │
│ 🔧 Edge Functions                       │
│ 📈 Storage                              │
└─────────────────────────────────────────┘
```

### STEP 3: Open the Corrected SQL File
```
In your code editor:
┌─────────────────────────────────────────┐
│ /supabase/                              │
│   /migrations/                          │
│     COMPLETE_FIX_V3_CORRECTED.sql  ← THIS│
│     COMPLETE_FIX_V2.sql            ← NOT THIS
│     FIX_INVENTORY_CONSTRAINT.sql   ← NOT THIS
└─────────────────────────────────────────┘
```

### STEP 4: Copy Entire File
```
1. Click in the file
2. Press: Ctrl + A  (Select All)
3. Press: Ctrl + C  (Copy)
```

### STEP 5: Paste in Supabase SQL Editor
```
┌─────────────────────────────────────────┐
│ SQL Editor                              │
│ ┌─────────────────────────────────────┐ │
│ │ -- COMPLETE FIX V3                  │ │
│ │ -- ==================               │ │
│ │ DO $$                               │ │
│ │ DECLARE                             │ │
│ │   ...                               │ │
│ │                                     │ │
│ │ [Paste your copied SQL here]        │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Run] button                            │
└─────────────────────────────────────────┘
```

### STEP 6: Click Run
```
┌─────────────────────────────────────────┐
│                                         │
│  [▶ Run]  ← CLICK THIS BUTTON          │
│                                         │
│  Or press: Ctrl + Enter                │
└─────────────────────────────────────────┘
```

### STEP 7: Watch the Output
```
┌─────────────────────────────────────────┐
│ Results:                                │
│                                         │
│ ✅ Cleaned up old constraints           │
│ ✅ Added unique constraint              │
│ ✅ Created branch inventory index       │
│ ✅ Created warehouse inventory index    │
│ ✅ Dropped old RLS policies             │
│ ✅ Granted permissions                  │
│ ✅ Created upsert_inventory_safe        │
│ ========================================│
│ VERIFICATION RESULTS:                   │
│ ========================================│
│ Unique Constraint: 1 (expected: 1)     │
│ Indexes: 2 (expected: 2)               │
│ RLS Policies: 4 (expected: 4)          │
│ Upsert Function: 1 (expected: 1)       │
│ ========================================│
│ ✅✅✅ ALL CHECKS PASSED! ✅✅✅         │
│ 🎉 MIGRATION COMPLETE! 🎉              │
│ ========================================│
└─────────────────────────────────────────┘
```

**✅ If you see this, it worked!**

### STEP 8: Hard Refresh Browser
```
Open your app:
┌─────────────────────────────────────────┐
│  Press: Ctrl + Shift + R               │
│  (Windows/Linux)                        │
│                                         │
│  Or: Cmd + Shift + R                   │
│  (Mac)                                  │
└─────────────────────────────────────────┘
```

### STEP 9: Test POS Sale
```
┌─────────────────────────────────────────┐
│ POS Terminal                            │
│ ┌─────────────────────────────────────┐ │
│ │ Add product to cart                 │ │
│ │ Click "Complete Sale"               │ │
│ │ Select payment method: Cash         │ │
│ │ Click "Confirm"                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ EXPECTED:                               │
│ ┌─────────────────────────────────────┐ │
│ │ 🧾 Receipt                          │ │
│ │ Receipt #123456                     │ │
│ │ Date: ...                           │ │
│ │ Items: ...                          │ │
│ │ Total: ₦...                         │ │
│ │                                     │ │
│ │ [Print] [New Sale]                  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**✅ If receipt appears, POS is working!**

### STEP 10: Test Transfer
```
┌─────────────────────────────────────────┐
│ Transfers Page                          │
│ ┌─────────────────────────────────────┐ │
│ │ Create Transfer                     │ │
│ │ From: Branch A                      │ │
│ │ To: Branch B                        │ │
│ │ Product: Test Product               │ │
│ │ Quantity: 5                         │ │
│ │ [Create Transfer]                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Transfer appears in list:               │
│ ┌─────────────────────────────────────┐ │
│ │ Status: Pending                     │ │
│ │ [Approve] [Reject]                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Click [Approve]:                        │
│ ✅ Branch A stock decreases by 5       │
│                                         │
│ Click [Complete]:                       │
│ ✅ Branch B stock increases by 5       │
└─────────────────────────────────────────┘
```

**✅ If stock updates, transfers are working!**

---

## Browser Console Check (F12)

### Good Logs ✅
```
Console:
┌─────────────────────────────────────────┐
│ ✅ Sale completed successfully          │
│ 📄 Receipt data prepared               │
│ 📤 [APPROVED] Deducting from source    │
│ 📥 [COMPLETED] Adding to destination   │
│ ✅ Branch stock adjusted successfully   │
└─────────────────────────────────────────┘
```

### Bad Logs ❌
```
Console:
┌─────────────────────────────────────────┐
│ ❌ function upsert_inventory_safe       │
│    does not exist                       │
└─────────────────────────────────────────┘
```

**If you see this error:**
1. Migration didn't run successfully
2. Go back to STEP 2 and run the SQL again
3. Make sure you see "ALL CHECKS PASSED"

---

## Summary Checklist

```
□ Opened Supabase Dashboard
□ Clicked SQL Editor
□ Copied COMPLETE_FIX_V3_CORRECTED.sql
□ Pasted in SQL Editor
□ Clicked Run
□ Saw "ALL CHECKS PASSED" ✅
□ Hard refreshed browser (Ctrl+Shift+R)
□ Tested POS sale → Receipt appeared ✅
□ Tested transfer → Stock updated ✅
□ No errors in console ✅
```

**All checked? You're done! 🎉**

---

## File Reference

```
📁 Your Project
├── /supabase/
│   └── /migrations/
│       └── COMPLETE_FIX_V3_CORRECTED.sql  ← USE THIS
│
├── START_HERE.md          ← Read first
├── QUICK_START.md         ← Quick guide
├── VISUAL_GUIDE.md        ← You are here
├── RUN_THIS_NOW.md        ← Detailed guide
└── FIXED_SQL_ERROR.md     ← What was fixed
```

---

**Follow the visual steps above and it will work!** 🚀
