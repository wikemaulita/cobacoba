// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { loginUser, registerRegularUser } from '@/lib/api'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
      const response = await loginUser(email, password); 
      const data = response.data; 

      if (response.status === 200) { 
        setUser(data.user);
        setToken(data.token);
        toast({
          title: "Login Berhasil",
          description: `Selamat datang, ${data.user.username}!`,
        });

        if (data.user.role === 'SUPER_ADMIN') {
          navigate('/super-admin/dashboard');
        } else if (data.user.role === 'ADMIN_DAERAH') {
          navigate('/admin-daerah/dashboard');
        } else {
          navigate('/user/dashboard'); 
        }
        return true;
      } else {
        toast({
          title: "Login Gagal",
          description: data.message || "Email atau password salah. Silakan coba lagi.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: error.response?.data?.message || "Tidak dapat terhubung ke server. Silakan coba lagi nanti.",
        variant: "destructive",
      });
      return false;
    }
  };

  const registerUser = async (username, email, password) => {
    try {
      const response = await registerRegularUser(username, email, password); 
      const data = response.data; 

      if (response.status === 200) { 
        toast({
          title: "Pendaftaran Berhasil",
          description: data.message || "Akun Anda berhasil dibuat. Silakan login.",
        });
        navigate('/login');
        return true;
      } else {
        toast({
          title: "Pendaftaran Gagal",
          description: data.message || "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: error.response?.data?.message || "Tidak dapat terhubung ke server. Silakan coba lagi nanti.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    toast({
      title: "Logout Berhasil",
      description: "Anda telah berhasil keluar.",
    });
    navigate('/login');
  };

  const authValue = {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    registerUser,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};