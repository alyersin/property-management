// Filter utility functions
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
