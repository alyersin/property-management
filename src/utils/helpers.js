import { STATUS_COLORS, CATEGORY_COLORS } from './constants';

// Color utility functions
export const getStatusColor = (status, type = 'property') => {
  return STATUS_COLORS[type]?.[status] || "gray";
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || "gray";
};


// Filter utility functions
export const filterBySearch = (items, searchTerm, searchFields) => {
  if (!searchTerm) return items;
  
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );
};

export const filterByStatus = (items, filterValue, statusField = 'status') => {
  if (filterValue === 'all') return items;
  return items.filter(item => item[statusField] === filterValue);
};

// Format utility functions
export const formatCurrency = (amount) => {
  return `$${amount.toLocaleString()}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

// Calculation utility functions
export const calculateTotal = (items, amountField = 'amount', filterFn = () => true) => {
  return items
    .filter(filterFn)
    .reduce((sum, item) => sum + item[amountField], 0);
};

export const calculateNetIncome = (income, expenses) => {
  return income - expenses;
};
