# 🔒 Plan-Based Access Restrictions - Quick Reference

## 📋 Summary

ShopSpot now enforces subscription plan limits for branches, warehouses, and feature access.

---

## 🎯 What Changed?

### ✅ NEW: Warehouse & Supplier Restrictions
- **Starter Plan** users can NO LONGER see or access:
  - Warehouses page
  - Suppliers page  
  - Supply Chain page
- These pages are now **completely hidden** from the navigation menu

### ✅ NEW: Warehouse Limits
| Plan | Warehouse Limit |
|------|-----------------|
| Starter | 0 (No Access) |
| Standard | 1 |
| Growth/Pro | 2 |
| Enterprise | Unlimited |

### ✅ UPDATED: Branch Limits
| Plan | Branch Limit | Changed? |
|------|--------------|----------|
| Starter | 1 | No |
| Standard | 2 | No |
| Growth/Pro | 4 | **Yes** (was unlimited) |
| Enterprise | Unlimited | No |

### ✅ UPDATED: Pricing
| Plan | Old Price | New Price |
|------|-----------|-----------|
| Starter | ₦5,000 | **₦7,500** |
| Standard | ₦15,000 | **₦20,000** |
| Growth/Pro | ₦35,000 | ₦35,000 |
| Enterprise | ₦70,000 | **₦95,000** |

---

## 🔐 How It Works

### Navigation Filtering
```typescript
// Dashboard automatically filters menu items based on:
1. User Role (owner, admin, manager, etc.)
2. Subscription Plan (starter, standard, growth, enterprise)

// Both must allow access for page to appear
```

### When Limits Are Enforced

#### Branch Limits (Settings Page):
- ✅ Shows: "Your starter plan allows 1 branch. You currently have 1."
- 🔴 Button disabled when limit reached
- 📢 Alert shows upgrade prompt

#### Warehouse Limits (Warehouses Page):
- ✅ Shows: "Your standard plan allows 1 warehouse. You currently have 0."
- 🔴 Button disabled when limit reached
- 📢 Alert shows upgrade prompt

#### Page Access (Navigation):
- ❌ Starter users don't see Warehouse/Supplier pages AT ALL
- ✅ Standard+ users see them normally

---

## 👥 User Experience

### Starter Plan User Logs In:
```
Navigation Menu Shows:
✅ Dashboard
✅ POS Terminal
✅ Returns
✅ Inventory
✅ Reports
✅ Settings
❌ Warehouses (HIDDEN)
❌ Suppliers (HIDDEN)
❌ Supply Chain (HIDDEN)

In Settings → Branches:
- Can add 1 branch only
- "Add Branch" button disabled after 1
- Shows upgrade prompt
```

### Standard Plan User Logs In:
```
Navigation Menu Shows:
✅ Dashboard
✅ POS Terminal
✅ Warehouses (NOW VISIBLE)
✅ Suppliers (NOW VISIBLE)
✅ Supply Chain (NOW VISIBLE)
✅ All other pages

In Warehouses:
- Can add 1 warehouse
- "Add Warehouse" button disabled after 1
- Shows: "Your standard plan allows 1 warehouse"
```

### Growth Plan User:
```
✅ All pages visible
✅ Can create up to 4 branches
✅ Can create up to 2 warehouses
✅ Advanced features unlocked
```

### Enterprise Plan User:
```
✅ All pages visible
✅ Unlimited branches
✅ Unlimited warehouses
✅ All premium features
```

---

## 🛠️ Technical Implementation

### Files Modified:
1. **`/lib/permissions.ts`** - New plan-based access functions
2. **`/pages/Dashboard.tsx`** - Navigation filtering
3. **`/pages/Settings.tsx`** - Branch limit validation
4. **`/pages/WarehousesUnified.tsx`** - Warehouse limit validation
5. **`/pages/SubscriptionPlans.tsx`** - Updated pricing & features
6. **`/App.tsx`** - Updated payment amounts

