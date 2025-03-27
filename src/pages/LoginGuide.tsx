import React from 'react';

export default function LoginGuide() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Google OAuth Setup Guide</h1>
        
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-black via-black/95 to-purple-900/20 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Step 1: Access Authentication Settings</h2>
            <img 
              src="https://images.unsplash.com/photo-1674776374106-0f779a1a8d6d?auto=format&fit=crop&q=80&w=2000" 
              alt="Supabase Authentication Settings"
              className="rounded-lg border-2 border-gray-800 mb-4"
            />
            <p className="text-gray-400">
              1. Navigate to your Supabase project dashboard<br />
              2. Click on "Authentication" in the left sidebar<br />
              3. Select "Providers" tab
            </p>
          </div>

          <div className="bg-gradient-to-br from-black via-black/95 to-purple-900/20 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Step 2: Configure Google Provider</h2>
            <img 
              src="https://images.unsplash.com/photo-1674776374382-a4f4c141e4a7?auto=format&fit=crop&q=80&w=2000" 
              alt="Google Provider Configuration"
              className="rounded-lg border-2 border-gray-800 mb-4"
            />
            <p className="text-gray-400">
              1. Find and click on the Google provider card<br />
              2. Toggle the switch to enable Google authentication<br />
              3. You should now see fields for:<br />
              &nbsp;&nbsp;&nbsp;- Client ID<br />
              &nbsp;&nbsp;&nbsp;- Client Secret<br />
              &nbsp;&nbsp;&nbsp;- Authorized Client Domains (optional)
            </p>
          </div>

          <div className="bg-gradient-to-br from-black via-black/95 to-purple-900/20 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">Step 3: Save Configuration</h2>
            <p className="text-gray-400">
              1. Enter your Google OAuth credentials<br />
              2. Click the "Save" button at the bottom<br />
              3. You should see a success message confirming the changes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}