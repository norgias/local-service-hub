import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DeleteAccount from '../components/DeleteAccount';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <div className="bg-gradient-to-br from-black via-black/95 to-purple-900/20 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Account ID</p>
              <p className="font-mono text-sm">{user?.id}</p>
            </div>
            <div>
              <p className="text-gray-400">Account Created</p>
              <p className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-black via-black/95 to-purple-900/20 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Account Management</h2>
          
          {/* Add more settings options here as needed */}
          
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
