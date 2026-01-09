-- Check what's in the ORGANIZATIONS table
-- The Admin Panel reads from here, not from subscriptions table!

SELECT 
  id,
  name,
  subscription_status,
  subscription_plan,
  subscription_end_date,
  trial_start_date,
  EXTRACT(DAY FROM (subscription_end_date - NOW())) as days_remaining_in_org_table,
  created_at
FROM organizations
WHERE name = 'Tradepassport';

-- Also check if the organizations table is being updated by a trigger
-- when subscriptions are created/updated

SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_table IN ('subscriptions', 'organizations')
  AND action_statement LIKE '%organizations%'
ORDER BY event_object_table, trigger_name;
