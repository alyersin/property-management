// Form field configurations for different data types

export const PROPERTY_FIELDS = [
  { name: 'city', label: 'City', type: 'text', required: true, placeholder: 'Enter city' },
  { name: 'bedrooms', label: 'Bedrooms', type: 'number', required: true, min: 1, max: 10 },
  { name: 'bathrooms', label: 'Bathrooms', type: 'number', required: true, min: 1, max: 10, step: 0.5 },
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
  }
];

export const TENANT_FIELDS = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Enter tenant name'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'Enter tenant email'
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' }
    ]
  }
];

// Helper function to get field configuration by data type
export const getFieldsByType = (dataType) => {
  switch (dataType) {
    case 'properties':
      return PROPERTY_FIELDS;
    case 'tenants':
      return TENANT_FIELDS;
    default:
      return [];
  }
};
