// supabase/functions/delete-user-account/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'


//Import CORS headers from shared file
import { corsHeaders } from '../_shared/cors.ts'


serve(async (req) => {
  // Handle CORS preflight OPTIONS request immediately
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request')
    return new Response(null, {
      status: 204, // No Content is appropriate for OPTIONS
      headers: corsHeaders
    })
  }

  console.log(`Received ${req.method} request`)

  // Continue with the rest of your function...
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
  
  try {
    // Log for debugging
    console.log('Processing delete account request')
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')

    // Create a Supabase client with Admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false }
      }
    )

    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      console.error('User verification error:', userError)
      return new Response(JSON.stringify({ error: 'Unauthorized', details: userError }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const userId = user.id
    console.log(`Authenticated user ID: ${userId}`)

    // Get user email before deletion
    const { data: userData, error: userDataError } = await supabaseAdmin.auth.admin.getUserById(userId)
      
    if (userDataError) {
      console.warn('Could not retrieve user data before deletion:', userDataError)
    }
    
    console.log(`Attempting to delete user: ${userId} (${userData?.user?.email || 'email unknown'})`)
    
    // Execute our custom function to delete all user data
    const { error: transactionError } = await supabaseAdmin.rpc('delete_user_data', {
      user_id: userId
    })

    if (transactionError) {
      console.error('Transaction error:', transactionError)
      return new Response(JSON.stringify({ error: 'Failed to delete user data', details: transactionError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Delete the user from auth.users table
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteUserError) {
      console.error('Delete user error:', deleteUserError)
      return new Response(JSON.stringify({ error: 'Failed to delete user account', details: deleteUserError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Successfully deleted user: ${userId}`)

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Account deleted successfully' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
