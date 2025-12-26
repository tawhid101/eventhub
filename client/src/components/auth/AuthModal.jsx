import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import useUIStore from '../../store/uiStore';

const AuthModal = () => {
  const { isAuthModalOpen, authModalView, closeAuthModal } = useUIStore();
  const [isLoginView, setIsLoginView] = useState(authModalView === 'login');

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeAuthModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="px-8 pt-8 pb-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  {isLoginView ? 'Welcome Back' : 'Join EventHub'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {isLoginView ? 'Sign in to your account' : 'Create your account to get started'}
                </p>
              </div>
            </div>

            {/* Form Container */}
            <div className="px-8 pb-8">
              {isLoginView ? (
                <LoginForm onSuccess={closeAuthModal} />
              ) : (
                <RegisterForm onSuccess={closeAuthModal} />
              )}

              {/* Toggle View */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLoginView ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    onClick={toggleView}
                    className="ml-1 font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {isLoginView ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;