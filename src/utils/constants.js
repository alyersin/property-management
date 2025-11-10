// Navigation items for sidebar
export const NAVIGATION_ITEMS = [
  { href: "/dashboard", label: "🏠 Dashboard", icon: "🏠" },
  { href: "/properties", label: "🏘️ Properties", icon: "🏘️" },
  { href: "/finances", label: "💰 Finances & Expenses", icon: "💰" },
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
};

// Filter options for different pages
export const FILTER_OPTIONS = {
  properties: [
    { value: "Occupied", label: "Occupied" },
    { value: "Available", label: "Available" },
  ],
  financialRecords: [
    { value: "Completed", label: "Completed" },
    { value: "Pending", label: "Pending" },
    { value: "Overdue", label: "Overdue" },
  ],
};
