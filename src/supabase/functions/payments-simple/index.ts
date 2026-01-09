import { createClient } from 'jsr:@supabase/supabase-js@2';

// CORS headers - allow ALL origins for now (will work for localhost and production)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

console.log('🚀 Payment Service Starting...');
console.log('🔑 Checking environment variables...');

// Get Supabase credentials from environment
// SUPABASE_URL is provided automatically by Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://pkzpifdocmmzowvjopup.supabase.co';
const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_KEY');
const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');

console.log('✅ SUPABASE_URL:', supabaseUrl);
console.log('✅ SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗ MISSING');
console.log('✅ PAYSTACK_SECRET_KEY:', paystackSecretKey ? '✓' : '✗ MISSING');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
}

// Initialize Supabase client with SERVICE ROLE (bypasses RLS)
const supabase = createClient(
  supabaseUrl || 'https://pkzpifdocmmzowvjopup.supabase.co',
  supabaseServiceKey || 'temp',
);

// Helper to create HMAC SHA512 hash for webhook verification
async function createHmacSha512(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

Deno.serve(async (req) => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔵 NEW REQUEST:', req.method, req.url);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    
    console.log('📍 Path:', path);
    console.log('📍 Method:', req.method);

    // ============================================
    // HEALTH CHECK
    // ============================================
    if (path.endsWith('/payments-simple') || path.endsWith('/payments-simple/')) {
      console.log('💚 Health check request');
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'ShopEasy Payment Service',
          version: '6.0.0-BULLETPROOF',
          message: 'Simplified version - guaranteed to work!',
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // PAYSTACK INITIALIZE (Requires Auth)
    // ============================================
    if (path.includes('/paystack/initialize') && req.method === 'POST') {
      console.log('💳 [PayStack Initialize] Starting...');
      
      // Check for auth header
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        console.error('❌ No Authorization header');
        return new Response(
          JSON.stringify({ error: 'Unauthorized - No auth header' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get user from auth token
      const token = authHeader.replace('Bearer ', '');
      console.log('🔑 Auth token present:', token.substring(0, 20) + '...');
      
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        console.error('❌ Auth error:', authError?.message);
        return new Response(
          JSON.stringify({ error: 'Unauthorized - Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('✅ User authenticated:', user.email);

      // Parse request body
      const { email, amount, currency, reference, metadata, callback_url } = await req.json();
      console.log('📦 Payment request:', { email, amount, reference, planId: metadata?.planId });
      
      if (!paystackSecretKey) {
        console.error('❌ PAYSTACK_SECRET_KEY not set!');
        return new Response(
          JSON.stringify({ error: 'Payment gateway not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Use callback URL from request, fallback to env var, then localhost
      const callbackUrl = callback_url || Deno.env.get('FRONTEND_URL') || 'http://localhost:5173';
      console.log('🔗 Callback URL:', callbackUrl);
      
      // Initialize PayStack transaction
      console.log('📤 Calling Paystack API...');
      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount), // Already in kobo from frontend
          currency: currency || 'NGN',
          reference,
          metadata,
          callback_url: callbackUrl, // Dynamic callback URL from frontend
        }),
      });

      const paystackData = await paystackResponse.json();
      console.log('📥 Paystack response status:', paystackResponse.status);
      console.log('📥 Paystack response:', paystackData);

      if (!paystackResponse.ok || !paystackData.status) {
        console.error('❌ PayStack error:', paystackData);
        return new Response(
          JSON.stringify({ success: false, error: paystackData.message || 'Failed to initialize payment' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const paystackReference = paystackData.data.reference;
      console.log('✅ Payment initialized, reference:', paystackReference);

      // Store payment record in database
      console.log('💾 Storing payment record...');
      const { error: insertError } = await supabase.from('payments').insert({
        reference: paystackReference,
        provider: 'paystack',
        organization_id: metadata.orgId,
        user_id: user.id,
        plan_id: metadata.planId,
        billing_cycle: metadata.billingCycle,
        amount,
        currency: currency || 'NGN',
        status: 'pending',
      });

      if (insertError) {
        console.error('❌ Failed to store payment:', insertError);
      } else {
        console.log('✅ Payment record stored');
      }

      console.log('✅ [PayStack Initialize] Complete!');
      return new Response(
        JSON.stringify({
          success: true,
          authorizationUrl: paystackData.data.authorization_url,
          reference: paystackReference,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // PAYSTACK VERIFY (🚨 NO AUTH REQUIRED! 🚨)
    // ============================================
    if (path.includes('/paystack/verify/') && req.method === 'GET') {
      const reference = path.split('/paystack/verify/')[1]?.replace(/\/$/, '');
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 [PayStack Verify] PUBLIC ACCESS - NO AUTH REQUIRED');
      console.log('🔍 THIS ENDPOINT DOES NOT CHECK AUTHORIZATION!');
      console.log('🔍 Reference:', reference);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      if (!reference) {
        console.error('❌ No reference provided');
        return new Response(
          JSON.stringify({ error: 'Reference required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!paystackSecretKey) {
        console.error('❌ PAYSTACK_SECRET_KEY not set!');
        return new Response(
          JSON.stringify({ error: 'Payment gateway not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Retry logic - Paystack needs time to finalize
      let attempts = 0;
      let paystackData: any = null;
      let paystackResponse: any = null;

      console.log('🔄 Starting verification with retry logic...');
      
      while (attempts < 3) {
        attempts++;
        console.log(`🔄 Attempt ${attempts}/3...`);
        
        paystackResponse = await fetch(
          `https://api.paystack.co/transaction/verify/${reference}`,
          {
            headers: { 'Authorization': `Bearer ${paystackSecretKey}` },
          }
        );

        paystackData = await paystackResponse.json();
        console.log(`📥 Paystack API response:`, {
          status: paystackResponse.status,
          data_status: paystackData.data?.status,
          success: paystackData.status,
        });

        // If successful, break early
        if (paystackResponse.ok && paystackData.status && paystackData.data?.status === 'success') {
          console.log('✅ Verification successful on attempt', attempts);
          break;
        }

        // If not the last attempt, wait 2 seconds
        if (attempts < 3) {
          console.log('⏳ Transaction not ready, waiting 2s...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Check if verification failed
      if (!paystackResponse.ok || !paystackData.status) {
        console.error('❌ Verification failed after', attempts, 'attempts');
        console.error('❌ Paystack response:', paystackData);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: paystackData.message || 'Failed to verify payment',
            details: paystackData,
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const paymentData = paystackData.data;
      console.log('✅ Payment verified:', {
        reference: paymentData.reference,
        amount: paymentData.amount,
        status: paymentData.status,
      });

      // Update payment status in database
      console.log('💾 Updating payment record...');
      const { data: payment, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('reference', reference)
        .single();

      if (fetchError || !payment) {
        console.error('❌ Payment record not found:', fetchError);
        console.error('❌ Reference:', reference);
        console.error('❌ This means payment was not initialized properly!');
        
        // ⚠️ CRITICAL: Return error if payment not found
        // We cannot create subscription without payment details
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Payment record not found. Please contact support.',
            reference,
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('✅ Payment record found:', {
        reference: payment.reference,
        plan_id: payment.plan_id,
        billing_cycle: payment.billing_cycle,
        organization_id: payment.organization_id,
        amount: payment.amount,
      });

      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: paymentData.status === 'success' ? 'completed' : 'failed',
          verified_at: new Date().toISOString(),
          transaction_id: paymentData.id?.toString(),
        })
        .eq('reference', reference);

      if (updateError) {
        console.error('❌ Failed to update payment:', updateError);
      } else {
        console.log('✅ Payment status updated');
      }

      // 🚨 CREATE SUBSCRIPTION IMMEDIATELY (Don't wait for webhook!)
      if (paymentData.status === 'success' && payment) {
        console.log('💾 Creating subscription immediately...');
        console.log('📦 Subscription data:', {
          organization_id: payment.organization_id,
          plan_id: payment.plan_id,
          billing_cycle: payment.billing_cycle,
          amount: payment.amount,
        });

        const startDate = new Date();
        const endDate = new Date();
        
        console.log('🔍 BILLING CYCLE FROM DATABASE:', payment.billing_cycle);
        console.log('🔍 Type of billing_cycle:', typeof payment.billing_cycle);
        
        if (payment.billing_cycle === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
          console.log('📅 Monthly subscription: +1 month');
        } else if (payment.billing_cycle === 'yearly') {
          endDate.setFullYear(endDate.getFullYear() + 1);
          console.log('📅 Yearly subscription: +1 year');
        } else {
          console.error('❌ UNKNOWN BILLING CYCLE:', payment.billing_cycle);
          console.error('❌ Defaulting to monthly');
          endDate.setMonth(endDate.getMonth() + 1);
        }

        console.log('📅 Start date:', startDate.toISOString());
        console.log('📅 End date:', endDate.toISOString());

        const subscriptionData = {
          organization_id: payment.organization_id,
          plan_id: payment.plan_id,
          billing_cycle: payment.billing_cycle,
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          amount: payment.amount,
          payment_reference: reference,
          provider: 'paystack',
        };

        console.log('💾 Upserting subscription...');
        const { data: subscription, error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert(subscriptionData, { onConflict: 'organization_id' })
          .select()
          .single();

        if (subscriptionError) {
          console.error('❌ Failed to create subscription:', subscriptionError);
          console.error('❌ Error details:', JSON.stringify(subscriptionError, null, 2));
          // ⚠️ Don't fail the whole request - log error but continue
        } else {
          console.log('✅ Subscription created successfully!');
          console.log('✅ Subscription ID:', subscription?.id);
          console.log('✅ Status:', subscription?.status);
          console.log('✅ Plan:', subscription?.plan_id);
          
          // 🆕 ALSO UPDATE THE ORGANIZATIONS TABLE!
          // This is a "best effort" update - if it fails, we still return success
          console.log('💾 Updating organizations table...');
          try {
            const { error: orgUpdateError } = await supabase
              .from('organizations')
              .update({
                subscription_status: 'active',
                subscription_plan: payment.plan_id,
                subscription_end_date: endDate.toISOString(),
                trial_start_date: null, // Clear trial since now paid
              })
              .eq('id', payment.organization_id);
            
            if (orgUpdateError) {
              console.error('❌ Failed to update organization:', orgUpdateError);
              console.error('⚠️ Subscription is still active, org table just not synced yet');
            } else {
              console.log('✅ Organization updated with subscription data!');
            }
          } catch (orgError) {
            console.error('❌ Exception updating organization:', orgError);
            console.error('⚠️ This is non-critical, subscription is still active');
          }
        }
      } else if (!payment) {
        console.error('❌ Cannot create subscription: payment record is null');
      } else if (paymentData.status !== 'success') {
        console.log('⚠️ Payment status is not success:', paymentData.status);
      }

      console.log('✅ [PayStack Verify] Complete!');
      return new Response(
        JSON.stringify({
          success: true,
          status: paymentData.status,
          amount: paymentData.amount / 100,
          reference: paymentData.reference,
          paidAt: paymentData.paid_at,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // PAYSTACK WEBHOOK (Background subscription creation)
    // ============================================
    if (path.includes('/paystack/webhook') && req.method === 'POST') {
      console.log('🔔 [PayStack Webhook] Received');
      
      if (!paystackSecretKey) {
        console.error('❌ PAYSTACK_SECRET_KEY not set!');
        return new Response(
          JSON.stringify({ error: 'Not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify webhook signature
      const signature = req.headers.get('x-paystack-signature');
      const body = await req.text();
      
      console.log('🔐 Verifying webhook signature...');
      const hash = await createHmacSha512(paystackSecretKey, body);
      
      if (hash !== signature) {
        console.error('❌ Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('✅ Webhook signature verified');

      const event = JSON.parse(body);
      console.log('🔔 Webhook event:', event.event, 'Reference:', event.data?.reference);

      // Only process successful charges
      if (event.event === 'charge.success') {
        const paymentData = event.data;
        const reference = paymentData.reference;
        
        console.log('✅ Processing successful payment:', reference);

        // Get payment record
        const { data: payment } = await supabase
          .from('payments')
          .select('*')
          .eq('reference', reference)
          .single();

        if (payment) {
          console.log('💾 Updating payment...');
          
          // Update payment status
          await supabase
            .from('payments')
            .update({
              status: 'completed',
              verified_at: new Date().toISOString(),
              transaction_id: paymentData.id?.toString(),
            })
            .eq('reference', reference);

          console.log('💾 Creating subscription...');

          // Create/update subscription
          const startDate = new Date();
          const endDate = new Date();
          
          if (payment.billing_cycle === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
          } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
          }

          const { error: upsertError } = await supabase.from('subscriptions').upsert({
            organization_id: payment.organization_id,
            plan_id: payment.plan_id,
            billing_cycle: payment.billing_cycle,
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            amount: payment.amount,
            payment_reference: reference,
            provider: 'paystack',
          }, { onConflict: 'organization_id' });
          
          if (upsertError) {
            console.error('❌ Failed to create subscription:', upsertError);
          } else {
            console.log('✅ Subscription activated!');
          }
        } else {
          console.error('❌ Payment record not found:', reference);
        }
      } else {
        console.log('ℹ️ Ignoring webhook event:', event.event);
      }

      // Always return 200 to acknowledge webhook
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // 404 - Route not found
    // ============================================
    console.log('❌ Route not found:', path);
    return new Response(
      JSON.stringify({ 
        error: 'Not found',
        path: path,
        message: 'Available routes: /paystack/initialize (POST), /paystack/verify/:ref (GET), /paystack/webhook (POST)',
        timestamp: new Date().toISOString(),
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌❌❌ Edge function error:', error);
    console.error('Stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});