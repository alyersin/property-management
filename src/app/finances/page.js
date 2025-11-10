"use client";

import UniversalPage from "../../components/shared/UniversalPage";
import { getColumnsByType } from "../../config/tableColumns";
import { DownloadIcon } from "@chakra-ui/icons";

export default function Finances() {
  return (
    <UniversalPage
      dataType="financialRecords"
      title="Finances & Expenses"
      currentPage="/finances"
      searchFields={['description', 'category', 'vendor']}
      columns={getColumnsByType('financialRecords')}
      actions={[
        { label: "Export", icon: DownloadIcon, variant: "outline" }
      ]}
      emptyMessage="No financial records found"
    />
  );
}