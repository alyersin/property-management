"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, API_ENDPOINTS } from '../constants/app';

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
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEYS.user);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (error) {
        console.error('[ERROR] Failed to parse stored user', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AUTH] Login attempt', { email });
      }
      setLoading(true);
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
        if (process.env.NODE_ENV === 'development') {
          console.log('[AUTH] Login successful', data.user);
        }
        setLoading(false);
        return { success: true };
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('[WARN] Login failed', { email, error: data.error });
      }
      setLoading(false);
      return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
      console.error('[ERROR] Login error', error);
      setLoading(false);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AUTH] Registration attempt', { email });
      }
      setLoading(true);
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
        if (process.env.NODE_ENV === 'development') {
          console.log('[AUTH] Registration successful', data.user);
        }
        setLoading(false);
        return { success: true };
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('[WARN] Registration failed', { email, error: data.error });
      }
      setLoading(false);
      return { success: false, error: data.error || 'Registration failed' };
    } catch (error) {
      console.error('[ERROR] Registration error', error);
      setLoading(false);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] User logout');
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.user);
    setLoading(false);
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(next));
      return next;
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
