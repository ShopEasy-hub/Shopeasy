-- ========================================
-- RLS POLICIES FOR SUBSCRIPTIONS TABLE
-- ========================================
-- Run these in Supabase SQL Editor if subscription creation fails

-- 1. Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'subscriptions';

-- 2. If no INSERT policy exists, create one:

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can insert subscriptions for their org" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their org subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their org subscription" ON public.subscriptions;

-- Allow users to INSERT subscriptions for their organization
CREATE POLICY "Users can insert subscriptions for their org"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.user_profiles 
    WHERE id = auth.uid()
  )
);

-- Allow users to SELECT their organization's subscription
CREATE POLICY "Users can view their org subscription"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.user_profiles 
    WHERE id = auth.uid()
  )
);

-- Allow users to UPDATE their organization's subscription
CREATE POLICY "Users can update their org subscription"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.user_profiles 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.user_profiles 
    WHERE id = auth.uid()
  )
);

-- 3. Verify policies are active
SELECT * FROM pg_policies WHERE tablename = 'subscriptions';

-- 4. Test query (should return your org ID)
SELECT organization_id FROM public.user_profiles WHERE id = auth.uid();

-- ========================================
-- If you see errors, run this diagnostic:
-- ========================================

-- Check if user_profiles table exists and has data
SELECT COUNT(*) FROM public.user_profiles;

-- Check if your user has a profile
SELECT * FROM public.user_profiles WHERE id = auth.uid();

-- Check if subscriptions table exists
SELECT COUNT(*) FROM public.subscriptions;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'subscriptions';
