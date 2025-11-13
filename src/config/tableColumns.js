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

export const TENANT_COLUMNS = [
  {
    key: 'name',
    label: 'Name',
    render: (value, item) => (
      <div>
        <div style={{ fontWeight: 'bold' }}>{value}</div>
        {item.email && (
          <div style={{ fontSize: '0.875rem', color: '#666' }}>{item.email}</div>
        )}
      </div>
    )
  },
  {
    key: 'phone',
    label: 'Phone',
    render: (value) => value || '—'
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

// Helper function to get column configuration by data type
export const getColumnsByType = (dataType) => {
  switch (dataType) {
    case 'properties':
      return PROPERTY_COLUMNS;
    case 'tenants':
      return TENANT_COLUMNS;
    default:
      return [];
  }
};
