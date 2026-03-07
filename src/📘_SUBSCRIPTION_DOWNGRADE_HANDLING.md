# 📘 Subscription Downgrade Handling System

## 🎯 The Problem

**Scenario:**
1. User signs up → Gets 7-day free trial with **full Enterprise access**
2. Creates **5 branches**, **3 warehouses**, **10 users**
3. Trial expires → Subscribes to **Starter Plan** (1 branch, 0 warehouses, 3 users)

**Question:** What happens to the extra 4 branches, 3 warehouses, and 7 users?

---

## ✅ Our Solution: Graceful Degradation

We implement a **graceful degradation** strategy that:
- ✅ **Never deletes** user data
- ✅ **Keeps oldest** entities active (fair approach)
- ✅ Marks extras as **view-only/over-limit**
- ✅ Shows clear **warnings and upgrade prompts**
- ✅ **Blocks creation** of new over-limit entities
- ✅ Maintains **data integrity**

---

## 🏗️ System Architecture

### 1. Plan Limits Configuration (`/lib/subscription-limits.ts`)

```typescript
PLAN_LIMITS = {
  trial: {
    branches: 999,      // Unlimited
    warehouses: 999,    // Unlimited
    users: 999,         // Unlimited
    products: 999,      // Unlimited
    features: ['all'],  // Full access
  },
  starter: {
    branches: 1,        // Single location only
    warehouses: 0,      // NO warehouse management
    users: 3,           // Owner + 2 staff
    products: 500,      // 500 products max
    features: ['pos', 'inventory', 'reports', 'expenses'],
  },
  business: {
    branches: 5,        // Multiple locations
    warehouses: 1,      // Basic warehouse
    users: 10,          // 10 team members
    products: 2000,     // 2000 products
    features: ['pos', 'inventory', 'warehouses', 'transfers', 'reports'],
  },
  enterprise: {
    branches: 999,      // Unlimited
    warehouses: 999,    // Unlimited
    users: 999,         // Unlimited
    products: 999999,   // Unlimited
    features: ['all'],  // Full access
  },
}
```

### 2. Database Schema Changes

**New columns added:**
```sql
-- Branches
ALTER TABLE branches ADD COLUMN is_active boolean DEFAULT true;
ALTER TABLE branches ADD COLUMN is_over_limit boolean DEFAULT false;

-- Warehouses
ALTER TABLE warehouses ADD COLUMN is_active boolean DEFAULT true;
ALTER TABLE warehouses ADD COLUMN is_over_limit boolean DEFAULT false;

-- Users
ALTER TABLE user_profiles ADD COLUMN deactivation_reason text;
-- Uses existing 'status' column: 'active', 'inactive', 'over_limit'
```

### 3. Automatic Enforcement Trigger

When subscription plan changes, a database trigger automatically runs:

```sql
CREATE TRIGGER trigger_enforce_plan_limits
  AFTER UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION enforce_plan_limits_on_subscription_change();
```

**What it does:**
1. Detects plan/status changes
2. Calculates new limits
3. Marks over-limit entities
4. Sets appropriate flags and reasons

---

## 🔄 How It Works: Step-by-Step

### Example: Trial → Starter Downgrade

**Before (Trial):**
- 5 branches (all active)
- 3 warehouses (all active)
- 10 users (all active)
- Full Enterprise access

**After Subscribe to Starter:**
1. **Database trigger fires**
2. **Branches:** Keep oldest 1, mark 4 as `is_over_limit = true`
3. **Warehouses:** Mark all 3 as `is_over_limit = true` (Starter allows 0)
4. **Users:** Keep owner + 2 oldest, mark 7 as `status = 'over_limit'`

**User Experience:**
- ⚠️ Banner shown: "You have 4 extra branches. Upgrade to manage all branches."
- 📊 Limit indicator: "Using 5 of 1 branches"
- 🔒 "Add Branch" button **disabled**
- 👁️ Can **view** all 5 branches (read-only for extras)
- ✏️ Can only **edit** the 1 active branch
- 🚀 "Upgrade Plan" button prominently displayed

---

## 📱 Frontend Components

