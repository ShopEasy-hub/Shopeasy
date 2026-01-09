// Diagnostic Edge Function
// Call this from browser to check environment variables and configuration

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get authorization header if provided (but don't require it)
    const authHeader = req.headers.get('Authorization');
    
    console.log('🔍 Diagnostic request received');
    console.log('📍 Request method:', req.method);
    console.log('🔑 Has auth:', !!authHeader);

    // Get all environment variables (safely)
    const frontendUrl = Deno.env.get('FRONTEND_URL');
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    const flutterwaveKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    // Create diagnostic info
    const diagnostics = {
      timestamp: new Date().toISOString(),
      status: 'ok',
      message: 'Diagnostic check completed',
      environment: {
        FRONTEND_URL: {
          exists: !!frontendUrl,
          value: frontendUrl || 'NOT SET',
          isLocalhost: frontendUrl?.includes('localhost') || false,
          hasTrailingSlash: frontendUrl?.endsWith('/') || false,
          protocol: frontendUrl?.startsWith('https://') ? 'https' : frontendUrl?.startsWith('http://') ? 'http' : 'none',
        },
        PAYSTACK_SECRET_KEY: {
          exists: !!paystackKey,
          isLive: paystackKey?.startsWith('sk_live_') || false,
          isTest: paystackKey?.startsWith('sk_test_') || false,
          preview: paystackKey ? `${paystackKey.substring(0, 10)}...` : 'NOT SET',
        },
        FLUTTERWAVE_SECRET_KEY: {
          exists: !!flutterwaveKey,
          preview: flutterwaveKey ? `${flutterwaveKey.substring(0, 10)}...` : 'NOT SET',
        },
        SUPABASE_URL: {
          exists: !!supabaseUrl,
          value: supabaseUrl || 'NOT SET',
        },
      },
      checks: {
        frontendUrlConfigured: !!frontendUrl && frontendUrl !== 'http://localhost:3000',
        frontendUrlValid: !!frontendUrl && 
          frontendUrl.startsWith('https://') && 
          !frontendUrl.endsWith('/') && 
          !frontendUrl.includes('localhost'),
        paystackConfigured: !!paystackKey && (paystackKey.startsWith('sk_live_') || paystackKey.startsWith('sk_test_')),
        allConfigured: !!frontendUrl && !!paystackKey,
      },
      recommendations: [],
    };

    // Add recommendations based on findings
    if (!frontendUrl) {
      diagnostics.recommendations.push('⚠️ FRONTEND_URL is not set! Add it in Supabase Dashboard → Settings → Edge Functions → Secrets');
    } else if (frontendUrl === 'http://localhost:3000') {
      diagnostics.recommendations.push('⚠️ FRONTEND_URL is set to localhost! Change to production URL: https://shopeasy-lemon.vercel.app');
    } else if (frontendUrl.includes('localhost')) {
      diagnostics.recommendations.push('⚠️ FRONTEND_URL contains localhost! Change to production URL');
    } else if (!frontendUrl.startsWith('https://')) {
      diagnostics.recommendations.push('⚠️ FRONTEND_URL should use https:// not http://');
    } else if (frontendUrl.endsWith('/')) {
      diagnostics.recommendations.push('⚠️ FRONTEND_URL has trailing slash! Remove it: ' + frontendUrl.slice(0, -1));
    } else {
      diagnostics.recommendations.push('✅ FRONTEND_URL looks good!');
    }

    if (!paystackKey) {
      diagnostics.recommendations.push('⚠️ PAYSTACK_SECRET_KEY is not set!');
    } else if (paystackKey.startsWith('sk_test_')) {
      diagnostics.recommendations.push('ℹ️ Using PAYSTACK TEST mode');
    } else if (paystackKey.startsWith('sk_live_')) {
      diagnostics.recommendations.push('🔴 Using PAYSTACK LIVE mode - real money!');
    }

    // Generate sample callback URL
    if (frontendUrl) {
      diagnostics.sampleCallbackUrl = `${frontendUrl}?payment-callback=true&reference=SUB_1234567890_TEST`;
    }

    return new Response(
      JSON.stringify(diagnostics, null, 2),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
        } 
      }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error',
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
        } 
      }
    );
  }
});