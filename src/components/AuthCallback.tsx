import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { handleAuthCallback } from '../lib/auth';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processAuthRedirect() {
      try {
        setIsLoading(true);
        
        // Process the auth callback
        const { data, error } = await handleAuthCallback();
        
        if (error) {
          throw error;
        }
        
        if (data?.session || data?.redirectTo || data?.user) {
          toast.success('Logged in successfully!');
          
          // If we have a redirectTo URL from token verification, navigate there
          if (data.redirectTo) {
            window.location.href = data.redirectTo;
            return;
          }
          
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error('Authentication failed');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
        toast.error('Authentication failed');
      } finally {
        setIsLoading(false);
      }
    }

    processAuthRedirect();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-t-teal-400 border-r-teal-400 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-400 text-black font-semibold rounded-lg hover:from-teal-300 hover:to-blue-300 transition-all duration-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <Navigate to="/dashboard" replace />;
}
