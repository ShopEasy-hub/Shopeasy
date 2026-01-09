-- Check the ACTUAL subscription that was created
-- This will show us what end_date was set

SELECT 
  s.id,
  s.billing_cycle,
  s.status,
  s.start_date,
  s.end_date,
  s.created_at,
  -- Calculate actual duration
  EXTRACT(DAY FROM (s.end_date - s.start_date)) as actual_duration_days,
  EXTRACT(DAY FROM (s.end_date - NOW())) as days_remaining_now,
  -- Show payment details
  p.reference as payment_ref,
  p.billing_cycle as payment_billing_cycle,
  -- Show org details
  o.name as org_name,
  o.subscription_end_date as org_end_date,
  EXTRACT(DAY FROM (o.subscription_end_date - NOW())) as org_days_remaining
FROM subscriptions s
LEFT JOIN payments p ON p.reference = s.payment_reference
LEFT JOIN organizations o ON o.id = s.organization_id
WHERE o.name = 'Tradepassport'
ORDER BY s.created_at DESC
LIMIT 1;

-- This will show us:
-- 1. What billing_cycle is stored in subscriptions table
-- 2. What the actual end_date is
-- 3. How many days it calculated (should be ~365 for yearly)
-- 4. What the payment said (should be 'yearly')
-- 5. What the org table says
