-- Compare subscriptions table vs organizations table
-- This will show if they're out of sync

SELECT 
  'subscriptions_table' as source,
  s.billing_cycle,
  s.status,
  s.start_date,
  s.end_date,
  EXTRACT(DAY FROM (s.end_date - NOW())) as days_remaining,
  s.updated_at as last_updated
FROM subscriptions s
LEFT JOIN organizations o ON o.id = s.organization_id
WHERE o.name = 'Tradepassport'

UNION ALL

SELECT 
  'organizations_table' as source,
  NULL as billing_cycle,
  o.subscription_status as status,
  NULL as start_date,
  o.subscription_end_date as end_date,
  EXTRACT(DAY FROM (o.subscription_end_date - NOW())) as days_remaining,
  o.updated_at as last_updated
FROM organizations o
WHERE o.name = 'Tradepassport'

ORDER BY source;

-- Expected: Both should show ~364 days_remaining
-- If organizations_table shows 30 days, the sync failed
