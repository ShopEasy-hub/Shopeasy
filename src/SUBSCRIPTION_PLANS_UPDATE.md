# Subscription Plans Update - December 2024

## 📋 New Pricing Structure

| Plan | Old Price | New Price | Branch Limit | Warehouse Limit | Change |
|------|-----------|-----------|--------------|-----------------|--------|
| **Starter** | ₦5,000/mo | **₦7,500/mo** | 1 branch | **No access** | +₦2,500 (+50%) |
| **Standard** | ₦15,000/mo | **₦20,000/mo** | 2 branches | **1 warehouse** | +₦5,000 (+33%) |
| **Growth/Pro** | ₦35,000/mo | **₦35,000/mo** | 4 branches | **2 warehouses** | Limited branches & warehouses |
| **Enterprise** | ₦70,000/mo | **₦95,000/mo** | Unlimited | **Unlimited** | +₦25,000 (+36%) |

---

## 🎯 Plan Details

### 🔷 Starter Plan - ₦7,500/month
**Target:** Individual stores or small outlets

**Features:**
- ✅ 1 branch access
- ❌ **No warehouse or supplier access**
- ✅ POS dashboard
- ✅ Sales tracking & daily reports
- ✅ Limited product catalog
- ✅ Great for startups or single-shop owners

**Yearly Price:** ₦76,500 (₦6,375/month with 15% discount)

**Restrictions:** Warehouse and Supplier pages are hidden for this plan.

---

### 🔶 Standard Plan - ₦20,000/month ⭐ POPULAR
**Target:** Growing businesses with multiple outlets

**Features:**
- ✅ 2 branch access
- ✅ **1 warehouse access**
- ✅ **Warehouse & supplier management**
- ✅ Unified sales reporting
- ✅ Inventory sync between branches
- ✅ Staff management
- ✅ Ideal for retail or restaurants expanding locally

**Yearly Price:** ₦204,000 (₦17,000/month with 15% discount)

---

### 🔵 Growth/Pro Plan - ₦35,000/month
**Target:** Scaling businesses managing stock, warehouses, and branches

**Features:**
- ✅ **4 branch access** (changed from unlimited)
- ✅ **2 warehouse access**
- ✅ Full warehouse & supplier management
- ✅ Advanced analytics
- ✅ Expense tracking
- ✅ Priority customer support

**Yearly Price:** ₦357,000 (₦29,750/month with 15% discount)

---

### 🔮 Enterprise Plan - ₦95,000/month
**Target:** Large-scale enterprises requiring full customization

**Features:**
- ✅ **Unlimited branches**
- ✅ **Unlimited warehouses**
- ✅ Full warehouse & supplier management
- ✅ API access & integration with ERP systems
- ✅ Dedicated account manager
- ✅ Custom deployment and branding
- ✅ 24/7 support

**Yearly Price:** ₦969,000 (₦80,750/month with 15% discount)

---

## 🛡️ Plan-Based Access Control

### 1. Branch Limits
The system validates branch creation against plan limits:

```typescript
export const BRANCH_LIMITS: Record<SubscriptionPlan, number> = {
  starter: 1,
  standard: 2,
  growth: 4,
  enterprise: 999, // Unlimited
};
```

**User Experience:**
- **In Settings → Branches:**
  - Shows current branch count vs. limit
  - "Add Branch" button disabled when limit reached
  - Shows upgrade prompt when limit exceeded
- **Validation Messages:**
  - "Your starter plan allows 1 branch. You currently have 1."
  - "Branch limit reached! Please upgrade your plan to add more branches."

---

### 2. Warehouse Limits
The system validates warehouse creation and access:

```typescript
export const WAREHOUSE_LIMITS: Record<SubscriptionPlan, number> = {
  starter: 0,      // No warehouse access
  standard: 1,
  growth: 2,
  enterprise: 999, // Unlimited
};
```

