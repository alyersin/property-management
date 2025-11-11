// Filter utility functions
export const filterBySearch = (items, searchTerm, searchFields) => {
  if (!searchTerm || !Array.isArray(items) || !Array.isArray(searchFields)) return items;
  
  return items.filter(item => {
    if (!item || typeof item !== 'object') return false;
    
    return searchFields.some(field => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });
};

export const filterByStatus = (items, filterValue, statusField = 'status') => {
  if (!Array.isArray(items)) return [];
  if (filterValue === 'all') return items;
  
  return items.filter(item => {
    if (!item || typeof item !== 'object') return false;
    return item[statusField] === filterValue;
  });
};

// Individual item filter functions
export const itemMatchesSearch = (item, searchTerm, searchFields) => {
  if (!searchTerm || !Array.isArray(searchFields) || !item || typeof item !== 'object') return true;
  
  return searchFields.some(field => {
    const value = item[field];
    if (value === null || value === undefined) return false;
    return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });
};

export const itemMatchesStatus = (item, filterValue, statusField = 'status') => {
  if (filterValue === 'all' || !item || typeof item !== 'object') return true;
  return item[statusField] === filterValue;
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
