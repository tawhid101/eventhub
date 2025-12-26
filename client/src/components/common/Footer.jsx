import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white p-4">
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold font-display text-white">EventHub</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover and create amazing events in your area. Connect with your community and make lasting memories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=Music" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Music
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/events?category=Business" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/events?category=Arts" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Arts & Culture
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technology" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>123 Event Street</p>
              <p>San Francisco, CA 94105</p>
              <p>hello@eventhub.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Newsletter</h4>
              <p className="text-sm text-gray-300 mb-2">Get the latest events in your inbox</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                />
                <button className="px-4 py-2 bg-secondary text-white rounded-r-lg hover:bg-secondary/80 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © {currentYear} EventHub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;