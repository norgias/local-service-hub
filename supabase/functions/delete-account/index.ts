// supabase/functions/delete-account/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://localservicehub.net',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create a Supabase client with the Auth context of the logged in user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
      return new Response(JSON.stringify({ error: 'Failed to delete user data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Finally, delete the user from auth.users table
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteUserError) {
      console.error('Delete user error:', deleteUserError)
      return new Response(JSON.stringify({ error: 'Failed to delete user account' }), {
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
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
