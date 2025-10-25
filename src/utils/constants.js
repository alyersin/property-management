// Navigation items for sidebar
export const NAVIGATION_ITEMS = [
  { href: "/dashboard", label: "🏠 Dashboard", icon: "🏠" },
  { href: "/properties", label: "🏘️ Properties", icon: "🏘️" },
  { href: "/tenants", label: "👥 Tenants", icon: "👥" },
  { href: "/finances", label: "💰 Finances", icon: "💰" },
  { href: "/expenses", label: "💸 Expenses", icon: "💸" },
  { href: "/settings", label: "⚙️ Settings", icon: "⚙️" },
];

// Status color mappings
export const STATUS_COLORS = {
  // Property statuses
  property: {
    Occupied: "green",
    Available: "blue", 
    Renovating: "orange",
  },
  // Tenant statuses
  tenant: {
    Current: "green",
    "Moving Out": "orange",
    "Past Due": "red",
  },
  // Payment statuses
  payment: {
    Paid: "green",
    Overdue: "red",
    Pending: "yellow",
  },
  // Expense statuses
  expense: {
    Paid: "green",
    Pending: "yellow",
    Overdue: "red",
  },
};

// Category color mappings
export const CATEGORY_COLORS = {
  Water: "blue",
  Electricity: "yellow",
  Heating: "orange",
  Garbage: "purple",
  Internet: "teal",
  Insurance: "red",
  Taxes: "red",
  Cleaning: "green",
  Landscaping: "green",
};

// Filter options for different pages
export const FILTER_OPTIONS = {
  properties: [
    { value: "Occupied", label: "Occupied" },
    { value: "Available", label: "Available" },
  ],
  tenants: [
    { value: "Current", label: "Current" },
    { value: "Moving Out", label: "Moving Out" },
    { value: "Past Due", label: "Past Due" },
  ],
  expenses: [
    { value: "Water", label: "Water" },
    { value: "Electricity", label: "Electricity" },
    { value: "Heating", label: "Heating" },
    { value: "Garbage", label: "Garbage" },
    { value: "Internet", label: "Internet" },
    { value: "Insurance", label: "Insurance" },
    { value: "Taxes", label: "Taxes" },
    { value: "Cleaning", label: "Cleaning" },
    { value: "Landscaping", label: "Landscaping" },
  ],
};
