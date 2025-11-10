// Application constants and configuration
// Centralized location for all magic strings and hardcoded values

export const APP_CONFIG = {
  name: "Home Admin",
  description: "Property Management System",
  version: "1.0.0",
  author: "Home Admin Team"
};

export const API_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register"
};

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  properties: "/properties",
  finances: "/finances",
  settings: "/settings"
};

export const USER_ROLES = {
  admin: "admin",
  manager: "manager",
  user: "user"
};

export const DATA_TYPES = {
  properties: "properties",
  financialRecords: "financialRecords"
};

export const STATUS_OPTIONS = {
  all: "all",
  active: "active",
  inactive: "inactive",
  pending: "pending",
  completed: "completed"
};

export const NOTIFICATION_TYPES = {
  email: "email",
  sms: "sms",
  repair: "repair",
  payments: "payments"
};

export const DEFAULT_PAGINATION = {
  pageSize: 10,
  currentPage: 1
};

export const LOADING_MESSAGES = {
  default: "Loading...",
  saving: "Saving...",
  deleting: "Deleting...",
  authenticating: "Authenticating..."
};

export const ERROR_MESSAGES = {
  network: "Network error. Please try again.",
  unauthorized: "Unauthorized access.",
  notFound: "Item not found.",
  validation: "Please check your input and try again.",
  generic: "Something went wrong. Please try again."
};

export const SUCCESS_MESSAGES = {
  saved: "Changes saved successfully!",
  deleted: "Item deleted successfully!",
  created: "Item created successfully!",
  updated: "Item updated successfully!"
};

export const FORM_VALIDATION = {
  required: "This field is required",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must be no more than ${max} characters`
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
