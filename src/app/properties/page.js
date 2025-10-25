"use client";

import UniversalPage from "../../components/shared/UniversalPage";
import { getColumnsByType } from "../../config/tableColumns";

export default function Properties() {
  return (
    <UniversalPage
      dataType="properties"
      title="Property Management"
      currentPage="/properties"
      searchFields={['address', 'city', 'tenant']}
      columns={getColumnsByType('properties')}
      emptyMessage="No properties found"
    />
  );
}