"use client";

import UniversalPage from "../../components/shared/UniversalPage";
import { getColumnsByType } from "../../config/tableColumns";

export default function Tenants() {
  return (
    <UniversalPage
      dataType="tenants"
      title="Tenant Management"
      currentPage="/tenants"
      searchFields={['name', 'email', 'propertyAddress']}
      columns={getColumnsByType('tenants')}
      emptyMessage="No tenants found"
    />
  );
}