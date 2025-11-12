"use client";

/**
 * AuthContext - Authentication Context Provider
 * 
 * Manages user authentication state across the application including:
 * - User login/logout functionality
 * - User registration
 * - Persistent authentication state via localStorage
 * - User data updates
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, API_ENDPOINTS } from '../constants/app';

// Create the authentication context
const AuthContext = createContext();

/**
 * Custom hook to access authentication context
 * @returns {Object} Auth context with user, login, register, logout, loading, and updateUser
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider - Provides authentication context to child components
 * @param {React.ReactNode} children - Child components that need access to auth context
 */
export const AuthProvider = ({ children }) => {
  // Current authenticated user state (null if not logged in)
  const [user, setUser] = useState(null);
  // Loading state for async operations (login, register, initial load)
  const [loading, setLoading] = useState(true);

  /**
   * Initialize authentication state from localStorage on mount
   * Restores user session if they were previously logged in
   */
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

  /**
   * Login function - Authenticates user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, error?: string}>} Login result
   */
  const login = async (email, password) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AUTH] Login attempt', { email });
      }
      setLoading(true);
      
      // Send login request to API
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // If login successful, update state and persist to localStorage
      if (data.success) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
        if (process.env.NODE_ENV === 'development') {
          console.log('[AUTH] Login successful', data.user);
        }
        setLoading(false);
        return { success: true };
      }
      
      // Login failed - return error message
      if (process.env.NODE_ENV === 'development') {
        console.warn('[WARN] Login failed', { email, error: data.error });
      }
      setLoading(false);
      return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
      // Network or other errors
      console.error('[ERROR] Login error', error);
      setLoading(false);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /**
   * Register function - Creates a new user account
   * @param {string} name - User's full name
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} confirmPassword - Password confirmation (should match password)
   * @returns {Promise<{success: boolean, error?: string}>} Registration result
   */
  const register = async (name, email, password, confirmPassword) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AUTH] Registration attempt', { email });
      }
      setLoading(true);
      
      // Send registration request to API
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await response.json();

      // If registration successful, update state and persist to localStorage
      if (data.success) {
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
        if (process.env.NODE_ENV === 'development') {
          console.log('[AUTH] Registration successful', data.user);
        }
        setLoading(false);
        return { success: true };
      }
      
      // Registration failed - return error message
      if (process.env.NODE_ENV === 'development') {
        console.warn('[WARN] Registration failed', { email, error: data.error });
      }
      setLoading(false);
      return { success: false, error: data.error || 'Registration failed' };
    } catch (error) {
      // Network or other errors
      console.error('[ERROR] Registration error', error);
      setLoading(false);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /**
   * Logout function - Clears user session and removes from localStorage
   */
  const logout = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] User logout');
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.user);
    setLoading(false);
  };

  /**
   * Update user function - Updates user data and persists to localStorage
   * @param {Object} updates - Object containing user properties to update
   */
  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(next));
      return next;
    });
  };

  // Context value object - all values and functions available to consuming components
  const value = {
    user,           // Current user object (null if not authenticated)
    login,          // Login function
    register,       // Registration function
    logout,         // Logout function
    loading,        // Loading state for async operations
    updateUser,     // Update user data function
  };

  // Provide authentication context to all child components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
