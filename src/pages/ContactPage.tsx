import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { categories } from '../data/categories';
import toast, { Toaster } from 'react-hot-toast';

export default function ContactPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    category: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          business_name: formData.businessName,
          email: formData.email,
          category: formData.category,
          message: formData.message
        });

      if (error) throw error;

      toast.success('Message sent successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        <Toaster position="top-center" />
        
        <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
        <p className="text-gray-400 mb-8">
          Interested in partnering with LocalServiceHub? Fill out the form below and we'll get back to you shortly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Business Name</label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
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
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              rows={6}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-400 text-black font-semibold rounded-lg hover:from-teal-300 hover:to-blue-300 transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}