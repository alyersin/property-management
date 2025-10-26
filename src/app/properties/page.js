"use client";

import { useState } from 'react';
import UniversalPage from "../../components/shared/UniversalPage";
import PropertyAmenities from "../../components/shared/PropertyAmenities";
import PropertyTenantManagement from "../../components/shared/PropertyTenantManagement";
import { getColumnsByType } from "../../config/tableColumns";

export default function Properties() {
  const [showAmenities, setShowAmenities] = useState(false);
  const [showTenantManagement, setShowTenantManagement] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const handleAmenitiesClick = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShowAmenities(true);
  };

  const handleTenantManagementClick = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShowTenantManagement(true);
  };

  const customActions = [
    {
      label: 'Manage Amenities',
      onClick: handleAmenitiesClick,
      className: 'bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm'
    },
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
      
      {showAmenities && (
        <PropertyAmenities
          propertyId={selectedPropertyId}
          onClose={() => {
            setShowAmenities(false);
            setSelectedPropertyId(null);
          }}
        />
      )}
      
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