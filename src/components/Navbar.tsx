import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black/95 text-white fixed w-full z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Phone className="h-8 w-8 text-teal-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                Call Bounce 
              </span>
            </Link>
            <span className="hidden sm:inline text-white">Automated missed call text-back service</span>
            <span className="inline sm:hidden text-white"></span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/signup" className="hover:text-teal-400 transition-colors">
                Sign Up
              </Link>
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
            <Link
              to="/signup"
              className="block px-4 py-2 text-white hover:bg-purple-500/20 hover:text-teal-400"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
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
