"use client";

import { useState } from 'react';
import UniversalPage from "../../components/shared/UniversalPage";
import PropertyTenantManagement from "../../components/shared/PropertyTenantManagement";
import { getColumnsByType } from "../../config/tableColumns";

export default function Properties() {
  const [showTenantManagement, setShowTenantManagement] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const handleTenantManagementClick = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShowTenantManagement(true);
  };

  const customActions = [
    {
      label: 'Manage Tenants',
      onClick: handleTenantManagementClick,
      className: 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm'
    }
  ];

  return (
    <>
      <UniversalPage
        dataType="properties"
        title="Property Management"
        currentPage="/properties"
        searchFields={['address', 'city', 'tenant']}
        columns={getColumnsByType('properties')}
        emptyMessage="No properties found"
        customActions={customActions}
      />
      
      {showTenantManagement && (
        <PropertyTenantManagement
          propertyId={selectedPropertyId}
          onClose={() => {
            setShowTenantManagement(false);
            setSelectedPropertyId(null);
          }}
        />
      )}
    </>
  );
}