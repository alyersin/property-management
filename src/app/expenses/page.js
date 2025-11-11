"use client";

import UniversalPage from "../../components/shared/UniversalPage";
import { getColumnsByType } from "../../config/tableColumns";
import { DownloadIcon } from "@chakra-ui/icons";

export default function Expenses() {
  return (
    <UniversalPage
      dataType="expenses"
      title="Expenses"
      currentPage="/expenses"
      searchFields={['description', 'notes']}
      columns={getColumnsByType('expenses')}
      actions={[
        { label: "Export", icon: DownloadIcon, variant: "outline" }
      ]}
      emptyMessage="No expenses recorded"
    />
  );
}