import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

export default function BookingPage() {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    async function fetchBusiness() {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', businessSlug)
        .single();

      if (error || !data) {
        navigate('/');
        return;
      }

      setBusiness(data);
      setLoading(false);
    }

    fetchBusiness();
  }, [businessSlug, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const bookingDate = new Date(`${formData.date}T${formData.time}`);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          business_id: business.id,
          customer_name: formData.name,
          customer_email: formData.email,
          service_requested: formData.service,
          booking_date: bookingDate.toISOString()
        });

      if (error) throw error;

      toast.success('Booking submitted successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        <Toaster position="top-center" />
        
        <h1 className="text-3xl font-bold mb-2">Book with {business.name}</h1>
        <p className="text-gray-400 mb-8">{business.description}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
          </div>

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
            <label className="block text-sm font-medium mb-2">Service Requested</label>
            <textarea
              required
              value={formData.service}
              onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-400 text-black font-semibold rounded-lg hover:from-teal-300 hover:to-blue-300 transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}