import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { Building2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-black/95 text-white fixed w-full z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-teal-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                LocalServiceHub
              </span>
            </Link>
            <span className="text-white">Greater Toronto Area</span>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="hover:text-teal-400 transition-colors">
                  Categories
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-black/95 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                  <div className="py-1">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="block px-4 py-2 text-sm hover:bg-purple-500/20 hover:text-teal-400"
                      >
                        {category.icon} {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/get-in-touch" className="hover:text-teal-400 transition-colors">
                Get in Touch
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-blue-400 text-black rounded-lg hover:from-teal-300 hover:to-blue-300 transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hover:text-teal-400 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}