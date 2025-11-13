/**
 * Application Constants and Configuration
 * 
 * Centralized location for all magic strings and hardcoded values used throughout the application.
 * This file follows the DRY (Don't Repeat Yourself) principle by providing a single source of truth
 * for routes, API endpoints, storage keys, and other constants.
 * 
 * Benefits:
 * - Easy to update values in one place
 * - Prevents typos and inconsistencies
 * - Improves maintainability
 * - Better IDE autocomplete support
 */

/**
 * API Endpoints
 * 
 * Backend API route paths for making HTTP requests.
 * These correspond to the route.js files in src/app/api/
 */
export const API_ENDPOINTS = {
  login: "/api/auth/login", // POST endpoint for user authentication
  register: "/api/auth/register" // POST endpoint for creating new user accounts
};

/**
 * Application Routes
 * 
 * Frontend page routes used for navigation and routing.
 * These correspond to the page.js files in src/app/
 */
export const ROUTES = {
  home: "/", // Home/landing page route
  login: "/login", // User login page route
  register: "/register", // User registration page route
  dashboard: "/dashboard", // Main dashboard page route
  settings: "/settings" // User settings page route
};

/**
 * Loading Messages
 * 
 * User-facing loading state messages displayed during async operations.
 * Used to provide feedback to users while actions are being processed.
 */
export const LOADING_MESSAGES = {
  default: "Loading...", // Default loading message for general operations
  saving: "Saving...", // Message shown when saving data
  deleting: "Deleting...", // Message shown when deleting data
  authenticating: "Authenticating..." // Message shown during authentication processes
};

/**
 * LocalStorage Keys
 * 
 * Keys used for storing data in browser's localStorage.
 * These keys ensure consistent access to persisted user data, preferences, and settings.
 */
export const STORAGE_KEYS = {
  user: "homeAdminUser", // Key for storing authenticated user data
  theme: "homeAdminTheme", // Key for storing user's theme preference
  preferences: "homeAdminPreferences" // Key prefix for storing user preferences (used with data type suffix)
};

/**
 * Demo Credentials
 * 
 * Demo account credentials displayed on the login page for testing purposes.
 * These are shown to users to allow quick access to the application for demonstration.
 */
export const DEMO_CREDENTIALS = {
  email: "demo@homeadmin.ro", // Demo user email address
  password: "demo123", // Demo user password
  name: "Demo User" // Demo user display name
};

/**
 * Tab Items
 * 
 * Navigation tabs for the main dashboard application.
 * Used in the Sidebar component for tab-based navigation.
 */
export const TAB_ITEMS = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "properties", label: "🏘️ Properties" },
  { id: "tenants", label: "👥 Tenants" },
];
