"use client";

import UniversalPage from "../../components/shared/UniversalPage";
import { getColumnsByType } from "../../config/tableColumns";

export default function Properties() {
  return (
    <UniversalPage
      dataType="properties"
      title="Property Management"
      currentPage="/properties"
      searchFields={['city', 'status', 'notes']}
      columns={getColumnsByType('properties')}
      emptyMessage="No properties found"
    />
  );
}