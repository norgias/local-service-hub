import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Google's OAuth2 token info endpoint
const GOOGLE_TOKEN_INFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

// Your Google OAuth Client ID (used to verify the token was issued for your app)
const GOOGLE_CLIENT_ID = Deno.env.get('633895495621-d6q47mdhp5sv93id6akufncmel6eq4er.apps.googleusercontent.com');

interface TokenVerificationRequest {
  idToken: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      status: 204,
    });
  }

  try {
    // Parse the request body
    const { idToken } = await req.json() as TokenVerificationRequest;
    
    if (!idToken) {
      return new Response(
        JSON.stringify({ error: 'ID token is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify the token with Google
    const response = await fetch(`${GOOGLE_TOKEN_INFO_URL}?id_token=${idToken}`);
    const tokenInfo = await response.json();

    // Verify that the token is valid
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Invalid token', details: tokenInfo }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify that the token was issued for your application
    if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
      return new Response(
        JSON.stringify({ error: 'Token not issued for this application' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Token is valid, proceed with authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get or create the user in your database
    const { data: user, error: userError } = await supabaseClient.auth.admin.getUserByEmail(tokenInfo.email);

    if (userError && userError.message !== 'User not found') {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user', details: userError }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If the user doesn't exist, create a new one
    if (!user) {
      const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
        email: tokenInfo.email,
        email_verified: true,
        user_metadata: {
          full_name: tokenInfo.name,
          avatar_url: tokenInfo.picture,
          provider: 'google',
          provider_id: tokenInfo.sub,
        },
      });

      if (createError) {
        return new Response(
          JSON.stringify({ error: 'Failed to create user', details: createError }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Generate a session for the user
    const { data: session, error: sessionError } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: tokenInfo.email,
    });

    if (sessionError) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate session', details: sessionError }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        redirectTo: session.properties.action_link 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  }
});
