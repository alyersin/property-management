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
  },
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Enter any additional notes' }
];

export const EXPENSE_FIELDS = [
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    required: true,
    placeholder: 'Enter expense description'
  },
  {
    name: 'amount',
    label: 'Amount',
    type: 'number',
    required: true,
    step: 0.01,
    placeholder: 'Enter amount'
  },
  {
    name: 'date',
    label: 'Date',
    type: 'date',
    required: true
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'textarea',
    placeholder: 'Enter any additional notes'
  }
];

// Helper function to get field configuration by data type
export const getFieldsByType = (dataType) => {
  switch (dataType) {
    case 'properties':
      return PROPERTY_FIELDS;
    case 'expenses':
      return EXPENSE_FIELDS;
    default:
      return [];
  }
};