**User Experience:**
- **Starter Plan:**
  - ❌ Warehouse, Suppliers, and Supply Chain pages are **completely hidden** from navigation
  - Cannot access warehouse features at all
- **Standard, Growth, Enterprise:**
  - ✅ Can access warehouse features
  - Shows current warehouse count vs. limit
  - "Add Warehouse" button disabled when limit reached
  - Upgrade prompt displayed when limit exceeded

**Validation Messages:**
- **Starter:** "Warehouse access is not available on the starter plan. Upgrade to Standard or higher to access warehouses."
- **Standard:** "Your standard plan allows 1 warehouse. You currently have 0."
- **Growth:** "Your growth plan allows 2 warehouses. You currently have 1."

---

### 3. Navigation Filtering

The dashboard now uses **dual-layer permission checking**:

```typescript
// Check both role AND plan permissions
function canAccessPageFull(
  userRole: string | null, 
  pageId: string, 
  subscriptionPlan: string | null
): boolean {
  // First check role-based access
  const hasRoleAccess = canAccessPage(userRole, pageId);
  if (!hasRoleAccess) return false;
  
  // Then check plan-based access
  const hasPlanAccess = canAccessPageByPlan(subscriptionPlan, pageId);
  return hasPlanAccess;
}
```

**Plan-Restricted Pages:**
- `warehouses` - Hidden on Starter
- `suppliers` - Hidden on Starter  
- `supply-chain` - Hidden on Starter

---

### 4. Upgrade Path
- One-click upgrade button in Settings and Warehouse pages
- Links directly to subscription plans page
- Clear messaging about what features unlock with each tier

---

## 📊 Discount Structure

### Annual Billing Discount: **15% OFF**

**Example Savings:**

| Plan | Monthly × 12 | Yearly Price | Annual Savings |
|------|--------------|--------------|----------------|
| Starter | ₦90,000 | ₦76,500 | **₦13,500** |
| Standard | ₦240,000 | ₦204,000 | **₦36,000** |
| Growth | ₦420,000 | ₦357,000 | **₦63,000** |
| Enterprise | ₦1,140,000 | ₦969,000 | **₦171,000** |

---

## 🔄 Files Updated

### Frontend Components:

1. **`/pages/SubscriptionPlans.tsx`** ✅
   - Updated all plan prices (Starter: ₦7,500, Standard: ₦20,000, Enterprise: ₦95,000)
   - Added warehouse limit features to all plans
   - Updated Growth plan: "Unlimited branches" → "4 branch access, 2 warehouse access"
   - Updated Enterprise plan: "Unlimited branches & warehouses"
   - Added "No warehouse or supplier access" note to Starter plan

2. **`/App.tsx`** ✅
   - Updated plan pricing map for payment flow:
     - Starter: 5000 → 7500
     - Standard: 15000 → 20000
     - Growth: 35000 (no change)
     - Enterprise: 70000 → 95000

3. **`/lib/permissions.ts`** ✅ NEW FEATURES
   - Added `SubscriptionPlan` type
   - Added `BRANCH_LIMITS` constant (1, 2, 4, unlimited)
   - Added `WAREHOUSE_LIMITS` constant (0, 1, 2, unlimited)
   - Added `PLAN_RESTRICTED_PAGES` list (warehouses, suppliers, supply-chain)
   - Added `canAccessPageByPlan()` - Check plan-based page access
   - Added `canAccessPageFull()` - Combined role + plan check
   - Added `canAddWarehouse()` - Warehouse limit validation
   - Added `canAddBranch()` - Branch limit validation
   - Added `getWarehouseLimitMessage()` - User-friendly messages
   - Added `getBranchLimitMessage()` - User-friendly messages

4. **`/pages/Dashboard.tsx`** ✅
   - Updated navigation filter to use `canAccessPageFull()`
   - Now checks both role AND subscription plan
   - Automatically hides Warehouse/Suppliers pages for Starter plan users

