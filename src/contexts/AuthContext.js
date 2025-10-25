"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import dataService from '../services/dataService';

const AuthContext = createContext();

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

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('homeAdminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check against demo credentials
        const demoUser = dataService.validateCredentials(email, password);
    
    if (demoUser) {
      const userData = {
        id: demoUser.email,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('homeAdminUser', JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (name, email, password, confirmPassword) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }
    
    if (email && password) {
      const userData = {
        id: Date.now(),
        email,
        name,
        role: 'admin',
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('homeAdminUser', JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('homeAdminUser');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
