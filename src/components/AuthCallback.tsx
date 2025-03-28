import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { handleAuthCallback } from '../lib/auth';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processAuthCallback() {
      try {
        setIsLoading(true);
        const { data, error } = await handleAuthCallback();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          toast.success('Logged in successfully!');
          navigate('/dashboard', { replace: true });
        } else {
          throw new Error('No session found');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
        toast.error('Authentication failed');
      } finally {
        setIsLoading(false);
      }
    }

    processAuthCallback();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-400 border-r-transparent"></div>
          <p className="mt-4">Completing authentication...</p>
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
