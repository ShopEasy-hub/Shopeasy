-- 🛠️ MANUAL FIX: Create subscription from verified payment
-- This will create/update the subscription based on your completed payment

-- Step 1: Check what payment we're working with
SELECT 
  id,
  reference,
  plan_id,
  billing_cycle,
  amount,
  status,
  organization_id,
  created_at
FROM payments
WHERE reference = 'SUB_1767720045189_9PASM2H'  -- Replace with your reference
  AND status = 'completed';

-- Step 2: Delete old monthly subscription if it exists
DELETE FROM subscriptions
WHERE organization_id IN (
  SELECT organization_id FROM payments 
  WHERE reference = 'SUB_1767720045189_9PASM2H'
);

-- Step 3: Create new YEARLY subscription from payment data
INSERT INTO subscriptions (
  organization_id,
  plan_id,
  billing_cycle,
  status,
  start_date,
  end_date,
  amount,
  payment_reference,
  provider
)
SELECT 
  p.organization_id,
  p.plan_id,
  p.billing_cycle,
  'active' as status,
  NOW() as start_date,
  -- Calculate end date based on billing cycle
  CASE 
    WHEN p.billing_cycle = 'yearly' THEN NOW() + INTERVAL '1 year'
    WHEN p.billing_cycle = 'monthly' THEN NOW() + INTERVAL '1 month'
    ELSE NOW() + INTERVAL '1 month'
  END as end_date,
  p.amount,
  p.reference as payment_reference,
  'paystack' as provider
FROM payments p
WHERE p.reference = 'SUB_1767720045189_9PASM2H'  -- Replace with your reference
  AND p.status = 'completed'
ON CONFLICT (organization_id) 
DO UPDATE SET
  plan_id = EXCLUDED.plan_id,
  billing_cycle = EXCLUDED.billing_cycle,
  status = EXCLUDED.status,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  amount = EXCLUDED.amount,
  payment_reference = EXCLUDED.payment_reference,
  provider = EXCLUDED.provider;

-- Step 4: Update organizations table to match
UPDATE organizations o
SET 
  subscription_status = 'active',
  subscription_plan = s.plan_id,
  subscription_end_date = s.end_date,
  trial_start_date = NULL
FROM subscriptions s
WHERE o.id = s.organization_id
  AND s.payment_reference = 'SUB_1767720045189_9PASM2H';  -- Replace with your reference

-- Step 5: Verify everything is correct
SELECT 
  'subscription' as source,
  s.billing_cycle,
  s.status,
  s.end_date::date as expires,
  EXTRACT(DAY FROM (s.end_date - NOW())) as days_remaining,
  o.name as org_name
FROM subscriptions s
LEFT JOIN organizations o ON o.id = s.organization_id
WHERE s.payment_reference = 'SUB_1767720045189_9PASM2H'  -- Replace with your reference

UNION ALL

SELECT 
  'organization' as source,
  NULL as billing_cycle,
  o.subscription_status as status,
  o.subscription_end_date::date as expires,
  EXTRACT(DAY FROM (o.subscription_end_date - NOW())) as days_remaining,
  o.name as org_name
FROM organizations o
WHERE o.id IN (
  SELECT organization_id FROM payments 
  WHERE reference = 'SUB_1767720045189_9PASM2H'  -- Replace with your reference
);

-- Expected result: Both rows should show ~365 days_remaining
