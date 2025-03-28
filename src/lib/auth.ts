import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signInWithGoogle() {
  // Get Google authentication URL
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      // Store information to handle secure verification
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  
  return { data, error };
}

// New function to verify Google ID token with our Edge Function
export async function verifyGoogleToken(idToken: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-google-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to verify token');
    }
    
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Modified to extract token information
export async function handleAuthCallback() {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const queryParams = new URLSearchParams(window.location.search);
  
  // Check for error in the callback
  const error = hashParams.get('error') || queryParams.get('error');
  if (error) {
    return { data: null, error: new Error(error) };
  }
  
  // Check for Google ID token
  const idToken = hashParams.get('id_token');
  if (idToken) {
    // Verify the ID token with our secure edge function
    return await verifyGoogleToken(idToken);
  }
  
  // If no ID token, fall back to checking session (for password auth)
  const { data, error: sessionError } = await supabase.auth.getSession();
  return { data, error: sessionError };
}
