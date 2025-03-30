import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the JWT token
    const token = authHeader.split(' ')[1];

    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token or user not found', details: authError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the user ID from the request body
    const { userId } = await req.json();
    
    // Verify that the authenticated user can only delete their own account
    if (userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'You can only delete your own account' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Begin transaction to delete user data from related tables
    // 1. Delete business profiles
    const { error: businessError } = await supabaseAdmin
      .from('businesses')
      .delete()
      .eq('owner_id', userId);
    
    if (businessError) {
      throw new Error(`Failed to delete business data: ${businessError.message}`);
    }

    // 2. Delete bookings
    const { error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .delete()
      .eq('user_id', userId);
    
    if (bookingsError) {
      throw new Error(`Failed to delete booking data: ${bookingsError.message}`);
    }

    // 3. Delete user reviews if you have any
    const { error: reviewsError } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('user_id', userId);
    
    if (reviewsError && !reviewsError.message.includes('does not exist')) {
      throw new Error(`Failed to delete review data: ${reviewsError.message}`);
    }

    // Finally, delete the user from auth
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteUserError) {
      throw new Error(`Failed to delete user account: ${deleteUserError.message}`);
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Account deleted successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    // Handle unexpected errors
    console.error('Error deleting account:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to delete account', 
        details: error.message || String(error) 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
