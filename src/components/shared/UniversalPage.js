"use client";

import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { Add as AddIcon } from "@chakra-ui/icons";

import PageLayout from "./PageLayout";
import SearchFilter from "./SearchFilter";
import DataTable from "./DataTable";
import FormModal from "./FormModal";
import DynamicForm from "./DynamicForm";
import { useAppData } from "../../hooks/useAppData";
import { getFieldsByType } from "../../config/formFields";
import { FILTER_OPTIONS } from "../../utils/constants";
import { filterBySearch, filterByStatus } from "../../utils/helpers";
import ProtectedRoute from "../auth/ProtectedRoute";

const UniversalPage = ({ 
  dataType, 
  title, 
  currentPage,
  searchFields = [],
  filterOptions = [],
  columns = [],
  actions = [],
  emptyMessage = "No data available"
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  
  const { data, loading, error, create, update, remove } = useAppData(dataType);
  const fields = getFieldsByType(dataType);

  // Filter data
  const filteredData = data
    .filter(item => filterBySearch(item, searchTerm, searchFields))
    .filter(item => filterByStatus(item, filterValue));

  const handleAdd = () => {
    setEditingItem(null);
    onOpen();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    onOpen();
  };

  const handleDelete = async (item) => {
    try {
      await remove(item.id);
    } catch (error) {
      console.error(`Error deleting ${dataType}:`, error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await update(editingItem.id, formData);
      } else {
        await create(formData);
      }
      onClose();
      setEditingItem(null);
    } catch (error) {
      console.error(`Error saving ${dataType}:`, error);
    }
  };

  const handleClose = () => {
    onClose();
    setEditingItem(null);
  };

  // Get filter options for this data type
  const availableFilterOptions = filterOptions.length > 0 
    ? filterOptions 
    : FILTER_OPTIONS[dataType] || [];

  return (
    <ProtectedRoute>
      <PageLayout
        title={title}
        actions={[
          { label: `Add ${dataType.slice(0, -1)}`, icon: AddIcon, onClick: handleAdd },
          ...actions
        ]}
        currentPage={currentPage}
      >
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
          filterOptions={availableFilterOptions}
          placeholder={`Search ${dataType}...`}
        />

        <DataTable
          data={filteredData}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={loading}
          emptyMessage={emptyMessage}
        />

        <FormModal
          isOpen={isOpen}
          onClose={handleClose}
          title={editingItem ? `Edit ${dataType.slice(0, -1)}` : `Add ${dataType.slice(0, -1)}`}
          onSubmit={handleSubmit}
        >
          <DynamicForm
            fields={fields}
            values={editingItem || {}}
            onChange={() => {}} // Handled by DynamicForm internally
            onSubmit={handleSubmit}
            onCancel={handleClose}
            submitLabel={editingItem ? "Update" : "Create"}
            cancelLabel="Cancel"
            isLoading={loading}
          />
        </FormModal>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default UniversalPage;
