# 🎯 Users Not Showing - Run These Scripts Now

## Your Problem

- ❌ Old users still showing after nuclear option
- ❌ New users don't appear in list
- ✅ Owner can login fine

---

## ⚡ THE FIX (2 minutes)

### Step 1: Check What's Wrong

```bash
1. Open Supabase Dashboard
2. Go to SQL Editor  
3. Copy and run: 🔍_CHECK_USERS_DATA.sql
4. Look at the output
```

**What to look for:**
- Orphaned profiles count
- Orphaned auth count  
- Sync status

---

### Step 2: Run the Fix

```bash
1. Still in SQL Editor
2. Copy and run: 🔧_FIX_USERS_NOT_SHOWING.sql
3. Wait for completion
4. Look for "🎉 CLEANUP COMPLETE!"
```

**What it does:**
- ✅ Deletes orphaned profiles (no auth user)
- ✅ Deletes orphaned auth users (no profile)
- ✅ Ensures RLS allows SELECT
- ✅ Verifies everything

---

### Step 3: Refresh App

```bash
1. Go to your app
2. Refresh the Users page (F5)
3. Users should now show correctly ✅
```

---

## 📁 Files Created For You

| File | Purpose | When to Use |
|------|---------|-------------|
| **`🔍_CHECK_USERS_DATA.sql`** | See what's in database | Run FIRST |
| **`🔧_FIX_USERS_NOT_SHOWING.sql`** | Clean up orphaned data | Run SECOND |
| **`✅_FIX_USERS_NOT_SHOWING_GUIDE.md`** | Detailed guide | If you need help |
| **`🎯_RUN_THESE_SCRIPTS_NOW.md`** | Quick start (this file) | Start here |

---

## 🔧 What Gets Fixed

### Before Fix:
```
Database:
  auth.users: 5 records
  user_profiles: 8 records (3 orphaned!)
  ❌ Out of sync

App Shows:
  8 users (including 3 ghosts that can't login)
```

### After Fix:
```
Database:
  auth.users: 5 records
  user_profiles: 5 records
  ✅ In sync

App Shows:
  5 users (all can login)
```

---

## ✅ VERIFICATION

After running both scripts:

### 1. Check Database (SQL)

```sql
-- Both should be equal:
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth,
  (SELECT COUNT(*) FROM user_profiles) as profiles;
```

### 2. Check App

- Go to Users page
- Count should match database
- Each user should have role badge
- No errors in console (F12)

### 3. Test Add User

- Click "Add User"
- Fill form
- Submit
- User appears immediately ✅

### 4. Test Login

- Logout
- Login with new user
- Should work ✅

---

## 🐛 If Still Not Working

### Open Browser Console

Press F12, go to Console tab, look for:

```javascript
// Should see:
✅ Transformed users: [{...}, {...}]
📊 Users count: 5

// If you see errors:
❌ Error loading users: <message>
```

### Check These:

1. **RLS Policy:**
   ```sql
   -- Should show at least one SELECT policy:
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'user_profiles';
   ```

2. **Organization ID:**
   ```javascript
   // In console:
   console.log(appState.orgId);
   // Should show a valid UUID
   ```

3. **Data exists:**
   ```sql
   -- Should return users:
   SELECT * FROM user_profiles 
   WHERE organization_id = '<your-org-id>';
   ```

---

## 🔄 Nuclear Option (Last Resort)

If nothing works:

### 1. Backup Users

```sql
SELECT email, name, role, assigned_branch_id
FROM user_profiles
WHERE role != 'owner';
```

**COPY THIS!**

### 2. Delete All Non-Owners

```sql
DELETE FROM auth.users
WHERE id IN (
  SELECT id FROM user_profiles WHERE role != 'owner'
);
```

### 3. Verify Only Owner Remains

```sql
SELECT email, role FROM user_profiles;
-- Should only show owner
```

### 4. Recreate Users via App

- Login as owner
- Go to Users page
- Click "Add User" for each
- Use backed up data
- Test each login

---

## 📊 Expected Output

### From Check Script:

```
=== ORGANIZATIONS ===
ShopSpot Pharmacy | starter | 2024-12-15

=== AUTH.USERS ===
owner@shop.com | confirmed ✅ | password valid ✅
admin@shop.com | confirmed ✅ | password valid ✅

=== USER_PROFILES ===
owner@shop.com | John Doe | owner
admin@shop.com | Jane Doe | admin

=== SYNC STATUS ===
✅ All in sync

=== SUMMARY ===
total_orgs: 1
auth_users: 2
user_profiles: 2
orphaned_profiles: 0
orphaned_auth: 0
```

### From Fix Script:

```
🔍 DIAGNOSING USER VISIBILITY ISSUE

📊 STEP 1: Checking current state...
Auth users: 5
User profiles: 8
Orphaned profiles (no auth): 3
Orphaned auth (no profile): 0

🗑️  STEP 2: Deleting orphaned profiles...
Profiles to delete:
  - old@user.com (cashier)
  - test@user.com (manager)
  - ghost@user.com (admin)

Deleted 3 orphaned profiles

✅ FINAL STATE
Total auth users: 5
Total user profiles: 5
✅ Auth and profiles are in sync!

🎉 CLEANUP COMPLETE!
```

---

## 🎯 Quick Checklist

- [ ] Ran `🔍_CHECK_USERS_DATA.sql`
- [ ] Saw orphaned data count
- [ ] Ran `🔧_FIX_USERS_NOT_SHOWING.sql`
- [ ] Saw "CLEANUP COMPLETE"
- [ ] Refreshed Users page
- [ ] Users now show correctly
- [ ] Can add new user
- [ ] New user appears
- [ ] Can login with new user

---

## 🚀 After Success

Once users are showing:

1. ✅ Test all user roles login
2. ✅ Verify role permissions work
3. ✅ Check branch assignments
4. ✅ Test POS with cashier account
5. ✅ Ready for production!

---

**Run the scripts now → Problem solved! 🎉**

---

**Need help?** Read: `✅_FIX_USERS_NOT_SHOWING_GUIDE.md`
