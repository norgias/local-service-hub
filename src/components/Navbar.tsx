import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/categories';
import { Phone, User, Menu, X } from 'lucide-react'; // Changed Building2 to Phone
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCategories = (e) => {
    e.stopPropagation();
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };

    // Add event listener when the dropdown is open
    if (isCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoriesOpen]);

  return (
    <nav className="bg-black/95 text-white fixed w-full z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Phone className="h-8 w-8 text-teal-400" /> {/* Changed to Phone icon */}
              <span className="text-xl font-bold bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                Call Bounce 
              </span>
            </Link>
            <span className="hidden sm:inline text-white"></span>
            <span className="inline sm:hidden text-white"></span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="hover:text-teal-400 transition-colors" 
                  onClick={toggleCategories}
                >
                  Categories
                </button>
                {isCategoriesOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-black/95 ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          className="block px-4 py-2 text-sm hover:bg-purple-500/20 hover:text-teal-400"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          {category.icon} {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? (
                <X className="block h-6 w-6 text-teal-400" />
              ) : (
                <Menu className="block h-6 w-6 text-teal-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95">
            <div className="py-1">
              <button className="block w-full text-left px-4 py-2 text-white hover:bg-purple-500/20 hover:text-teal-400">
                Categories
              </button>
              <div className="pl-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="block px-4 py-2 text-sm hover:bg-purple-500/20 hover:text-teal-400"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.icon} {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/get-in-touch"
              className="block px-4 py-2 text-white hover:bg-purple-500/20 hover:text-teal-400"
              onClick={() => setIsOpen(false)}
            >
              Get in Touch
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-white hover:bg-purple-500/20 hover:text-teal-400"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Dashboard
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-white hover:bg-purple-500/20 hover:text-teal-400"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
