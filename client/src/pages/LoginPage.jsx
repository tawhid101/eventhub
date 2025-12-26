import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import LoginForm from '../components/auth/LoginForm';
import useAuthStore from '../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-primary font-display">EventHub</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 bg-gradient-to-r from-primary to-secondary text-white text-center">
            <h1 className="text-3xl font-bold mb-2 font-display">Welcome Back</h1>
            <p className="opacity-90">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <LoginForm onSuccess={() => navigate('/dashboard')} />

            {/* Additional Links */}
            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
              
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors"
              >
                <FiArrowRight className="mr-1 rotate-180" />
                Back to home
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;