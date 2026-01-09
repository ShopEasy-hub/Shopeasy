-- Check for database triggers on subscriptions table
-- A trigger might be modifying the billing_cycle or end_date

SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'subscriptions'
ORDER BY trigger_name;

-- Also check trigger functions
SELECT 
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname LIKE '%subscription%'
ORDER BY p.proname;
