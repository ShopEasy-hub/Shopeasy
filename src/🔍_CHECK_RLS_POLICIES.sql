-- Check RLS policies on subscriptions table
-- This might be blocking the SERVICE_ROLE from inserting

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'subscriptions'
ORDER BY policyname;

-- Also check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'subscriptions';

-- Expected: 
-- - RLS should be enabled
-- - SERVICE_ROLE should bypass RLS (it's a superuser)
-- - If there's a policy blocking INSERT, that's the problem
