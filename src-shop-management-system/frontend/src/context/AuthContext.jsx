import React, { createContext, useContext, useState, useEffect } from "react";
import authAPI from "../api/authAPI";

export const AuthContext = createContext(); 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  // Khôi phục user từ localStorage ngay khi load app
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Tự động redirect nếu là admin và đang ở trang không phải admin
        if (parsedUser.isAdmin && window.location.pathname !== '/admin') {
          setRedirectPath('/admin');
        }
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (redirectPath) {
      window.location.href = redirectPath;
      setRedirectPath(null);
    }
  }, [redirectPath]);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authAPI.getProfile();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Kiểm tra và redirect nếu là admin
      if (userData.isAdmin && window.location.pathname !== '/admin') {
        setRedirectPath('/admin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await authAPI.login({ email, password });
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Thiết lập redirect path dựa trên role
      if (userData.isAdmin) {
        setRedirectPath('/admin');
      } else {
        setRedirectPath('/');
      }
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authAPI.register(userData);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result));
      setUser(result);
      
      // Thiết lập redirect path dựa trên role
      if (result.isAdmin) {
        setRedirectPath('/admin');
      } else {
        setRedirectPath('/');
      }
      
      return result;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setRedirectPath('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};