### 1. `useSubscriptionLimits` Hook

```typescript
const {
  usage,              // Current usage stats
  limits,             // Plan limits
  limitStatus,        // Over-limit status & warnings
  checkAction,        // Check if action allowed
  isAtLimit,          // Check if at limit for resource
  getRemainingQuota,  // Get remaining quota
  refreshUsage,       // Refresh usage stats
} = useSubscriptionLimits(orgId, plan, status);
```

### 2. `LimitWarningBanner` Component

Shows warnings when over limit:
```tsx
<LimitWarningBanner
  warnings={limitStatus.warnings}
  onUpgrade={() => navigate('subscribe')}
/>
```

### 3. Action Checks Before Creation

```typescript
// Before creating a branch
const actionCheck = checkAction('create_branch');
if (!actionCheck.allowed) {
  alert(actionCheck.reason); // "Your Starter plan allows 1 branch. Upgrade to add more."
  return;
}
```

---

## 🎨 UI/UX Flow

### Branches Page

```
┌─────────────────────────────────────────┐
│ ⚠️ Plan Limit Reached                   │
│                                         │
│ • You have 4 extra branches             │
│ • You cannot create new branches        │
│ • Extra branches are view-only          │
│                                         │
│ Using 5 of 1 branches  [Upgrade Plan]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Branches                [Add Branch]🔒   │
├─────────────────────────────────────────┤
│ ✅ Main Branch (Active - HQ)            │
│    • Can edit, manage, view             │
├─────────────────────────────────────────┤
│ 👁️ Lekki Branch (Over Limit)            │
│    • View-only access                   │
│    • Created: Jan 15, 2024              │
├─────────────────────────────────────────┤
│ 👁️ Victoria Island (Over Limit)         │
│    • View-only access                   │
│    • Created: Jan 20, 2024              │
└─────────────────────────────────────────┘
```

### Users Page

```
┌─────────────────────────────────────────┐
│ ⚠️ Plan Limit Reached                   │
│                                         │
│ • You have 7 extra users                │
│ • Some users are deactivated            │
│                                         │
│ Using 10 of 3 users  [Upgrade Plan]    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Name      Email        Status           │
├─────────────────────────────────────────┤
│ John Doe  john@...     ✅ Active (Owner)│
│ Jane Doe  jane@...     ✅ Active        │
│ Bob Smith bob@...      ✅ Active        │
│ Alice Lee alice@...    ⏸️ Over Limit    │
│ Charlie   charlie@...  ⏸️ Over Limit    │
└─────────────────────────────────────────┘
```

---

## 🔐 What Happens to Each Entity Type

### Branches
- **Active branches:** Full access (edit, manage, view)
- **Over-limit branches:** View-only (can see data, cannot edit)
- **New branches:** Cannot create until upgraded
- **Data:** All branch data remains safe and accessible

### Warehouses  
- **Active warehouses:** Full management access
- **Over-limit warehouses:** View-only (inventory visible, cannot modify)
- **Transfers:** Cannot initiate new transfers from over-limit warehouses
- **Data:** All warehouse inventory data preserved

### Users
- **Active users:** Can login and work normally
- **Over-limit users:** Account shows "Upgrade to reactivate" message
- **Login blocked:** Over-limit users cannot login until reactivated
- **Data:** User profiles and activity history preserved
- **Owner:** Always active (cannot be deactivated)

### Products
- **Existing products:** All remain in system
- **Over-limit:** Can view all, cannot add new
- **Sales:** Can still sell existing over-limit products
- **Data:** Product data fully preserved

---

## 🔄 Reactivation on Upgrade

**When user upgrades:** Starter → Business

1. **Trigger fires** on subscription update
2. **Limits recalculated:** Now allows 5 branches, 1 warehouse, 10 users
3. **Auto-reactivation:** Entities within new limits become active again
4. **User notification:** "Welcome back! Your branches have been reactivated."
5. **Seamless transition:** No data migration needed

---

## 📊 Admin Dashboard View

