// Table column configurations for different data types

export const PROPERTY_COLUMNS = [
  {
    key: 'address',
    label: 'Address',
    render: (value, item) => (
      <div>
        <div style={{ fontWeight: 'bold' }}>{value}</div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          {item.city}
        </div>
      </div>
    )
  },
  {
    key: 'details',
    label: 'Details',
    render: (_, item) => (
      <div>
        <div style={{ fontSize: '0.875rem' }}>{item.bedrooms} bed, {item.bathrooms} bath</div>
      </div>
    )
  },
  {
    key: 'rent',
    label: 'Rent',
    render: (value) => (
      <div style={{ fontWeight: 'bold', color: '#22c55e' }}>
        ${value.toLocaleString()}
      </div>
    )
  },
  {
    key: 'status',
    label: 'Status'
  }
];

export const FINANCIAL_RECORD_COLUMNS = [
  {
    key: 'type',
    label: 'Type',
    render: (value) => (
      <div style={{ 
        fontWeight: 'bold', 
        color: value === 'Income' ? '#22c55e' : '#ef4444' 
      }}>
        {value}
      </div>
    )
  },
  {
    key: 'description',
    label: 'Description'
  },
  {
    key: 'amount',
    label: 'Amount',
    render: (value, item) => {
      const numericValue = Number(value);
      const isIncome = item.type === 'Income';
      const color = isIncome ? '#22c55e' : '#ef4444';
      const prefix = isIncome ? '+' : '-';
      return (
        <div style={{ fontWeight: 'bold', color }}>
          {prefix}${Math.abs(numericValue).toLocaleString()}
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
    key: 'category',
    label: 'Category'
  },
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'vendor',
    label: 'Vendor'
  }
];

// Helper function to get column configuration by data type
export const getColumnsByType = (dataType) => {
  switch (dataType) {
    case 'properties':
      return PROPERTY_COLUMNS;
    case 'financialRecords':
      return FINANCIAL_RECORD_COLUMNS;
    default:
      return [];
  }
};