5. **`/pages/Settings.tsx`** ✅
   - Added branch limit validation using centralized permissions
   - Disabled "Add Branch" button when limit reached
   - Shows current usage vs. plan limit
   - Added upgrade prompt with link to subscription page

6. **`/pages/WarehousesUnified.tsx`** ✅
   - Added warehouse limit validation
   - Disabled "Add Warehouse" button when limit reached
   - Shows plan limit info banner at top of page
   - Added upgrade prompt for users at limit
   - Integrated with centralized permissions system

7. **`/SUBSCRIPTION_PLANS_UPDATE.md`** ✅
   - Complete documentation of all changes
   - Pricing table with warehouse limits
   - Feature breakdown by plan
   - Implementation details
   - Testing checklist

### Backend:
No database changes required - all limits enforced in frontend validation and UI filtering.

---

## 🧪 Testing Checklist

### Pricing & Plans:
- [ ] Subscription plans page displays new prices correctly:
  - [ ] Starter: ₦7,500/month
  - [ ] Standard: ₦20,000/month
  - [ ] Growth: ₦35,000/month
  - [ ] Enterprise: ₦95,000/month
- [ ] Yearly billing calculations show correct discounted amounts (15% off)
- [ ] PayStack payment amounts match new prices (not 100x!)
- [ ] Payment callback working correctly after test mode payments

### Branch Limits:
- [ ] **Starter Plan:**
  - [ ] Can create only 1 branch
  - [ ] "Add Branch" button disabled after 1 branch
  - [ ] Shows upgrade prompt when limit reached
- [ ] **Standard Plan:**
  - [ ] Can create up to 2 branches
  - [ ] Button disabled at limit
- [ ] **Growth Plan:**
  - [ ] Can create up to 4 branches
  - [ ] Button disabled at limit
- [ ] **Enterprise Plan:**
  - [ ] Can create unlimited branches
  - [ ] Button never disabled

### Warehouse & Supplier Access:
- [ ] **Starter Plan:**
  - [ ] ❌ Warehouses page NOT visible in navigation
  - [ ] ❌ Suppliers page NOT visible in navigation
  - [ ] ❌ Supply Chain page NOT visible in navigation
  - [ ] Cannot access these pages even via direct URL
- [ ] **Standard Plan:**
  - [ ] ✅ Can see Warehouses/Suppliers in navigation
  - [ ] Can create only 1 warehouse
  - [ ] "Add Warehouse" button disabled after 1 warehouse
  - [ ] Shows upgrade prompt with warehouse count
- [ ] **Growth Plan:**
  - [ ] ✅ Can access warehouse features
  - [ ] Can create up to 2 warehouses
  - [ ] Button disabled at limit
  - [ ] Shows "Your growth plan allows 2 warehouses. You currently have X."
- [ ] **Enterprise Plan:**
  - [ ] ✅ Can access all warehouse features
  - [ ] Can create unlimited warehouses
  - [ ] Button never disabled

### User Experience:
- [ ] Limit messages are clear and user-friendly
- [ ] Upgrade buttons link to subscription plans page
- [ ] Navigation automatically adjusts based on plan
- [ ] No console errors when accessing different pages
- [ ] Plan limits shown in Settings and Warehouse pages

### Edge Cases:
- [ ] User downgrades from Enterprise to Growth (already has 5 warehouses)
  - [ ] Can still view existing warehouses
  - [ ] Cannot add new ones beyond limit
- [ ] User upgrades from Starter to Standard
  - [ ] Warehouse/Supplier pages now appear in navigation
  - [ ] Can immediately create a warehouse
- [ ] Trial period expiration behavior
- [ ] Plan changes reflect immediately without logout

---

## 💡 Migration Notes

### For Existing Customers:
- **Grandfathering:** Consider allowing existing Growth plan customers to keep unlimited branches
- **Grace Period:** Give 30-day notice before enforcing new limits
- **Data Migration:** No database changes needed
- **Communication:** Email all customers about pricing changes

