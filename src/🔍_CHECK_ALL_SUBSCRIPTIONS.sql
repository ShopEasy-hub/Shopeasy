-- Check ALL subscriptions for your organization
SELECT 
  s.id,
  s.organization_id,
  s.plan_id,
  s.billing_cycle,
  s.status,
  s.start_date::date as started,
  s.end_date::date as expires,
  s.created_at::date as created,
  EXTRACT(DAY FROM (s.end_date - s.start_date)) as duration_days,
  EXTRACT(DAY FROM (s.end_date - NOW())) as days_remaining,
  o.name as organization_name,
  o.subscription_status as org_status,
  o.subscription_plan as org_plan,
  o.subscription_end_date::date as org_expires
FROM subscriptions s
LEFT JOIN organizations o ON o.id = s.organization_id
WHERE o.name = 'Tradepassport'  -- Your organization
ORDER BY s.created_at DESC;

-- Expected: Should show ONE subscription with billing_cycle='yearly' and ~365 days
-- If you see billing_cycle='monthly' with ~30 days, that's the old one causing issues
