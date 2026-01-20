// Edge Function for creating organization users
// Handles both auth.users and user_profiles creation

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const { orgId, userData } = await req.json()

    // Validate input
    if (!orgId || !userData) {
      throw new Error('Missing required parameters')
    }

    const { name, email, password, role, branchId } = userData

    if (!name || !email || !password) {
      throw new Error('Missing required user data')
    }

    // Create Supabase client with service role key (has admin privileges)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Creating user:', email)

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUser?.users?.some(u => u.email?.toLowerCase() === email.toLowerCase())

    if (userExists) {
      throw new Error(`A user with email ${email} already exists`)
    }

    // Create auth user with admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: name,
        role: role,
        organization_id: orgId,
        branchId: branchId
      }
    })

    if (authError) {
      console.error('Auth creation error:', authError)
      throw new Error(`Failed to create auth user: ${authError.message}`)
    }

    console.log('Auth user created:', authData.user.id)

    // Create user profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: email,
        name: name,
        role: role || 'cashier',
        organization_id: orgId,
        assigned_branch_id: branchId || null,
        status: 'active'
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      
      // Rollback: Delete auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      throw new Error(`Failed to create profile: ${profileError.message}`)
    }

    console.log('Profile created:', profileData.id)

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        user: profileData,
        message: 'User created successfully and can login immediately'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
