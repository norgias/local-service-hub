import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { categories } from '../data/categories';
import { ExternalLink, Calendar } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  description: string;
  slug: string;
  accepts_onsite_booking: boolean;
  affiliate_url: string | null;
}

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const category = categories.find(c => c.id === categoryId);

  useEffect(() => {
    async function fetchBusinesses() {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('category', categoryId);

      if (error) {
        console.error('Error fetching businesses:', error);
        return;
      }

      setBusinesses(data || []);
      setLoading(false);
    }

    fetchBusinesses();
  }, [categoryId]);

  if (!category) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Category not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <span className="text-3xl">{category.icon}</span>
            {category.name}
          </h1>
          <p className="text-gray-400">{category.description}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-gradient-to-br from-black via-black/95 to-purple-900/20 rounded-xl p-6 group hover:scale-[1.02] transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">{business.name}</h3>
                <p className="text-gray-400 mb-6">{business.description}</p>
                <div className="flex gap-3">
                  {business.accepts_onsite_booking ? (
                    <Link
                      to={`/book/${business.slug}`}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-400 text-black rounded-lg hover:bg-teal-300 transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Now
                    </Link>
                  ) : (
                    <a
                      href={business.affiliate_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
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