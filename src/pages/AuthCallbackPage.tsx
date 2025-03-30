// src/pages/AuthCallbackPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAuthCallback } from '../lib/auth';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processAuthRedirect() {
      try {
        const { data, error } = await handleAuthCallback();
        
        if (error) {
          setError(error.message);
          return;
        }
        
        // Redirect to dashboard on successful auth
        navigate('/dashboard');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed');
      }
    }

    processAuthRedirect();
  }, [navigate]);

  if (error) {
    return <div className="p-8">Authentication error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-white text-center">
        <div className="w-16 h-16 border-4 border-t-teal-400 border-r-teal-400 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl">Completing authentication...</p>
      </div>
    </div>
  );
}
