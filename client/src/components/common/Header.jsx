import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiCalendar, FiHeart, FiLogOut, FiPlus } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import SearchBar from './SearchBar';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openAuthModal } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [location, closeMobileMenu]);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <FiCalendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary font-display">EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Search Bar */}
            <SearchBar />
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn btn-outline"
                >
                  {/* <FiPlus className="w-4 h-4" />*/}
                  New Event
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiUser className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/dashboard#saved"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiHeart className="w-4 h-4" />
                        <span>Saved Events</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="btn btn-primary"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6 text-gray-700" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchBar />
            </div>
            
            {/* Mobile Navigation */}
            <nav className="space-y-2 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile User Menu */}
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-primary text-white"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Create Event</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/dashboard#saved"
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <FiHeart className="w-4 h-4" />
                  <span>Saved Events</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    closeMobileMenu();
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    closeMobileMenu();
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;