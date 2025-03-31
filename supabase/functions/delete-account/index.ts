// supabase/functions/delete-account/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  // Allow requests from both www and non-www versions of the domain
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  // Add max age to reduce preflight requests
  'Access-Control-Max-Age': '86400'
}

// This function will check the origin and set the correct CORS header
const getCorsHeaders = (req) => {
  const origin = req.headers.get('Origin')
  const allowedOrigins = [
    'https://localservicehub.net',
    'https://www.localservicehub.net',
    // Add any other origins you need to support
  ]
  
  // If the origin is in our allowed list, use it, otherwise use '*'
  const headers = { ...corsHeaders }
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  
  return headers
}

serve(async (req) => {
  const corsWithOrigin = getCorsHeaders(req)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsWithOrigin })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsWithOrigin, 'Content-Type': 'application/json' }
      })
    }

    // Log request for debugging
    console.log(`Request received from origin: ${req.headers.get('Origin')}`)

    // Create a Supabase client with the Auth context of the logged in user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsWithOrigin, 'Content-Type': 'application/json' }
      })
    }

    // Get the JWT token from the Authorization header
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
        headers: { ...corsWithOrigin, 'Content-Type': 'application/json' }
      })
    }

    const userId = user.id

    // Get user email before deletion (might be needed for logs or confirmation)
    const { data: userData, error: userDataError } = await supabaseAdmin.auth.admin.getUserById(userId)
      
    if (userDataError) {
      console.warn('Could not retrieve user data before deletion:', userDataError)
      // Continue with deletion anyway
    }
    
    // Log the deletion attempt
    console.log(`Attempting to delete user: ${userId} (${userData?.user?.email || 'email unknown'})`)
    
    // Execute our custom function to delete all user data
    const { error: transactionError } = await supabaseAdmin.rpc('delete_user_data', {
      user_id: userId
    })

    if (transactionError) {
      console.error('Transaction error:', transactionError)
      return new Response(JSON.stringify({ error: 'Failed to delete user data', details: transactionError }), {
        status: 500,
        headers: { ...corsWithOrigin, 'Content-Type': 'application/json' }
      })
    }

    // Finally, delete the user from auth.users table
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteUserError) {
      console.error('Delete user error:', deleteUserError)
      return new Response(JSON.stringify({ error: 'Failed to delete user account', details: deleteUserError }), {
        status: 500,
        headers: { ...corsWithOrigin, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Successfully deleted user: ${userId}`)

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Account deleted successfully' 
    }), {
      status: 200,
      headers: { ...corsWithOrigin, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsWithOrigin, 'Content-Type': 'application/json' }
    })
  }
})
