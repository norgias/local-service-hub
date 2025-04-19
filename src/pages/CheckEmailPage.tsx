import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

const CheckEmailPage = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 flex flex-col items-center">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Phone className="h-12 w-12 text-teal-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Almost there!</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
          <p className="mb-4 text-lg">
            We've sent a verification link to your email. <br />
            Please check your inbox (or spam) and click the link to verify your account.
          </p>
          
          <div className="text-sm text-gray-400 mb-4">
            <p>The email should arrive within a few minutes. If you don't see it:</p>
            <ul className="list-disc list-inside mt-2 text-left">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Check other email folders</li>
            </ul>
          </div>
          
          <div className="text-sm bg-teal-900/30 p-4 rounded text-teal-300">
            You won't be able to access your CallBounce account until you verify your email address.
          </div>
        </div>
        
        <Link
          to="/login"
          className="px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-400 text-black font-semibold rounded-lg hover:from-teal-300 hover:to-blue-300 transition-all duration-300 inline-block"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default CheckEmailPage;
