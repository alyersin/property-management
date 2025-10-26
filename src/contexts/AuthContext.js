"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, API_ENDPOINTS } from '../constants/app';
import logger from '../utils/logger';

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
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      logger.auth('Login attempt', { email });
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
        logger.auth('Login successful', data.user);
        return { success: true };
      }
      
      logger.warn('Login failed', { email, error: data.error });
      return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
      logger.error('Login error', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      logger.auth('Registration attempt', { email });
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
        logger.auth('Registration successful', data.user);
        return { success: true };
      }
      
      logger.warn('Registration failed', { email, error: data.error });
      return { success: false, error: data.error || 'Registration failed' };
    } catch (error) {
      logger.error('Registration error', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    logger.auth('User logout');
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.user);
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
