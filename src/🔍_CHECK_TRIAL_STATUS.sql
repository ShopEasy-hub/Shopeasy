-- =====================================================
-- 🔍 CHECK TRIAL STATUS - Diagnose Trial Access Issues
-- =====================================================
-- Run this to see if your organization has proper trial access
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '🔍 CHECKING TRIAL STATUS';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
END $$;

-- =====================================================
-- Show all organizations and their trial status
-- =====================================================

SELECT 
  id as org_id,
  name as organization_name,
  subscription_status,
  subscription_plan,
  trial_start_date,
  created_at,
  EXTRACT(DAY FROM (NOW() - trial_start_date)) as days_since_trial_started,
  CASE 
    WHEN subscription_status = 'trial' AND trial_start_date > NOW() - INTERVAL '7 days' 
      THEN '✅ TRIAL ACTIVE - Full Enterprise Access!'
    WHEN subscription_status = 'trial' AND trial_start_date <= NOW() - INTERVAL '7 days'
      THEN '⏰ TRIAL EXPIRED - Need to subscribe'
    WHEN subscription_status = 'active' AND subscription_plan = 'starter'
      THEN '💳 PAID STARTER - 1 branch, 0 warehouses, 2 users'
    WHEN subscription_status = 'active' AND subscription_plan = 'standard'
      THEN '💳 PAID STANDARD - 2 branches, 1 warehouse, 5 users'
    WHEN subscription_status = 'active' AND subscription_plan = 'growth'
      THEN '💳 PAID GROWTH - 4 branches, 2 warehouses, 8 users'
    WHEN subscription_status = 'active' AND subscription_plan = 'enterprise'
      THEN '💳 PAID ENTERPRISE - Unlimited everything'
    WHEN subscription_status = 'expired'
      THEN '❌ EXPIRED - No access'
    ELSE '❓ UNKNOWN STATUS'
  END as current_access,
  CASE 
    WHEN subscription_status = 'trial' THEN '999 branches, 999 warehouses, 999 users'
    WHEN subscription_plan = 'starter' THEN '1 branch, 0 warehouses, 2 users'
    WHEN subscription_plan = 'standard' THEN '2 branches, 1 warehouse, 5 users'
    WHEN subscription_plan = 'growth' THEN '4 branches, 2 warehouses, 8 users'
    WHEN subscription_plan = 'enterprise' THEN 'Unlimited'
    ELSE 'No access'
  END as feature_limits
FROM organizations
ORDER BY created_at DESC;

-- =====================================================
-- Show what features each organization can use RIGHT NOW
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '📊 DETAILED BREAKDOWN';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
END $$;

-- Count actual usage
SELECT 
  o.name as organization,
  o.subscription_status,
  o.subscription_plan,
  EXTRACT(DAY FROM (NOW() - o.trial_start_date)) as trial_day,
  COUNT(DISTINCT b.id) as branches_used,
  COUNT(DISTINCT w.id) as warehouses_used,
  COUNT(DISTINCT u.id) as users_used,
  COUNT(DISTINCT p.id) as products_used,
  CASE 
    WHEN o.subscription_status = 'trial' THEN 'UNLIMITED ✅'
    WHEN o.subscription_plan = 'starter' THEN '1 branch limit'
    WHEN o.subscription_plan = 'standard' THEN '2 branch limit'
    WHEN o.subscription_plan = 'growth' THEN '4 branch limit'
    WHEN o.subscription_plan = 'enterprise' THEN 'UNLIMITED ✅'
    ELSE 'No access'
  END as branch_limit,
  CASE 
    WHEN o.subscription_status = 'trial' THEN 'UNLIMITED ✅'
    WHEN o.subscription_plan = 'starter' THEN '0 (not allowed)'
    WHEN o.subscription_plan = 'standard' THEN '1 warehouse limit'
    WHEN o.subscription_plan = 'growth' THEN '2 warehouse limit'
    WHEN o.subscription_plan = 'enterprise' THEN 'UNLIMITED ✅'
    ELSE 'No access'
  END as warehouse_limit,
  CASE 
    WHEN o.subscription_status = 'trial' THEN 'UNLIMITED ✅'
    WHEN o.subscription_plan = 'starter' THEN '2 user limit'
    WHEN o.subscription_plan = 'standard' THEN '5 user limit'
    WHEN o.subscription_plan = 'growth' THEN '8 user limit'
    WHEN o.subscription_plan = 'enterprise' THEN 'UNLIMITED ✅'
    ELSE 'No access'
  END as user_limit
FROM organizations o
LEFT JOIN branches b ON b.organization_id = o.id
LEFT JOIN warehouses w ON w.organization_id = o.id
LEFT JOIN user_profiles u ON u.organization_id = o.id
LEFT JOIN products p ON p.organization_id = o.id
GROUP BY o.id, o.name, o.subscription_status, o.subscription_plan, o.trial_start_date
ORDER BY o.created_at DESC;

