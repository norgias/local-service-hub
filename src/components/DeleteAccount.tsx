import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setConfirmText('');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion');
      return;
    }

    setIsDeleting(true);
    try {
      const { success, error } = await deleteAccount(user.id);
      
      if (error) {
        throw error;
      }
      
      if (success) {
        toast.success('Your account has been successfully deleted');
        // Log the user out and redirect to home page
        await logout();
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete your account. Please try again later.');
    } finally {
      setIsDeleting(false);
      handleCloseModal();
    }
  };

  return (
    <div>
      <div className="border-t border-gray-800 my-8 pt-8">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Danger Zone</h2>
        <p className="text-gray-400 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete My Account
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Delete Your Account</h3>
            
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-4">
              <p className="text-white mb-2">⚠️ This action cannot be undone. Please be certain.</p>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                <li>Your business profile will be removed from search results</li>
                <li>All your business data will be permanently deleted</li>
                <li>Any active bookings will be cancelled</li>
                <li>Your account credentials will be permanently deleted</li>
              </ul>
            </div>
            
            <p className="text-gray-300 mb-4">
              To confirm, please type <span className="font-mono font-bold">DELETE</span> in the field below:
            </p>
            
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white mb-4 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="Type DELETE to confirm"
            />
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting || confirmText !== 'DELETE'}
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
