import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import RegisterForm from '../components/auth/RegisterForm';
import useAuthStore from '../store/authStore';

const RegisterPage = () => {
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
            <h1 className="text-3xl font-bold mb-2 font-display">Join EventHub</h1>
            <p className="opacity-90">Create an account to get started</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <RegisterForm onSuccess={() => navigate('/dashboard')} />

            {/* Additional Links */}
            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in here
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

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Why join EventHub?
          </h3>
          <div className="space-y-3">
            {[
              'Create and manage your own events',
              'Discover events in your area',
              'Save events you\'re interested in',
              'Connect with other event enthusiasts'
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By signing up, you agree to our{' '}
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

export default RegisterPage;