### Key Functions Added:
```typescript
// Check if plan allows page access
canAccessPageByPlan(subscriptionPlan, pageId)

// Combined role + plan check
canAccessPageFull(userRole, pageId, subscriptionPlan)

// Check limits
canAddBranch(subscriptionPlan, currentCount)
canAddWarehouse(subscriptionPlan, currentCount)

// User messages
getBranchLimitMessage(subscriptionPlan, currentCount)
getWarehouseLimitMessage(subscriptionPlan, currentCount)
```

---

## 📱 Upgrade Flow

### User Hits Limit:
1. Clicks "Add Branch" or "Add Warehouse"
2. Sees alert: "Limit reached! Your X plan allows Y. Upgrade to add more."
3. Clicks "Upgrade Plan" button
4. Redirected to Subscription Plans page
5. Sees clear comparison of what each plan offers
6. Can upgrade and immediately access new features

---

## 🧪 Testing Scenarios

### Test 1: Starter Plan User
- [ ] Login with starter plan account
- [ ] Verify Warehouses NOT in menu
- [ ] Verify Suppliers NOT in menu
- [ ] Try to navigate to `/warehouses` directly → Should redirect or show error
- [ ] Can only create 1 branch

### Test 2: Standard Plan User
- [ ] Login with standard plan account
- [ ] Verify Warehouses IS in menu
- [ ] Verify Suppliers IS in menu
- [ ] Can create 1 warehouse only
- [ ] Button disabled after 1 warehouse
- [ ] Can create 2 branches

### Test 3: Growth Plan User
- [ ] Can create up to 4 branches
- [ ] Can create up to 2 warehouses
- [ ] All warehouse features accessible

### Test 4: Enterprise Plan User
- [ ] No limits on branches
- [ ] No limits on warehouses
- [ ] All features unlocked

### Test 5: Plan Upgrade
- [ ] User on Starter upgrades to Standard
- [ ] Warehouse menu items appear immediately
- [ ] Can now create warehouse
- [ ] No logout required

---

## ⚠️ Important Notes

### For Existing Customers:
- Users who already have more warehouses/branches than their plan allows will:
  - ✅ Keep existing warehouses/branches (read-only)
  - ❌ Cannot create NEW ones beyond the limit
  - 📢 See upgrade prompt encouraging them to upgrade

### For New Signups:
- Limits enforced from day 1
- Clear messaging during onboarding
- Easy upgrade path available

### For Support Team:
- When user complains "I can't see Warehouses":
  - ✅ Check their subscription plan
  - ✅ Confirm they're on Starter (no warehouse access)
  - ✅ Guide them to upgrade to Standard or higher

---

## 📞 Quick Answers

**Q: Why can't I see the Warehouse page?**  
A: Warehouse management requires Standard plan or higher. Starter plan is for single-location businesses without warehouse needs.

**Q: I had unlimited branches on Growth plan, why is it now 4?**  
A: We've restructured plans to offer better value at each tier. Enterprise plan now offers unlimited branches for businesses that need to scale beyond 4 locations.

**Q: Can I still access my existing warehouses if I downgrade?**  
A: Yes, you can view existing warehouses, but you cannot create new ones beyond your plan's limit.

**Q: How do I upgrade my plan?**  
A: Go to Settings → Subscription or click any "Upgrade Plan" link in the app. You can upgrade anytime.

---

**Quick Reference Card:**

```
STARTER (₦7,500/mo):  1 branch  | 0 warehouses | No suppliers
STANDARD (₦20,000/mo): 2 branches | 1 warehouse  | Full access
GROWTH (₦35,000/mo):   4 branches | 2 warehouses | Full access
ENTERPRISE (₦95,000/mo): Unlimited | Unlimited   | Full access + API
```

---

**Status:** ✅ Deployed  
**Date:** December 2, 2024  
**Version:** Plan Restrictions v2.0
