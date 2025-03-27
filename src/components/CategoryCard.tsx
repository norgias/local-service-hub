import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function CategoryCard({ id, name, icon, description }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${id}`}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-black via-black/95 to-purple-900/20 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 via-purple-500/10 to-blue-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <span className="text-4xl mb-4 block">{icon}</span>
        <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </Link>
  );
}