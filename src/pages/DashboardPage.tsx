import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Building2, LogOut } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  accepts_onsite_booking: boolean;
  bookings: {
    id: string;
    customer_name: string;
    booking_date: string;
    service_requested: string;
  }[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const { data: businessOwners, error: ownerError } = await supabase
          .from('business_owners')
          .select('business_id')
          .eq('user_id', user?.id);

        if (ownerError) throw ownerError;

        const businessIds = businessOwners?.map(bo => bo.business_id) || [];

        const { data: businessesData, error: businessError } = await supabase
          .from('businesses')
          .select(`
            *,
            bookings (
              id,
              customer_name,
              booking_date,
              service_requested
            )
          `)
          .in('id', businessIds)
          .order('created_at', { ascending: false });

        if (businessError) throw businessError;

        setBusinesses(businessesData || []);
      } catch (error) {
        toast.error('Failed to load businesses');
      } finally {
        setLoading(false);
      }
    }

    fetchBusinesses();
  }, [user]);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <Toaster position="top-center" />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Business Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Businesses Yet</h2>
            <p className="text-gray-400 mb-6">Get started by adding your first business</p>
            <button
              onClick={() => navigate('/get-in-touch')}
              className="px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-400 text-black font-semibold rounded-lg hover:from-teal-300 hover:to-blue-300 transition-all duration-300"
            >
              Add Business
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-gradient-to-br from-black via-black/95 to-purple-900/20 rounded-xl p-6"
              >
                <h2 className="text-2xl font-semibold mb-2">{business.name}</h2>
                <p className="text-gray-400 mb-4">{business.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Recent Bookings</h3>
                  {business.bookings && business.bookings.length > 0 ? (
                    <div className="grid gap-4">
                      {business.bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-gray-900/50 rounded-lg p-4"
                        >
                          <p className="font-medium mb-1">{booking.customer_name}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(booking.booking_date).toLocaleDateString()} at{' '}
                            {new Date(booking.booking_date).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            {booking.service_requested}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No bookings yet</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}