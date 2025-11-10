"use client";

import { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import PageLayout from "./PageLayout";
import SearchFilter from "./SearchFilter";
import DataTable from "./DataTable";
import FormModal from "./FormModal";
import DynamicForm from "./DynamicForm";
import { useAppData } from "../../hooks/useAppData";
import { getFieldsByType } from "../../config/formFields";
import { FILTER_OPTIONS } from "../../utils/constants";
import { filterBySearch, filterByStatus, itemMatchesSearch, itemMatchesStatus } from "../../utils/helpers";
import ProtectedRoute from "../auth/ProtectedRoute";
import logger from "../../utils/logger";
import { STORAGE_KEYS } from "../../constants/app";

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

  // Load page preferences from localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_KEYS.preferences}_${dataType}`;
    const savedPreferences = localStorage.getItem(storageKey);
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setSearchTerm(parsed.searchTerm || "");
        setFilterValue(parsed.filterValue || "all");
      } catch (error) {
        logger.error('Failed to load page preferences', error);
      }
    }
  }, [dataType]);

  // Save page preferences to localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_KEYS.preferences}_${dataType}`;
    const preferences = {
      searchTerm,
      filterValue,
      lastUpdated: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences));
    } catch (error) {
      logger.error('Failed to save page preferences', error);
    }
  }, [searchTerm, filterValue, dataType]);
  
  const { data, loading, error, create, update, remove } = useAppData(dataType);
  const fields = getFieldsByType(dataType);

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  // Filter data
  const filteredData = safeData.filter(item => 
    itemMatchesSearch(item, searchTerm, searchFields) && 
    itemMatchesStatus(item, filterValue)
  );

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
      logger.data('delete', dataType, item.id);
    } catch (error) {
      logger.error(`Error deleting ${dataType}`, error);
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
      logger.error(`Error saving ${dataType}`, error);
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

  // Map data types to their singular forms
  const singularForm = {
    properties: 'property',
    financialRecords: 'record'
  }[dataType] || dataType.slice(0, -1);

  const displayName = {
    properties: 'properties',
    financialRecords: 'financial records'
  }[dataType] || dataType.replace(/([A-Z])/g, ' $1').toLowerCase().trim();

  return (
    <ProtectedRoute>
      <PageLayout
        title={title}
        actions={[
          { label: `Add ${singularForm}`, icon: AddIcon, onClick: handleAdd },
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
          placeholder={`Search ${displayName}...`}
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
          title={editingItem ? `Edit ${singularForm}` : `Add ${singularForm}`}
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
