"use client";

import UniversalPage from "../../components/shared/UniversalPage";
import { getColumnsByType } from "../../config/tableColumns";
import { DownloadIcon } from "@chakra-ui/icons";

export default function Finances() {
  return (
    <UniversalPage
      dataType="transactions"
      title="Financial Dashboard"
      currentPage="/finances"
      searchFields={['description', 'category', 'property']}
      columns={getColumnsByType('transactions')}
      actions={[
        { label: "Export", icon: DownloadIcon, variant: "outline" }
      ]}
      emptyMessage="No transactions found"
    />
  );
}