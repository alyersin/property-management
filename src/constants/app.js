// Application constants and configuration
// Centralized location for all magic strings and hardcoded values

export const API_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register"
};

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  settings: "/settings"
};

export const LOADING_MESSAGES = {
  default: "Loading...",
  saving: "Saving...",
  deleting: "Deleting...",
  authenticating: "Authenticating..."
};

export const STORAGE_KEYS = {
  user: "homeAdminUser",
  theme: "homeAdminTheme",
  preferences: "homeAdminPreferences"
};

export const DEMO_CREDENTIALS = {
  email: "demo@homeadmin.ro",
  password: "demo123",
  name: "Demo User"
};
