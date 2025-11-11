// Table column configurations for different data types

export const PROPERTY_COLUMNS = [
  {
    key: 'details',
    label: 'Details',
    render: (_, item) => (
      <div>
        <div style={{ fontWeight: 'bold' }}>{item.city}</div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          {item.bedrooms} bed, {item.bathrooms} bath
        </div>
      </div>
    )
  },
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'notes',
    label: 'Notes',
    render: (value) => value || '—'
  }
];

export const EXPENSE_COLUMNS = [
  {
    key: 'description',
    label: 'Description'
  },
  {
    key: 'amount',
    label: 'Amount',
    render: (value, item) => {
      const numericValue = Number(value);
      return (
        <div style={{ fontWeight: 'bold', color: '#ef4444' }}>
          -${Math.abs(numericValue).toLocaleString()}
        </div>
      );
    }
  },
  {
    key: 'date',
    label: 'Date',
    render: (value) => new Date(value).toLocaleDateString()
  },
  {
    key: 'notes',
    label: 'Notes',
    render: (value) => value || '—'
  }
];

// Helper function to get column configuration by data type
export const getColumnsByType = (dataType) => {
  switch (dataType) {
    case 'properties':
      return PROPERTY_COLUMNS;
    case 'expenses':
      return EXPENSE_COLUMNS;
    default:
      return [];
  }
};