### Implementation Strategy:
1. Deploy new pricing (already done ✅)
2. Add branch validation (already done ✅)
3. Send customer notifications
4. Enforce limits after grace period
5. Monitor upgrade conversions

---

## 🎯 Competitive Positioning

### Value Proposition:
- **Starter:** Entry-level for testing the platform
- **Standard:** Sweet spot for small chains (2 locations)
- **Growth:** Perfect for medium businesses (up to 4 locations)
- **Enterprise:** Enterprise-grade for large chains

### Pricing Strategy:
- Clear upgrade path with meaningful value at each tier
- 15% annual discount incentivizes longer commitments
- Branch limits create natural upgrade triggers
- Enterprise tier positioned as premium solution

---

## 📞 Support

For questions about the new pricing:
- Contact: support@ShopSpot.com
- Documentation: [pricing page]
- Sales: [contact sales team]

---

---

## 📊 Complete Feature Comparison Table

| Feature | Starter | Standard | Growth/Pro | Enterprise |
|---------|---------|----------|------------|------------|
| **Price/Month** | ₦7,500 | ₦20,000 | ₦35,000 | ₦95,000 |
| **Branches** | 1 | 2 | 4 | Unlimited |
| **Warehouses** | ❌ None | 1 | 2 | Unlimited |
| **Supplier Management** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Supply Chain** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **POS Dashboard** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Sales Tracking** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Inventory Management** | ✅ Basic | ✅ Yes | ✅ Advanced | ✅ Advanced |
| **Staff Management** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Reports & Analytics** | ✅ Basic | ✅ Yes | ✅ Advanced | ✅ Advanced |
| **Expense Tracking** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Support** | Email | Email | Priority | 24/7 Dedicated |
| **API Access** | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **Custom Branding** | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **Account Manager** | ❌ No | ❌ No | ❌ No | ✅ Yes |

---

## 🎯 Recommended Plan by Business Type

### 🏪 Single Store/Kiosk → **Starter Plan**
- Just starting out
- One location only
- Don't need warehouse management
- Basic POS and sales tracking sufficient

### 🏬 Small Chain (2 Locations) → **Standard Plan**
- 2 branches (e.g., main store + satellite location)
- Need basic warehouse for centralized stock
- Want to sync inventory between locations
- Staff management for multiple employees

### 🏢 Medium Business (3-4 Locations) → **Growth/Pro Plan**
- Up to 4 branches across a city/region
- 2 warehouses for better distribution
- Need advanced analytics
- Multiple suppliers and expense tracking
- Priority support for business-critical operations

### 🏭 Large Enterprise (5+ Locations) → **Enterprise Plan**
- Unlimited branches nationwide/international
- Unlimited warehouses for complex supply chain
- Need API integration with existing ERP systems
- Custom branding for white-label deployment
- Dedicated account manager and 24/7 support

---

## 🚀 Upgrade Incentives

### Why Upgrade from Starter to Standard?
1. **Unlock Warehouse Management** - Centralized inventory control
2. **Add a Second Branch** - Expand your business
3. **Supplier Management** - Track vendors and purchase orders
4. **Staff Management** - Manage multiple employees
5. Only ₦12,500 more per month (₦20,000 vs ₦7,500)

### Why Upgrade from Standard to Growth?
1. **Double Your Warehouses** - 2 instead of 1
2. **Double Your Branches** - 4 instead of 2
3. **Advanced Analytics** - Better business insights
4. **Priority Support** - Faster response times
5. Perfect for scaling businesses

### Why Choose Enterprise?
1. **No Limits** - Unlimited branches and warehouses
2. **Full Control** - API access for custom integrations
3. **White Label** - Custom branding for your business
4. **VIP Treatment** - Dedicated account manager
5. **Peace of Mind** - 24/7 premium support

---

**Last Updated:** December 2, 2024  
**Status:** ✅ Implemented and ready for deployment  
**Version:** 2.0 - Plan-Based Access Control
