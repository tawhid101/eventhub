import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useUIStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal('login');
    }
  }, [isAuthenticated, openAuthModal]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;