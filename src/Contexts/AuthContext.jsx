// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast'; // Import useToast

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Inisialisasi state dari localStorage saat aplikasi dimuat
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error("Failed to retrieve token from localStorage", error);
      return null;
    }
  });

  const isLoggedIn = !!user && !!token;

  // Efek untuk menyimpan user dan token ke localStorage setiap kali berubah
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        toast({
          title: "Login Berhasil",
          description: `Selamat datang, ${data.user.username}!`,
        });

        // Arahkan pengguna berdasarkan role
        if (data.user.role === 'SUPER_ADMIN') {
          navigate('/super-admin/dashboard');
        } else if (data.user.role === 'ADMIN_DAERAH') {
          navigate('/admin-daerah/dashboard');
        } else {
          navigate('/user/dashboard'); // Asumsi role default adalah user biasa
        }
        return true; // Login berhasil
      } else {
        // Tangani error dari backend
        toast({
          title: "Login Gagal",
          description: data.message || "Email atau password salah. Silakan coba lagi.",
          variant: "destructive",
        });
        return false; // Login gagal
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Tidak dapat terhubung ke server. Silakan coba lagi nanti.",
        variant: "destructive",
      });
      return false; // Login gagal karena error jaringan/lainnya
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah berhasil keluar.",
    });
    navigate('/login'); // Arahkan ke halaman login setelah logout
  };

  const authValue = {
    user,
    token,
    isLoggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};