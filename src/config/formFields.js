// Form field configurations for different data types

export const PROPERTY_FIELDS = [
  { name: 'address', label: 'Address', type: 'text', required: true, placeholder: 'Enter property address' },
  { name: 'city', label: 'City', type: 'text', required: true, placeholder: 'Enter city' },
  { name: 'state', label: 'State', type: 'text', required: true, placeholder: 'Enter state' },
  { name: 'zip', label: 'ZIP Code', type: 'text', required: true, placeholder: 'Enter ZIP code' },
  { name: 'bedrooms', label: 'Bedrooms', type: 'number', required: true, min: 1, max: 10 },
  { name: 'bathrooms', label: 'Bathrooms', type: 'number', required: true, min: 1, max: 10, step: 0.5 },
  { name: 'sqft', label: 'Square Feet', type: 'number', required: true, min: 100 },
  { name: 'rent', label: 'Monthly Rent', type: 'number', required: true, min: 0, step: 0.01 },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select', 
    required: true,
    options: [
      { value: 'Available', label: 'Available' },
      { value: 'Occupied', label: 'Occupied' },
      { value: 'Renovating', label: 'Renovating' }
    ]
  },
  { name: 'tenant', label: 'Tenant Name', type: 'text', placeholder: 'Enter tenant name' },
  { name: 'tenantEmail', label: 'Tenant Email', type: 'email', placeholder: 'Enter tenant email' },
  { name: 'tenantPhone', label: 'Tenant Phone', type: 'tel', placeholder: 'Enter tenant phone' },
  { name: 'leaseEnd', label: 'Lease End Date', type: 'date' },
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Enter any additional notes' }
];

export const TENANT_FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter email address' },
  { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: 'Enter phone number' },
  { 
    name: 'propertyId', 
    label: 'Property', 
    type: 'select', 
    required: true,
    options: [] // Will be populated dynamically
  },
  { name: 'leaseStart', label: 'Lease Start Date', type: 'date', required: true },
  { name: 'leaseEnd', label: 'Lease End Date', type: 'date', required: true },
  { name: 'rentAmount', label: 'Monthly Rent', type: 'number', required: true, min: 0, step: 0.01 },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select', 
    required: true,
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Prospective', label: 'Prospective' },
      { value: 'Inactive', label: 'Inactive' }
    ]
  },
  { name: 'emergencyContact', label: 'Emergency Contact', type: 'text', placeholder: 'Enter emergency contact name' },
  { name: 'emergencyPhone', label: 'Emergency Phone', type: 'tel', placeholder: 'Enter emergency contact phone' },
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Enter any additional notes' }
];

export const TRANSACTION_FIELDS = [
  { 
    name: 'type', 
    label: 'Type', 
    type: 'select', 
    required: true,
    options: [
      { value: 'Income', label: 'Income' },
      { value: 'Expense', label: 'Expense' }
    ]
  },
  { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'Enter transaction description' },
  { name: 'amount', label: 'Amount', type: 'number', required: true, step: 0.01, placeholder: 'Enter amount' },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { 
    name: 'category', 
    label: 'Category', 
    type: 'select', 
    required: true,
    options: [
      { value: 'Rent', label: 'Rent' },
      { value: 'Taxes', label: 'Taxes' },
      { value: 'Insurance', label: 'Insurance' },
      { value: 'Repair', label: 'Repair' },
      { value: 'Utilities', label: 'Utilities' },
      { value: 'Other', label: 'Other' }
    ]
  },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select', 
    required: true,
    options: [
      { value: 'Completed', label: 'Completed' },
      { value: 'Pending', label: 'Pending' },
      { value: 'Cancelled', label: 'Cancelled' }
    ]
  }
];

export const EXPENSE_FIELDS = [
  { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'Enter expense description' },
  { name: 'amount', label: 'Amount', type: 'number', required: true, min: 0, step: 0.01, placeholder: 'Enter amount' },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { 
    name: 'category', 
    label: 'Category', 
    type: 'select', 
    required: true,
    options: [
      { value: 'Taxes', label: 'Taxes' },
      { value: 'Insurance', label: 'Insurance' },
      { value: 'Repair', label: 'Repair' },
      { value: 'Utilities', label: 'Utilities' },
      { value: 'Cleaning', label: 'Cleaning' },
      { value: 'Landscaping', label: 'Landscaping' },
      { value: 'Other', label: 'Other' }
    ]
  },
  { name: 'vendor', label: 'Vendor', type: 'text', placeholder: 'Enter vendor name' },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select', 
    required: true,
    options: [
      { value: 'Paid', label: 'Paid' },
      { value: 'Pending', label: 'Pending' },
      { value: 'Overdue', label: 'Overdue' }
    ]
  },
  { name: 'receipt', label: 'Receipt Number', type: 'text', placeholder: 'Enter receipt number' },
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Enter any additional notes' }
];

// Helper function to get field configuration by data type
export const getFieldsByType = (dataType) => {
  switch (dataType) {
    case 'properties':
      return PROPERTY_FIELDS;
    case 'tenants':
      return TENANT_FIELDS;
    case 'transactions':
      return TRANSACTION_FIELDS;
    case 'expenses':
      return EXPENSE_FIELDS;
    default:
      return [];
  }
};
