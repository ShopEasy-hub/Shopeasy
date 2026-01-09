-- Check what billing_cycle is stored in the payments table for your recent payment
-- This will show you exactly what data was stored

SELECT 
  p.id,
  p.reference,
  p.plan_id,
  p.billing_cycle,
  p.amount,
  p.status,
  p.created_at,
  o.name as organization_name,
  o.subscription_plan,
  o.subscription_status,
  o.subscription_end_date,
  EXTRACT(DAY FROM (o.subscription_end_date - NOW())) as days_remaining
FROM payments p
LEFT JOIN organizations o ON o.id = p.organization_id
WHERE p.created_at > NOW() - INTERVAL '1 day'  -- Payments from last 24 hours
ORDER BY p.created_at DESC
LIMIT 5;

-- Also check subscriptions table
SELECT 
  s.id,
  s.organization_id,
  s.plan_id,
  s.billing_cycle,
  s.status,
  s.start_date,
  s.end_date,
  EXTRACT(DAY FROM (s.end_date - s.start_date)) as duration_days,
  o.name as organization_name
FROM subscriptions s
LEFT JOIN organizations o ON o.id = s.organization_id
WHERE s.created_at > NOW() - INTERVAL '1 day'
ORDER BY s.created_at DESC
LIMIT 5;

-- Expected values:
-- billing_cycle should be 'yearly' (not 'monthly')
-- duration_days should be ~365 (not ~30)
-- days_remaining should be ~365 (not ~30)
