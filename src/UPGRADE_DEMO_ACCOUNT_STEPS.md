# 🚀 Step-by-Step: Upgrade Your Demo Account to Enterprise

## 📋 What You Need
- Supabase Dashboard access
- Email address of the account to upgrade
- 5 minutes

---

## 🎯 Quick Steps

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Login to your project
3. Click **"SQL Editor"** in the left sidebar

---

### Step 2: Find Your Organization ID

Copy and paste this query into the SQL Editor:

```sql
SELECT 
  o.id as org_id,
  o.name as org_name,
  o.subscription_plan as current_plan,
  o.subscription_status as current_status,
  up.email as owner_email,
  up.name as owner_name
FROM organizations o
JOIN user_profiles up ON up.id = o.owner_id
WHERE up.email = 'YOUR_EMAIL_HERE';
```

**Replace `YOUR_EMAIL_HERE`** with the email you used to sign up.

Example:
```sql
WHERE up.email = 'demo@ShopSpot.com';
```

**Click "Run" (or press F5)**

You should see output like:
```
org_id: 550e8400-e29b-41d4-a716-446655440000
org_name: Demo Company
current_plan: starter
current_status: trial
owner_email: demo@ShopSpot.com
owner_name: John Doe
```

---

### Step 3: Upgrade to Enterprise

Copy and paste this query into the SQL Editor:

```sql
UPDATE organizations o
SET 
  subscription_plan = 'enterprise',
  subscription_status = 'active',
  subscription_end_date = NOW() + INTERVAL '1 year',
  trial_start_date = NULL,
  updated_at = NOW()
FROM user_profiles up
WHERE o.owner_id = up.id
  AND up.email = 'YOUR_EMAIL_HERE';
```

**Replace `YOUR_EMAIL_HERE`** with your email (same as Step 2).

**Click "Run"**

You should see:
```
Success. No rows returned
```

This means it worked!

---

### Step 4: Verify the Upgrade

Run this query to confirm:

```sql
SELECT 
  o.name as organization,
  o.subscription_plan as plan,
  o.subscription_status as status,
  o.subscription_end_date as expires_on,
  up.email as owner_email
FROM organizations o
JOIN user_profiles up ON up.id = o.owner_id
WHERE up.email = 'YOUR_EMAIL_HERE';
```

**Expected Output:**
```
organization: Demo Company
plan: enterprise ✅
status: active ✅
expires_on: 2025-12-04 (1 year from now) ✅
owner_email: demo@ShopSpot.com
```

---

### Step 5: Test in the App

1. **Logout** from ShopSpot
2. **Login again** with your email
3. **Check the sidebar menu** - should see:
   - ✅ Dashboard
   - ✅ POS Terminal
   - ✅ Returns
   - ✅ Inventory
   - ✅ Short Dated
   - ✅ **Warehouses** (unlocked!)
   - ✅ **Suppliers** (unlocked!)
   - ✅ **Supply Chain** (unlocked!)
   - ✅ Transfers
   - ✅ Expenses
   - ✅ Reports
   - ✅ Users
   - ✅ Product History
   - ✅ Settings
   - ✅ Admin Panel

4. **Go to Admin Panel**
   - Should show status: "ACTIVE" (green badge)
   - Should show: "Your subscription expires in 365 days"

5. **Try creating a warehouse**
   - Click "Warehouses" in menu
   - Click "Add Warehouse"
   - Should work without errors ✅

---

## 🎉 Success!

You now have **unlimited access** for 1 year:
- ✅ Unlimited warehouses
- ✅ Unlimited branches
- ✅ All features unlocked
- ✅ No payment required
- ✅ Perfect for demos and testing

---

## 🔧 Troubleshooting

### "Query returned no rows"

**Problem:** Email doesn't match any organization.

**Fix:** 
1. Check the email is correct
2. Run Step 2 query first to find your account
3. Try searching by organization name:
```sql
SELECT o.*, up.email
FROM organizations o
JOIN user_profiles up ON up.id = o.owner_id
WHERE o.name ILIKE '%Demo%';
```

---

### "Still seeing 'trial' status"

**Problem:** Browser cached old data.

**Fix:**
1. Logout completely
2. Clear browser cache (Ctrl+Shift+Delete)
3. Close all browser tabs
4. Open new tab and login again

---

### "Warehouses still blocked"

**Problem:** Status might be 'expired' instead of 'active'.

**Fix:** Run this:
```sql
UPDATE organizations
SET subscription_status = 'active'
WHERE id = 'YOUR_ORG_ID_FROM_STEP_2';
```

---

### "Want to extend expiry date"

**To give 5 years instead of 1:**
```sql
UPDATE organizations o
SET subscription_end_date = NOW() + INTERVAL '5 years'
FROM user_profiles up
WHERE o.owner_id = up.id
  AND up.email = 'YOUR_EMAIL_HERE';
```

**To make it never expire (999 years):**
```sql
UPDATE organizations o
SET subscription_end_date = NOW() + INTERVAL '999 years'
FROM user_profiles up
WHERE o.owner_id = up.id
  AND up.email = 'YOUR_EMAIL_HERE';
```

---

## 📊 What Enterprise Plan Gives You

### Unlimited Resources:
- **Warehouses:** 999 (unlimited)
- **Branches:** 999 (unlimited)
- **Users:** No limit
- **Products:** No limit
- **Suppliers:** No limit

### All Features Unlocked:
- ✅ Full inventory management
- ✅ Warehouse management
- ✅ Supplier management
- ✅ Supply chain features
- ✅ Inter-branch transfers
- ✅ Multi-branch POS
- ✅ Advanced reports
- ✅ Product history audit
- ✅ Expense tracking
- ✅ Return management
- ✅ Short-dated goods tracking

### Premium Features:
- ✅ Admin Panel access
- ✅ User role management
- ✅ Branch/warehouse context switching
- ✅ Real-time inventory sync
- ✅ Approval workflows
- ✅ Audit trails

---

## 🎯 Multiple Demo Accounts?

To upgrade multiple accounts at once:

```sql
UPDATE organizations o
SET 
  subscription_plan = 'enterprise',
  subscription_status = 'active',
  subscription_end_date = NOW() + INTERVAL '1 year'
FROM user_profiles up
WHERE o.owner_id = up.id
  AND up.email IN (
    'demo1@ShopSpot.com',
    'demo2@ShopSpot.com',
    'demo3@ShopSpot.com'
  );
```

---

## ⚡ Quick Reference

### Upgrade to Enterprise (1 year):
```sql
UPDATE organizations o
SET subscription_plan = 'enterprise',
    subscription_status = 'active',
    subscription_end_date = NOW() + INTERVAL '1 year'
FROM user_profiles up
WHERE o.owner_id = up.id AND up.email = 'YOUR_EMAIL';
```

### Upgrade to Standard (for testing plan limits):
```sql
UPDATE organizations o
SET subscription_plan = 'standard',
    subscription_status = 'active',
    subscription_end_date = NOW() + INTERVAL '1 year'
FROM user_profiles up
WHERE o.owner_id = up.id AND up.email = 'YOUR_EMAIL';
```

### Reset to Trial:
```sql
UPDATE organizations o
SET subscription_plan = 'starter',
    subscription_status = 'trial',
    trial_start_date = NOW(),
    subscription_end_date = NULL
FROM user_profiles up
WHERE o.owner_id = up.id AND up.email = 'YOUR_EMAIL';
```

---

**Done!** 🎉

Your demo account is now Enterprise with unlimited access for 1 year.

Need help? Check `/TRIAL_SYSTEM_EXPLAINED.md` for detailed documentation.
