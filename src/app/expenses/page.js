"use client";

import UniversalPage from "../../components/shared/UniversalPage";
import { getColumnsByType } from "../../config/tableColumns";

export default function Expenses() {
  return (
    <UniversalPage
      dataType="expenses"
      title="Expense Management"
      currentPage="/expenses"
      searchFields={['description', 'category', 'vendor']}
      columns={getColumnsByType('expenses')}
      emptyMessage="No expenses found"
    />
  );
}