```
┌─────────────────────────────────────────┐
│ Organization Usage                      │
├─────────────────────────────────────────┤
│ Branches:    ████░░░  5 / 1             │
│ Warehouses:  ████░░░  3 / 0             │
│ Users:       ████░░░ 10 / 3             │
│ Products:    ██░░░░░ 200 / 500          │
│                                         │
│ [Upgrade to unlock all features]       │
└─────────────────────────────────────────┘
```

---

## 🛡️ Data Protection Guarantees

### What We NEVER Do:
- ❌ Delete user data
- ❌ Remove branches/warehouses/users permanently
- ❌ Lose transaction history
- ❌ Break existing references

### What We Always Do:
- ✅ Preserve all data
- ✅ Maintain referential integrity
- ✅ Allow view access to all data
- ✅ Provide clear upgrade paths
- ✅ Show transparent limit warnings

---

## 🚀 Implementation Checklist

### Backend (Database)
- [x] Create `MIGRATION_ADD_ENTITY_STATUS.sql`
- [x] Add status columns to tables
- [x] Create `mark_over_limit_entities()` function
- [x] Create `enforce_plan_limits_on_subscription_change()` trigger
- [ ] Run migration in Supabase

### Frontend (React)
- [x] Create `/lib/subscription-limits.ts`
- [x] Create `/hooks/useSubscriptionLimits.ts`
- [x] Create `/components/LimitWarningBanner.tsx`
- [x] Update `/pages/Settings.tsx` with limit checks
- [ ] Update `/pages/Users.tsx` with limit checks
- [ ] Update Warehouses page with limit checks
- [ ] Update Inventory page with limit checks

### Testing
- [ ] Test: Trial → Starter downgrade
- [ ] Test: Trial → Business downgrade
- [ ] Test: Business → Starter downgrade
- [ ] Test: Downgrade → Upgrade (reactivation)
- [ ] Test: Over-limit warning displays
- [ ] Test: Blocked actions work correctly
- [ ] Test: View-only access works
- [ ] Test: Owner always stays active

---

## 📞 User Communication

### Email on Downgrade
```
Subject: Your ShopSpot subscription has changed

Hi [Name],

Your subscription has been updated to the Starter Plan.

What this means:
• You now have access to 1 branch (was 5)
• Warehouse management is not available on Starter
• Team size limited to 3 users (was 10)

Your data is safe:
✅ All 5 branches are still accessible (view-only for extras)
✅ All inventory data is preserved
✅ All transaction history is intact

To unlock full access:
Upgrade to Business or Enterprise plan anytime!

[Upgrade Now]
```

### In-App Notifications
- Banner on dashboard showing over-limit status
- Contextual warnings on affected pages
- Upgrade prompts with clear benefits

---

## 💡 Best Practices

1. **Fair Entity Selection**
   - Keep **oldest** entities (they created them first)
   - Always keep **owner** user active
   - Always keep **headquarters** branch active

2. **Clear Communication**
   - Show exact limits vs usage
   - Explain what "over limit" means
   - Provide easy upgrade path

3. **Preserve User Intent**
   - Never delete without explicit consent
   - Allow view access to all data
   - Make reactivation seamless

4. **Business Logic**
   - Trial users get full Enterprise access
   - Downgrades are graceful, not destructive
   - Upgrades instantly restore access

---

## 🎉 Summary

This system ensures that users who downgrade their subscription:
- **Never lose data**
- **Understand their limits** clearly
- **Have easy upgrade paths**
- **Can still view all** their historical data
- **Experience graceful** degradation, not broken features

The system is **fair**, **transparent**, and **user-friendly**, encouraging upgrades without punishing downgrades!

---

**Files to Run:**
1. `/MIGRATION_ADD_ENTITY_STATUS.sql` - Run in Supabase SQL Editor
2. `/FIX_GEN_SALT_SCHEMA_QUALIFIED.sql` - Fix user creation issue

**Files Created:**
- `/lib/subscription-limits.ts` - Limits logic
- `/hooks/useSubscriptionLimits.ts` - React hook
- `/components/LimitWarningBanner.tsx` - Warning UI
- `/pages/Settings.tsx` - Updated with limits (example)

**Next:** Apply same pattern to Users, Warehouses, Inventory pages!
