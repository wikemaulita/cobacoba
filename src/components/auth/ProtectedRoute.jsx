// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; //

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useAuth(); //

  if (!isLoggedIn) {
    // Jika tidak login, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika user ada tapi rolenya tidak diizinkan
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Arahkan ke dashboard yang sesuai dengan role atau ke halaman 404/unauthorized
    switch (user.role) {
      case 'SUPER_ADMIN':
        return <Navigate to="/super-admin/dashboard" replace />;
      case 'ADMIN_DAERAH':
        return <Navigate to="/admin-daerah/dashboard" replace />;
      case 'USER': // Asumsi user biasa memiliki role 'USER'
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/404" replace />; // Atau halaman unauthorized
    }
  }

  // Jika login dan role sesuai, tampilkan konten anak-anak
  return children;
};

export default ProtectedRoute;