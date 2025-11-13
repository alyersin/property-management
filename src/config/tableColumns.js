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
        {item.tenant_count > 0 && (
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
            {item.tenant_count} {item.tenant_count === 1 ? 'tenant' : 'tenants'}
          </div>
        )}
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
        {item.email && (
          <div style={{ fontSize: '0.875rem', color: '#666' }}>{item.email}</div>
        )}
        {item.property_count > 0 && (
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
            {item.property_count} {item.property_count === 1 ? 'property' : 'properties'}
          </div>
        )}
      </div>
    )
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
    default:
      return [];
  }
};
