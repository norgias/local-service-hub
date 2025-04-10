import React from 'react';
import { categories } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import HeroCarousel from '../components/HeroCarousel';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-teal-900/20 z-10" />
        <HeroCarousel />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
            Bounce back from missed Calls!
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Studies show that the average small business loses $150-$250 per missed call. Stop missing out, sign up today!
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Explore Our Service Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
}
