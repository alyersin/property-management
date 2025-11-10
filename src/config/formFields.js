// Form field configurations for different data types

export const PROPERTY_FIELDS = [
  { name: 'address', label: 'Address', type: 'text', required: true, placeholder: 'Enter property address' },
  { name: 'city', label: 'City', type: 'text', required: true, placeholder: 'Enter city' },
  { name: 'bedrooms', label: 'Bedrooms', type: 'number', required: true, min: 1, max: 10 },
  { name: 'bathrooms', label: 'Bathrooms', type: 'number', required: true, min: 1, max: 10, step: 0.5 },
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
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Enter any additional notes' }
];

export const FINANCIAL_RECORD_FIELDS = [
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
  { name: 'description', label: 'Description', type: 'text', required: true, placeholder: 'Enter description' },
  { name: 'amount', label: 'Amount', type: 'number', required: true, step: 0.01, placeholder: 'Enter amount' },
  { name: 'date', label: 'Date', type: 'date', required: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    required: true,
    options: [
      { value: 'Rent', label: 'Rent' },
      { value: 'Utilities', label: 'Utilities' }
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
      { value: 'Overdue', label: 'Overdue' }
    ]
  },
  { name: 'vendor', label: 'Vendor', type: 'text', placeholder: 'Enter vendor name (optional)' },
  { name: 'receipt', label: 'Receipt Number', type: 'text', placeholder: 'Enter receipt (optional)' },
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Enter any additional notes' }
];

// Helper function to get field configuration by data type
export const getFieldsByType = (dataType) => {
  switch (dataType) {
    case 'properties':
      return PROPERTY_FIELDS;
    case 'financialRecords':
      return FINANCIAL_RECORD_FIELDS;
    default:
      return [];
  }
};
