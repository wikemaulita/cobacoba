// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'SUPER_ADMIN':
        return <Navigate to="/super-admin/dashboard" replace />;
      case 'ADMIN_DAERAH':
        return <Navigate to="/admin-daerah/dashboard" replace />;
      case 'USER': 
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/404" replace />; 
    }
  }

  return children;
};

export default ProtectedRoute;