import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp, signInWithGoogle } from '../lib/auth';
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password);
      if (error) throw error;

      // Change redirect to check-email page instead of login
      toast.success('Account created! Please check your email to verify.');
      navigate('/check-email');
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      toast.error('Failed to sign in with Google.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-md mx-auto">
        <Toaster position="top-center" />
        
        <h1 className="text-3xl font-bold mb-6">Create Your Account</h1>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mb-6 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">Or continue with email</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-400 text-black font-semibold rounded-lg hover:from-teal-300 hover:to-blue-300 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