-- =====================================================
-- Show any problems
-- =====================================================

DO $$
DECLARE
  v_org RECORD;
  v_problem_count INTEGER := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '⚠️  PROBLEMS DETECTED';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  
  FOR v_org IN 
    SELECT 
      id,
      name,
      subscription_status,
      subscription_plan,
      trial_start_date,
      created_at
    FROM organizations
    WHERE created_at > NOW() - INTERVAL '7 days'  -- Recently created
  LOOP
    -- Check if organization is wrongly set to 'active' when should be 'trial'
    IF v_org.subscription_status = 'active' AND v_org.subscription_plan = 'starter' AND v_org.created_at > NOW() - INTERVAL '7 days' THEN
      v_problem_count := v_problem_count + 1;
      RAISE NOTICE '❌ PROBLEM #%: Organization "%"', v_problem_count, v_org.name;
      RAISE NOTICE '   Status: % (should be "trial")', v_org.subscription_status;
      RAISE NOTICE '   Plan: %', v_org.subscription_plan;
      RAISE NOTICE '   Created: % ago', AGE(NOW(), v_org.created_at);
      RAISE NOTICE '   Issue: Recently created but set to paid plan instead of trial!';
      RAISE NOTICE '';
      RAISE NOTICE '   FIX: Run this SQL:';
      RAISE NOTICE '   UPDATE organizations SET subscription_status = ''trial'', trial_start_date = NOW() WHERE id = ''%'';', v_org.id;
      RAISE NOTICE '';
    END IF;
    
    -- Check if trial has no trial_start_date
    IF v_org.subscription_status = 'trial' AND v_org.trial_start_date IS NULL THEN
      v_problem_count := v_problem_count + 1;
      RAISE NOTICE '❌ PROBLEM #%: Organization "%"', v_problem_count, v_org.name;
      RAISE NOTICE '   Status: % but trial_start_date is NULL!', v_org.subscription_status;
      RAISE NOTICE '   Issue: Cannot calculate trial expiry without start date!';
      RAISE NOTICE '';
      RAISE NOTICE '   FIX: Run this SQL:';
      RAISE NOTICE '   UPDATE organizations SET trial_start_date = created_at WHERE id = ''%'';', v_org.id;
      RAISE NOTICE '';
    END IF;
    
    -- Check if trial has expired but status not updated
    IF v_org.subscription_status = 'trial' 
       AND v_org.trial_start_date IS NOT NULL 
       AND v_org.trial_start_date <= NOW() - INTERVAL '7 days' THEN
      v_problem_count := v_problem_count + 1;
      RAISE NOTICE '⏰ PROBLEM #%: Organization "%"', v_problem_count, v_org.name;
      RAISE NOTICE '   Status: % but trial started % days ago', v_org.subscription_status, EXTRACT(DAY FROM (NOW() - v_org.trial_start_date));
      RAISE NOTICE '   Issue: Trial has expired (>7 days)!';
      RAISE NOTICE '';
      RAISE NOTICE '   Options:';
      RAISE NOTICE '   1. Let it expire: UPDATE organizations SET subscription_status = ''expired'' WHERE id = ''%'';', v_org.id;
      RAISE NOTICE '   2. Extend trial: UPDATE organizations SET trial_start_date = NOW() WHERE id = ''%'';', v_org.id;
      RAISE NOTICE '';
    END IF;
  END LOOP;
  
  IF v_problem_count = 0 THEN
    RAISE NOTICE '✅ No problems detected! All organizations have correct trial settings.';
  ELSE
    RAISE NOTICE '═══════════════════════════════════════════════════════════════';
    RAISE NOTICE 'Found % problem(s). See fixes above.', v_problem_count;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
END $$;

-- =====================================================
-- Summary
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '📋 TRIAL ACCESS RULES';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'TRIAL STATUS:';
  RAISE NOTICE '  • subscription_status = ''trial''';
  RAISE NOTICE '  • trial_start_date within last 7 days';
  RAISE NOTICE '  • GIVES: 999 branches, 999 warehouses, 999 users (unlimited!)';
  RAISE NOTICE '';
  RAISE NOTICE 'PAID PLANS:';
  RAISE NOTICE '  • subscription_status = ''active''';
  RAISE NOTICE '  • subscription_plan determines limits:';
  RAISE NOTICE '    - Starter: 1 branch, 0 warehouses, 2 users';
  RAISE NOTICE '    - Standard: 2 branches, 1 warehouse, 5 users';
  RAISE NOTICE '    - Growth: 4 branches, 2 warehouses, 8 users';
  RAISE NOTICE '    - Enterprise: Unlimited everything';
  RAISE NOTICE '';
  RAISE NOTICE 'AFTER FIXING:';
  RAISE NOTICE '  • Log out and log back in to see changes!';
  RAISE NOTICE '  • Check console: window.appState.subscriptionStatus should be "trial"';
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════════';
  RAISE NOTICE '';
END $$;
