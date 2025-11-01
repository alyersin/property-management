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

export const TENANT_COLUMNS = [
  {
    key: 'name',
    label: 'Name',
    render: (value, item) => (
      <div>
        <div style={{ fontWeight: 'bold' }}>{value}</div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>{item.email}</div>
      </div>
    )
  },
  {
    key: 'phone',
    label: 'Phone'
  },
  {
    key: 'propertyAddress',
    label: 'Property',
    render: (value) => value || (
      <div style={{ color: '#666' }}>No property assigned</div>
    )
  },
  {
    key: 'rentAmount',
    label: 'Rent',
    render: (value) => value ? (
      <div style={{ fontWeight: 'bold', color: '#22c55e' }}>
        ${value.toLocaleString()}
      </div>
    ) : (
      <div style={{ color: '#666' }}>-</div>
    )
  },
  {
    key: 'status',
    label: 'Status'
  }
];

export const TRANSACTION_COLUMNS = [
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
    render: (value) => (
      <div style={{ 
        fontWeight: 'bold', 
        color: value >= 0 ? '#22c55e' : '#ef4444' 
      }}>
        {value >= 0 ? '+' : ''}${Math.abs(value).toLocaleString()}
      </div>
    )
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
    render: (value) => (
      <div style={{ fontWeight: 'bold', color: '#ef4444' }}>
        ${value.toLocaleString()}
      </div>
    )
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
    key: 'vendor',
    label: 'Vendor'
  },
  {
    key: 'status',
    label: 'Status'
  }
];

// Helper function to get column configuration by data type
export const getColumnsByType = (dataType) => {
  switch (dataType) {
    case 'properties':
      return PROPERTY_COLUMNS;
    case 'tenants':
      return TENANT_COLUMNS;
    case 'transactions':
      return TRANSACTION_COLUMNS;
    case 'expenses':
      return EXPENSE_COLUMNS;
    default:
      return [];
  }
};
